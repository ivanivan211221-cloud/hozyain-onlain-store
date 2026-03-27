export default function AboutPage() {
  return (
    <section className="stack">
      <article className="card stack">
        <h1>О компании</h1>
        <p>«Хозяин» — современный интернет-магазин строительных материалов для частных клиентов и b2b.</p>
        <p>Мы доставляем по городу и области, работаем с оптовыми заказами и проектными сметами.</p>
      </article>
      <div className="media-grid">
        <img
          loading="lazy"
          className="media-img"
          src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1400&auto=format&fit=crop"
          alt="Строительные материалы на объекте"
        />
        <img
          loading="lazy"
          className="media-img"
          src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1400&auto=format&fit=crop"
          alt="Склад строительных материалов"
        />
      </div>
    </section>
  );
}
