import { Link } from "react-router-dom";
import { useShop } from "../context/ShopContext";

export default function CartPage() {
  const fallbackImage =
    "https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=1200&auto=format&fit=crop";
  const { cart, total, setQty, removeFromCart } = useShop();
  if (!cart.length) {
    return (
      <div className="card empty-state">
        <img
          loading="lazy"
          src="https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=1400&auto=format&fit=crop"
          alt="Пустая корзина покупок"
          className="empty-img"
        />
        <div className="stack">
          <h3>Корзина пока пуста</h3>
          <p className="muted">Добавьте товары из каталога, чтобы оформить заказ.</p>
          <Link className="btn btn-primary" to="/catalog">В каталог</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="stack">
      <h1>Корзина</h1>
      {cart.map((item) => (
        <div key={item.id} className="card row between">
          <div className="row gap-sm">
            <img
              loading="lazy"
              src={item.image || fallbackImage}
              alt={item.title}
              className="cart-item-img"
              onError={(e) => {
                e.currentTarget.src = fallbackImage;
              }}
            />
            <div>
            <strong>{item.title}</strong>
            <p className="muted">{Number(item.price).toLocaleString("ru-RU")} ₽</p>
            </div>
          </div>
          <div className="row gap-sm">
            <input type="number" min="1" value={item.qty} onChange={(e) => setQty(item.id, Number(e.target.value))} />
            <button className="btn" onClick={() => removeFromCart(item.id)}>Удалить</button>
          </div>
        </div>
      ))}
      <div className="card row between">
        <strong>Итого: {total.toLocaleString("ru-RU")} ₽</strong>
        <Link className="btn btn-primary" to="/checkout">Оформить</Link>
      </div>
    </div>
  );
}
