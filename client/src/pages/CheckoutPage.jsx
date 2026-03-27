import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { http } from "../api/http";
import { useShop } from "../context/ShopContext";

export default function CheckoutPage() {
  const { cart, total, clearCart } = useShop();
  const navigate = useNavigate();
  const [form, setForm] = useState({ customerName: "", phone: "", address: "", paymentMethod: "CARD" });

  const submit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      items: cart.map((i) => ({ productId: i.id, qty: i.qty })),
    };
    const { data } = await http.post("/orders", payload);
    clearCart();
    toast.success(`Заказ #${data.orderId} создан`);
    navigate("/account");
  };

  return (
    <form className="stack card" onSubmit={submit}>
      <h1>Оформление заказа</h1>
      <input required placeholder="Имя" value={form.customerName} onChange={(e) => setForm((p) => ({ ...p, customerName: e.target.value }))} />
      <input required placeholder="Телефон" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} />
      <input required placeholder="Адрес" value={form.address} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} />
      <select value={form.paymentMethod} onChange={(e) => setForm((p) => ({ ...p, paymentMethod: e.target.value }))}>
        <option value="CARD">Онлайн-оплата</option>
        <option value="CASH">При получении</option>
      </select>
      <strong>К оплате: {total.toLocaleString("ru-RU")} ₽</strong>
      <button className="btn btn-primary">Подтвердить заказ</button>
    </form>
  );
}
