import { Link, NavLink, Outlet } from "react-router-dom";
import { Home, LayoutGrid, ShoppingBag, User, Shield } from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";
import SearchSuggest from "../components/SearchSuggest";
import { useAuth } from "../context/AuthContext";
import { useShop } from "../context/ShopContext";

export default function MainLayout() {
  const { user, logout } = useAuth();
  const { cart } = useShop();

  return (
    <div className="site-shell">
      <header className="header sticky">
        <div className="site-container header-inner glass">
          <Link to="/" className="logo">Хозяин</Link>
          <SearchSuggest />
          <nav className="row gap-sm nav-main">
            <NavLink to="/"><Home size={16} /> Главная</NavLink>
            <NavLink to="/catalog"><LayoutGrid size={16} /> Каталог</NavLink>
            <NavLink to="/cart"><ShoppingBag size={16} /> Корзина ({cart.length})</NavLink>
            <NavLink to="/account"><User size={16} /> Кабинет</NavLink>
            {user && ["ADMIN", "MANAGER", "CONTENT_MANAGER"].includes(user.role) && (
              <NavLink to="/admin"><Shield size={16} /> Админ</NavLink>
            )}
            <ThemeToggle />
            {user ? (
              <button className="btn" onClick={logout}>Выйти</button>
            ) : null}
          </nav>
        </div>
      </header>
      <main className="site-container main-content">
        <Outlet />
      </main>
      <footer className="footer">
        <div className="site-container footer-grid">
          <div>
            <p className="logo">Хозяин</p>
            <p className="muted">Строительные материалы, инструмент и комплектация объектов.</p>
          </div>
          <div>
            <p>Категории</p>
            <p className="muted">Кровля, Фасад, Крепеж, Инструмент</p>
          </div>
          <div>
            <p>Контакты</p>
            <p className="muted">info@hozyan.ru</p>
          </div>
        </div>
        <p className="muted footer-copy">© {new Date().getFullYear()} Хозяин. Строим надежно.</p>
      </footer>
    </div>
  );
}
