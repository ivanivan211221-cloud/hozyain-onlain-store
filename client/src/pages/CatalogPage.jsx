import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { http } from "../api/http";
import ProductCard from "../components/ProductCard";
import SkeletonCard from "../components/SkeletonCard";
import { useSearchParams } from "react-router-dom";

export default function CatalogPage() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ q: "", category: searchParams.get("category") || "", min: 0, max: 999999, sort: "newest" });

  useEffect(() => {
    http.get("/categories").then(({ data }) => setCategories(data));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams(filters).toString();
    http.get(`/products?${params}`).then(({ data }) => setProducts(data)).finally(() => setLoading(false));
  }, [filters]);

  const items = useMemo(() => products, [products]);

  return (
    <div className="stack">
      <h1>Каталог материалов</h1>
      <div className="catalog-layout">
        <aside className="filters glass">
          <input placeholder="Поиск" value={filters.q} onChange={(e) => setFilters((p) => ({ ...p, q: e.target.value }))} />
          <select value={filters.category} onChange={(e) => setFilters((p) => ({ ...p, category: e.target.value }))}>
            <option value="">Все категории</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select value={filters.sort} onChange={(e) => setFilters((p) => ({ ...p, sort: e.target.value }))}>
            <option value="newest">Сначала новые</option>
            <option value="priceAsc">Цена по возрастанию</option>
            <option value="priceDesc">Цена по убыванию</option>
            <option value="stockDesc">По наличию</option>
          </select>
        </aside>

        <motion.div className="grid products-grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {loading ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />) : items.map((p) => <ProductCard key={p.id} product={p} />)}
        </motion.div>
      </div>
    </div>
  );
}
