const express = require("express");
const { Op, fn, col, where: sqlWhere } = require("sequelize");
const { z } = require("zod");
const { parse } = require("csv-parse/sync");
const { auth, allowRoles } = require("../middleware/auth");
const { User, Product, Order, Category, Review, OrderItem } = require("../models");
const { slugify } = require("../utils/helpers");

const router = express.Router();

router.use(auth, allowRoles("ADMIN", "MANAGER", "CONTENT_MANAGER"));

router.get("/dashboard", async (_req, res) => {
  const [ordersCount, usersCount, productsCount, reviewsPending] = await Promise.all([
    Order.count(),
    User.count(),
    Product.count(),
    Review.count({ where: { isPublished: false } }),
  ]);

  const latestOrders = await Order.findAll({ limit: 6, order: [["createdAt", "DESC"]] });
  const totalRevenue = await Order.sum("total", { where: { isPaid: true } });

  res.json({
    stats: { ordersCount, usersCount, productsCount, reviewsPending, totalRevenue: Number(totalRevenue || 0) },
    latestOrders,
  });
});

router.get("/products", async (req, res) => {
  const normalizedQ = String(req.query.q || "").trim().toLowerCase();
  const where = normalizedQ
    ? { [Op.and]: [sqlWhere(fn("lower", col("title")), { [Op.like]: `%${normalizedQ}%` })] }
    : {};
  const products = await Product.findAll({ where, include: [Category], order: [["createdAt", "DESC"]] });
  res.json(products);
});

router.get("/products/export/csv", allowRoles("ADMIN", "MANAGER"), async (_req, res) => {
  const products = await Product.findAll({ include: [Category], order: [["id", "ASC"]] });
  const header = "id,title,slug,price,stock,category\n";
  const rows = products
    .map((p) => `${p.id},"${String(p.title).replace(/"/g, '""')}",${p.slug},${p.price},${p.stock},"${p.Category?.name || ""}"`)
    .join("\n");
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", "attachment; filename=products.csv");
  res.send(header + rows);
});

router.post("/products/import/csv", allowRoles("ADMIN", "MANAGER"), async (req, res) => {
  const schema = z.object({ csv: z.string().min(1) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Ошибка валидации" });

  const records = parse(parsed.data.csv, { columns: true, skip_empty_lines: true, trim: true });
  let imported = 0;
  for (const record of records) {
    const title = record.title?.trim();
    if (!title) continue;
    const categoryName = record.category || "Без категории";
    const [category] = await Category.findOrCreate({
      where: { slug: slugify(categoryName) },
      defaults: { name: categoryName, slug: slugify(categoryName) },
    });
    await Product.findOrCreate({
      where: { slug: record.slug?.trim() || slugify(title) },
      defaults: {
        title,
        slug: record.slug?.trim() || slugify(title),
        description: record.description || `Товар ${title}`,
        price: Number(record.price) || 0,
        stock: Number(record.stock) || 0,
        categoryId: category.id,
      },
    });
    imported += 1;
  }
  res.json({ imported });
});

router.post("/products", allowRoles("ADMIN", "MANAGER"), async (req, res) => {
  const schema = z.object({
    title: z.string().min(3),
    description: z.string().min(10),
    price: z.number().positive(),
    oldPrice: z.number().positive().optional(),
    categoryId: z.number(),
    stock: z.number().int().nonnegative(),
    image: z.string().url().optional(),
    gallery: z.array(z.string().url()).optional(),
    brand: z.string().optional(),
    isPublished: z.boolean().optional(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Ошибка валидации" });
  const product = await Product.create({ ...parsed.data, slug: slugify(parsed.data.title) });
  res.status(201).json(product);
});

router.put("/products/:id", allowRoles("ADMIN", "MANAGER"), async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ message: "Товар не найден" });
  await product.update({ ...req.body, slug: req.body.title ? slugify(req.body.title) : product.slug });
  res.json(product);
});

router.delete("/products/:id", allowRoles("ADMIN"), async (req, res) => {
  await Product.destroy({ where: { id: req.params.id } });
  res.status(204).send();
});

router.get("/orders", async (req, res) => {
  const status = req.query.status || "";
  const where = status ? { status } : {};
  const orders = await Order.findAll({
    where,
    include: [{ model: User, attributes: ["name", "email"] }, { model: OrderItem, include: [Product] }],
    order: [["createdAt", "DESC"]],
  });
  res.json(orders);
});

router.patch("/orders/:id/status", allowRoles("ADMIN", "MANAGER"), async (req, res) => {
  const schema = z.object({
    status: z.enum(["NEW", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Ошибка валидации" });
  const order = await Order.findByPk(req.params.id);
  if (!order) return res.status(404).json({ message: "Заказ не найден" });
  order.status = parsed.data.status;
  await order.save();
  res.json(order);
});

router.get("/users", async (_req, res) => {
  const users = await User.findAll({ attributes: ["id", "name", "email", "role", "isBlocked", "createdAt"] });
  res.json(users);
});

router.patch("/users/:id", allowRoles("ADMIN"), async (req, res) => {
  const schema = z.object({
    role: z.enum(["ADMIN", "MANAGER", "CONTENT_MANAGER", "CUSTOMER"]).optional(),
    isBlocked: z.boolean().optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Ошибка валидации" });
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ message: "Пользователь не найден" });
  await user.update(parsed.data);
  res.json({ id: user.id, role: user.role, isBlocked: user.isBlocked });
});

router.get("/reviews", async (_req, res) => {
  const reviews = await Review.findAll({ include: [User, Product], order: [["createdAt", "DESC"]] });
  res.json(reviews);
});

router.patch("/reviews/:id", allowRoles("ADMIN", "CONTENT_MANAGER"), async (req, res) => {
  const review = await Review.findByPk(req.params.id);
  if (!review) return res.status(404).json({ message: "Отзыв не найден" });
  review.isPublished = !!req.body.isPublished;
  await review.save();
  res.json(review);
});

router.get("/categories", async (_req, res) => {
  const categories = await Category.findAll({ order: [["name", "ASC"]] });
  res.json(categories);
});

router.post("/categories", allowRoles("ADMIN", "CONTENT_MANAGER"), async (req, res) => {
  const schema = z.object({ name: z.string().min(2), parentId: z.number().nullable().optional() });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Ошибка валидации" });
  const category = await Category.create({
    name: parsed.data.name,
    slug: slugify(parsed.data.name),
    parentId: parsed.data.parentId || null,
  });
  res.status(201).json(category);
});

module.exports = router;
