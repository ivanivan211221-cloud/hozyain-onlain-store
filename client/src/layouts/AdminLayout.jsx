import { NavLink, Outlet } from "react-router-dom";
import { BarChart3, Boxes, ClipboardList, Users, MessageSquare } from "lucide-react";

export default function AdminLayout() {
  return (
    <div className="admin-grid">
      <aside className="admin-sidebar glass">
        <h3>Панель управления</h3>
        <NavLink to="/admin"><BarChart3 size={16} /> Дашборд</NavLink>
        <NavLink to="/admin/products"><Boxes size={16} /> Товары</NavLink>
        <NavLink to="/admin/orders"><ClipboardList size={16} /> Заказы</NavLink>
        <NavLink to="/admin/users"><Users size={16} /> Пользователи</NavLink>
        <NavLink to="/admin/reviews"><MessageSquare size={16} /> Отзывы</NavLink>
      </aside>
      <section className="admin-content">
        <Outlet />
      </section>
    </div>
  );
}
