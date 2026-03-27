const express = require("express");
const { z } = require("zod");
const { Order, OrderItem, Product } = require("../models");
const { auth } = require("../middleware/auth");
const { asNumber } = require("../utils/helpers");

const router = express.Router();

router.post("/", auth, async (req, res) => {
  const schema = z.object({
    customerName: z.string().min(2),
    phone: z.string().min(6),
    address: z.string().min(5),
    paymentMethod: z.enum(["CARD", "CASH"]),
    items: z.array(z.object({ productId: z.number(), qty: z.number().int().positive() })).min(1),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Ошибка валидации" });

  const productIds = parsed.data.items.map((i) => i.productId);
  const products = await Product.findAll({ where: { id: productIds, isPublished: true } });
  const productMap = new Map(products.map((p) => [p.id, p]));

  let total = 0;
  for (const item of parsed.data.items) {
    const product = productMap.get(item.productId);
    if (!product) return res.status(400).json({ message: `Товар ${item.productId} недоступен` });
    if (product.stock < item.qty) return res.status(400).json({ message: `Недостаточно остатка: ${product.title}` });
    total += asNumber(product.price) * item.qty;
  }

  const order = await Order.create({
    userId: req.user.id,
    customerName: parsed.data.customerName,
    phone: parsed.data.phone,
    address: parsed.data.address,
    paymentMethod: parsed.data.paymentMethod,
    total,
    isPaid: parsed.data.paymentMethod === "CARD",
    status: parsed.data.paymentMethod === "CARD" ? "PAID" : "NEW",
  });

  for (const item of parsed.data.items) {
    const product = productMap.get(item.productId);
    await OrderItem.create({
      orderId: order.id,
      productId: item.productId,
      qty: item.qty,
      price: product.price,
    });
    product.stock = product.stock - item.qty;
    await product.save();
  }

  res.status(201).json({ orderId: order.id, total, status: order.status });
});

router.get("/my", auth, async (req, res) => {
  const orders = await Order.findAll({
    where: { userId: req.user.id },
    include: [{ model: OrderItem, include: [{ model: Product, attributes: ["title", "image", "slug"] }] }],
    order: [["createdAt", "DESC"]],
  });
  res.json(orders);
});

module.exports = router;
