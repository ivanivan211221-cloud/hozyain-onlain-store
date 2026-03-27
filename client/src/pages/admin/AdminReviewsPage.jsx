import { useEffect, useState } from "react";
import { http } from "../../api/http";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const load = () => http.get("/admin/reviews").then(({ data }) => setReviews(data));
  useEffect(() => { load(); }, []);

  const toggle = async (id, isPublished) => {
    await http.patch(`/admin/reviews/${id}`, { isPublished });
    load();
  };

  return (
    <div className="stack">
      <h1>Модерация отзывов</h1>
      {reviews.map((r) => (
        <div className="card row between" key={r.id}>
          <div>
            <strong>{r.Product?.title}</strong>: {r.text}
          </div>
          <label className="row gap-sm">
            Опубликован
            <input type="checkbox" checked={r.isPublished} onChange={(e) => toggle(r.id, e.target.checked)} />
          </label>
        </div>
      ))}
    </div>
  );
}
