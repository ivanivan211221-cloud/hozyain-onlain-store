import { Building2, Truck, Users, Award } from "lucide-react";

const STATS = [
  { icon: Building2, value: "12K+", label: "товаров в каталоге" },
  { icon: Truck, value: "150K", label: "доставленных заказов" },
  { icon: Users, value: "45K", label: "довольных клиентов" },
  { icon: Award, value: "14 лет", label: "на рынке" },
];

const VALUES = [
  {
    title: "Качество",
    text: "Только сертифицированные товары и проверенные бренды.",
  },
  {
    title: "Скорость",
    text: "Доставка по Москве за 24 часа, по регионам — 2–4 дня.",
  },
  {
    title: "Поддержка",
    text: "Помогаем выбрать материал и рассчитать количество.",
  },
];

export default function AboutPage() {
  return (
    <div className="about-page">
      <div className="about-hero">
        <img
          className="about-logo"
          src="/logo-hozyan.png"
          alt="Хозяин — строительный магазин"
          width={280}
          height={100}
          loading="eager"
        />
        <h1 className="about-title">Строим вместе с 2010 года</h1>
        <p className="about-lead muted">
          «Хозяин» — команда профессионалов, которая помогает строителям и семьям находить
          материалы по честным ценам. Работаем напрямую с заводами, держим складской запас и
          сопровождаем заказ от подбора до доставки на объект.
        </p>
      </div>

      <ul className="about-stat-grid">
        {STATS.map(({ icon: Icon, value, label }) => (
          <li key={label} className="about-stat-card card">
            <span className="about-stat-icon" aria-hidden>
              <Icon size={22} strokeWidth={2} />
            </span>
            <strong className="about-stat-value">{value}</strong>
            <span className="about-stat-label muted">{label}</span>
          </li>
        ))}
      </ul>

      <ul className="about-values-grid">
        {VALUES.map(({ title, text }) => (
          <li key={title} className="about-value-card card">
            <h2 className="about-value-title">{title}</h2>
            <p className="muted about-value-text">{text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
