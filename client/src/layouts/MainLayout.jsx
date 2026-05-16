import { Link, NavLink, Outlet } from "react-router-dom";
import { Home, LayoutGrid, ShoppingBag, User, Shield, Building2, Phone } from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";
import SearchSuggest from "../components/SearchSuggest";
import { useAuth } from "../context/AuthContext";
import { useShop } from "../context/ShopContext";

export default function MainLayout() {
  const { user, logout } = useAuth();
  const { cart } = useShop();

  return (
    <div className="site-shell">
      <header className="header">
        <div className="site-container header-panel">
          <div className="header-top">
            <Link to="/" className="logo-block logo-block--brand">
              <img
                src="/logo-hozyan.png"
                alt="Хозяин — строительный магазин"
                className="header-logo"
                width={200}
                height={72}
              />
            </Link>
            <nav className="nav-main">
              <NavLink to="/" end>
                <Home size={17} strokeWidth={2} /> Главная
              </NavLink>
              <NavLink to="/catalog">
                <LayoutGrid size={17} strokeWidth={2} /> Каталог
              </NavLink>
              <NavLink to="/about">
                <Building2 size={17} strokeWidth={2} /> О компании
              </NavLink>
              <NavLink to="/contacts">
                <Phone size={17} strokeWidth={2} /> Контакты
              </NavLink>
            </nav>
            <div className="header-actions">
              <NavLink to="/cart" className="nav-cart">
                <ShoppingBag size={18} strokeWidth={2} />
                <span>Корзина</span>
                {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
              </NavLink>
              <NavLink to="/account">
                <User size={18} strokeWidth={2} /> Кабинет
              </NavLink>
              {user && ["ADMIN", "MANAGER", "CONTENT_MANAGER"].includes(user.role) && (
                <NavLink to="/admin">
                  <Shield size={18} strokeWidth={2} /> Админ
                </NavLink>
              )}
              <ThemeToggle />
              {user ? (
                <button type="button" className="btn btn-outline btn-sm" onClick={logout}>
                  Выйти
                </button>
              ) : null}
            </div>
          </div>
          <div className="header-search">
            <SearchSuggest />
          </div>
        </div>
      </header>
      <main className="site-container main-content">
        <Outlet />
      </main>
      <footer className="footer">
        <div className="site-container footer-main">
          <div className="footer-brand">
            <img
              src="/logo-hozyan.png"
              alt=""
              className="footer-logo-img"
              width={180}
              height={64}
              loading="lazy"
            />
            <p className="muted footer-lead">
              Строительные материалы и инструмент для тех, кто строит на совесть.
            </p>
          </div>
          <div>
            <p className="footer-heading">Каталог</p>
            <ul className="footer-links">
              <li>
                <Link to="/catalog">Все товары</Link>
              </li>
              <li>
                <Link to="/catalog">Цемент и смеси</Link>
              </li>
              <li>
                <Link to="/catalog">Инструменты</Link>
              </li>
              <li>
                <Link to="/catalog">Краски и лаки</Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="footer-heading">Компания</p>
            <ul className="footer-links">
              <li>
                <Link to="/about">О нас</Link>
              </li>
              <li>
                <Link to="/contacts">Контакты</Link>
              </li>
              <li>
                <Link to="/account">Личный кабинет</Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="footer-heading">Контакты</p>
            <ul className="footer-links footer-contacts">
              <li>
                <a href="tel:+78005553535">8 800 555-35-35</a>
              </li>
              <li>
                <a href="mailto:info@hozyan.ru">info@hozyan.ru</a>
              </li>
              <li className="muted">Москва, ул. Строителей, 12</li>
            </ul>
          </div>
        </div>
        <p className="muted footer-copy">
          © {new Date().getFullYear()} Хозяин. Все права защищены.
        </p>
      </footer>
    </div>
  );
}
