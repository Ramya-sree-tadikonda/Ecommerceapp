
import { Link, NavLink, Outlet } from "react-router-dom";

export default function AdminLayout() {
  const navLinkStyle = ({ isActive }) => ({
    padding: "0.4rem 0.8rem",
    borderRadius: "4px",
    textDecoration: "none",
    fontSize: "0.9rem",
    color: isActive ? "#fff" : "#333",
    backgroundColor: isActive ? "#2563eb" : "transparent",
    border: "1px solid #2563eb",
  });

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f4f4f5" }}>
      {/* Top bar */}
      <header
        style={{
          backgroundColor: "#111827",
          color: "#f9fafb",
          padding: "0.75rem 1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: "1.25rem" }}>Admin Panel</h1>
          <div style={{ fontSize: "0.8rem", color: "#9ca3af" }}>
            Manage products, orders & inventory
          </div>
        </div>

        <nav style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <NavLink to="/admin/dashboard" style={navLinkStyle}>
            Dashboard
          </NavLink>
          <NavLink to="/admin/products" style={navLinkStyle}>
            Products
          </NavLink>
          <NavLink to="/admin/orders" style={navLinkStyle}>
            Orders
          </NavLink>

          <Link
            to="/"
            style={{
              marginLeft: "1rem",
              padding: "0.4rem 0.8rem",
              borderRadius: "4px",
              backgroundColor: "#e5e7eb",
              color: "#111827",
              textDecoration: "none",
              fontSize: "0.85rem",
            }}
          >
            ⬅ Back to Store
          </Link>
        </nav>
      </header>

      {/* Content */}
      <main style={{ maxWidth: "1100px", margin: "1.5rem auto", padding: "0 1rem" }}>
        <Outlet />
      </main>
    </div>
  );
}
