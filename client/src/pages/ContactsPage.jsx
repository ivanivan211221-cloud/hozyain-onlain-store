export default function ContactsPage() {
  return (
    <section className="stack">
      <article className="card stack">
        <h1>Контакты</h1>
        <p>Телефон: +7 (900) 000-00-00</p>
        <p>Email: info@hozyan.ru</p>
        <p>Адрес: г. Москва, ул. Строителей, 1</p>
      </article>
      <div className="media-grid">
        <img
          loading="lazy"
          className="media-img"
          src="https://images.unsplash.com/photo-1556155092-490a1ba16284?q=80&w=1400&auto=format&fit=crop"
          alt="Офис и отдел продаж"
        />
        <img
          loading="lazy"
          className="media-img"
          src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1400&auto=format&fit=crop"
          alt="Логистика и доставка"
        />
      </div>
    </section>
  );
}
