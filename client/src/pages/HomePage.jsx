import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { http } from "../api/http";
import ProductCard from "../components/ProductCard";
import SkeletonCard from "../components/SkeletonCard";
import { Link } from "react-router-dom";

export default function HomePage() {
  const bannerImage =
    "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1920&auto=format&fit=crop";
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const discounted = products.filter((p) => p.oldPrice && Number(p.oldPrice) > Number(p.price));

  useEffect(() => {
    Promise.all([http.get("/products?sort=newest"), http.get("/categories")])
      .then(([productsData, categoriesData]) => {
        setProducts(productsData.data.slice(0, 8));
        setCategories(categoriesData.data.slice(0, 8));
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="stack">
      <section className="showcase-grid">
        <motion.div
          className="hero-banner hero-modern"
          style={{
            backgroundImage: `linear-gradient(95deg, rgba(11, 25, 59, 0.66), rgba(11, 25, 59, 0.24)), url(${bannerImage})`,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <div className="hero-overlay">
            <p className="hero-kicker">Интернет-магазин строительных материалов</p>
            <h1>Современный магазин для стройки и ремонта</h1>
            <p>Быстрый подбор, честные цены и большой выбор в одном месте.</p>
            <div className="row gap-sm">
              <Link className="btn btn-primary" to="/catalog">Перейти в каталог</Link>
              <Link className="btn btn-ghost" to="/about">О компании</Link>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="category-strip card">
        <Link to="/catalog" className="category-pill active">Скидки</Link>
        {categories.map((c) => (
          <Link key={c.id} to={`/catalog?category=${c.id}`} className="category-pill">
            {c.name}
          </Link>
        ))}
      </section>

      <section>
        <div className="row between">
          <h2>Категория: Скидки</h2>
          <Link to="/catalog" className="btn btn-ghost">Все товары</Link>
        </div>
        <motion.div
          className="grid products-grid"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : (discounted.length ? discounted : products).slice(0, 8).map((p) => <ProductCard key={p.id} product={p} />)}
        </motion.div>
      </section>
    </div>
  );
}
