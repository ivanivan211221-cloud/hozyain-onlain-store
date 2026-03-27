import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { http } from "../api/http";
import { useShop } from "../context/ShopContext";
import { useAuth } from "../context/AuthContext";

export default function ProductPage() {
  const fallbackImage =
    "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?q=80&w=1400&auto=format&fit=crop";
  const { slug } = useParams();
  const { addToCart } = useShop();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [review, setReview] = useState({ rating: 5, text: "" });

  useEffect(() => {
    http.get(`/products/${slug}`).then(({ data }) => setProduct(data));
  }, [slug]);

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Нужно войти в аккаунт");
    await http.post(`/reviews/${product.id}`, { ...review, rating: Number(review.rating) });
    setReview({ rating: 5, text: "" });
    toast.success("Отзыв отправлен на модерацию");
  };

  if (!product) return <div className="card">Загрузка товара...</div>;

  return (
    <div className="product-page">
      <img
        loading="lazy"
        src={product.image || fallbackImage}
        alt={product.title}
        className="product-page-img"
        onError={(e) => {
          e.currentTarget.src = fallbackImage;
        }}
      />
      <div className="stack">
        <h1>{product.title}</h1>
        <p>{product.description}</p>
        <strong className="price-big">{Number(product.price).toLocaleString("ru-RU")} ₽</strong>
        <div className="row gap-sm">
          <button className="btn btn-primary" onClick={() => addToCart(product)}>Добавить в корзину</button>
          <button className="btn" onClick={() => { addToCart(product); toast.success("Заявка 1-клик оформлена"); }}>Купить в 1 клик</button>
        </div>

        <section className="card">
          <h3>Отзывы</h3>
          {product.Reviews?.length ? product.Reviews.map((r) => <p key={r.id}>★{r.rating} — {r.text} ({r.User?.name})</p>) : <p className="muted">Пока отзывов нет</p>}
          <form className="stack" onSubmit={submitReview}>
            <select value={review.rating} onChange={(e) => setReview((p) => ({ ...p, rating: e.target.value }))}>
              {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} звезд</option>)}
            </select>
            <textarea rows={3} value={review.text} onChange={(e) => setReview((p) => ({ ...p, text: e.target.value }))} placeholder="Ваш отзыв" />
            <button className="btn btn-primary">Отправить отзыв</button>
          </form>
        </section>
      </div>
    </div>
  );
}
