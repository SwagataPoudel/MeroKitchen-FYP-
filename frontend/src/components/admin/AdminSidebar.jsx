import { NavLink, useNavigate } from "react-router-dom";
import "../../css/AdminDashboard.css";

const links = [
  { to: "/admin", label: "📊 Dashboard", end: true },
  { to: "/admin/users", label: "👥 Users" },
  { to: "/admin/orders", label: "🧾 Orders" },
  { to: "/admin/products", label: "🍱 Products" },
  { to: "/admin/reviews", label: "⭐ Reviews" },
  { to: "/admin/verifications", label: "✅ Verifications" }, // NEW
];

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/auth");
  };

  return (
    <div className="admin-sidebar">
      <h2 className="admin-sidebar-title">Mero Kitchen</h2>
      <p className="admin-sidebar-sub">Admin Panel</p>
      <nav className="admin-nav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `admin-nav-link ${isActive ? "active" : ""}`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
      <button className="admin-logout-btn" onClick={handleLogout}>
        🚪 Logout
      </button>
    </div>
  );
};

export default AdminSidebar;
