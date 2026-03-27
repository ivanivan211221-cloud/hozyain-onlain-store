import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { http } from "../api/http";

export default function AccountPage() {
  const { user, login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user) return;
    http.get("/orders/my").then(({ data }) => setOrders(data));
  }, [user]);

  const submit = async (e) => {
    e.preventDefault();
    if (isRegister) await register(form);
    else await login({ email: form.email, password: form.password });
    toast.success("Добро пожаловать");
  };

  if (!user) {
    return (
      <form className="card stack" onSubmit={submit}>
        <h1>{isRegister ? "Регистрация" : "Вход"}</h1>
        {isRegister && <input required placeholder="Имя" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />}
        <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
        <input required type="password" placeholder="Пароль" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} />
        <button className="btn btn-primary">{isRegister ? "Создать аккаунт" : "Войти"}</button>
        <button type="button" className="btn" onClick={() => setIsRegister((p) => !p)}>
          {isRegister ? "У меня уже есть аккаунт" : "Создать аккаунт"}
        </button>
      </form>
    );
  }

  return (
    <div className="stack">
      <h1>Личный кабинет</h1>
      <div className="card">Здравствуйте, <strong>{user.name}</strong> ({user.role})</div>
      <section className="stack">
        <h3>История заказов</h3>
        {orders.length ? orders.map((o) => (
          <div key={o.id} className="card">
            <strong>Заказ #{o.id}</strong> — {o.status} — {Number(o.total).toLocaleString("ru-RU")} ₽
          </div>
        )) : <p className="muted">Заказов пока нет</p>}
      </section>
    </div>
  );
}
