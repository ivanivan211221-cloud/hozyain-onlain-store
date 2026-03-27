import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { http } from "../../api/http";

const empty = { title: "", description: "", price: 0, stock: 0, categoryId: "", image: "", brand: "" };

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(empty);

  const load = async () => {
    const [{ data: p }, { data: c }] = await Promise.all([http.get("/admin/products"), http.get("/admin/categories")]);
    setProducts(p);
    setCategories(c);
  };

  useEffect(() => {
    load();
  }, []);

  const create = async (e) => {
    e.preventDefault();
    await http.post("/admin/products", { ...form, price: Number(form.price), stock: Number(form.stock), categoryId: Number(form.categoryId) });
    setForm(empty);
    toast.success("Товар создан");
    load();
  };

  const exportCsv = async () => {
    const { data } = await http.get("/admin/products/export/csv", { responseType: "blob" });
    const url = URL.createObjectURL(data);
    const a = document.createElement("a");
    a.href = url;
    a.download = "products.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const importCsv = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const csv = await file.text();
    const { data } = await http.post("/admin/products/import/csv", { csv });
    toast.success(`Импортировано: ${data.imported}`);
    load();
  };

  return (
    <div className="stack">
      <h1>Управление товарами</h1>
      <div className="row gap-sm">
        <button className="btn" onClick={exportCsv}>Экспорт CSV</button>
        <label className="btn">
          Импорт CSV
          <input type="file" accept=".csv" onChange={importCsv} style={{ display: "none" }} />
        </label>
      </div>
      <form className="card grid cols-2" onSubmit={create}>
        <input required placeholder="Название" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
        <input placeholder="Бренд" value={form.brand} onChange={(e) => setForm((p) => ({ ...p, brand: e.target.value }))} />
        <textarea required placeholder="Описание" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
        <input placeholder="URL изображения" value={form.image} onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))} />
        <input type="number" required placeholder="Цена" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} />
        <input type="number" required placeholder="Остаток" value={form.stock} onChange={(e) => setForm((p) => ({ ...p, stock: e.target.value }))} />
        <select required value={form.categoryId} onChange={(e) => setForm((p) => ({ ...p, categoryId: e.target.value }))}>
          <option value="">Категория</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button className="btn btn-primary">Добавить товар</button>
      </form>

      <div className="table-wrap">
        <table className="table">
          <thead><tr><th>ID</th><th>Название</th><th>Категория</th><th>Цена</th><th>Остаток</th></tr></thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td><td>{p.title}</td><td>{p.Category?.name}</td><td>{Number(p.price).toLocaleString("ru-RU")} ₽</td><td>{p.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
