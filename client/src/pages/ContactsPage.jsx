import { useState } from "react";
import toast from "react-hot-toast";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

const CONTACT_BLOCKS = [
  {
    icon: Phone,
    label: "Телефон",
    main: "8 800 555-35-35",
    sub: "Бесплатно по России",
    href: "tel:+78005553535",
  },
  {
    icon: Mail,
    label: "Email",
    main: "info@hozyan.ru",
    sub: "Ответим в течение часа",
    href: "mailto:info@hozyan.ru",
  },
  {
    icon: MapPin,
    label: "Адрес",
    main: "Москва, ул. Строителей, 12",
    sub: "Склад и пункт выдачи",
    href: null,
  },
  {
    icon: Clock,
    label: "График работы",
    main: "Пн–Вс, 8:00–21:00",
    sub: "Приём заказов онлайн 24/7",
    href: null,
  },
];

export default function ContactsPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const submit = (e) => {
    e.preventDefault();
    toast.success("Спасибо! Мы свяжемся с вами в ближайшее время.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <section className="contacts-page">
      <header className="contacts-header">
        <h1>Контакты</h1>
        <p className="muted contacts-sub">Мы на связи — звоните, пишите, приезжайте.</p>
      </header>

      <div className="contacts-grid">
        <ul className="contacts-cards">
          {CONTACT_BLOCKS.map(({ icon: Icon, label, main, sub, href }) => (
            <li key={label} className="contacts-info-card card">
              <span className="contacts-info-icon" aria-hidden>
                <Icon size={22} strokeWidth={2} />
              </span>
              <div className="contacts-info-body">
                <span className="contacts-info-label muted">{label}</span>
                {href ? (
                  <a className="contacts-info-main" href={href}>
                    {main}
                  </a>
                ) : (
                  <span className="contacts-info-main">{main}</span>
                )}
                <span className="contacts-info-sub muted">{sub}</span>
              </div>
            </li>
          ))}
        </ul>

        <form className="contacts-form card" onSubmit={submit}>
          <h2 className="contacts-form-title">Напишите нам</h2>
          <label className="contacts-field">
            <span className="contacts-field-label">Имя</span>
            <input
              required
              placeholder="Ваше имя"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            />
          </label>
          <label className="contacts-field">
            <span className="contacts-field-label">Email</span>
            <input
              required
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            />
          </label>
          <label className="contacts-field">
            <span className="contacts-field-label">Сообщение</span>
            <textarea
              required
              rows={5}
              placeholder="Расскажите, что нужно для объекта…"
              value={form.message}
              onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
            />
          </label>
          <button type="submit" className="btn btn-primary contacts-submit">
            Отправить
          </button>
          <p className="contacts-form-note muted">
            Нажимая «Отправить», вы соглашаетесь с обработкой персональных данных.
          </p>
        </form>
      </div>
    </section>
  );
}
