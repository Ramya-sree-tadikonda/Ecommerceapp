// src/components/layout/Navbar.jsx
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth.jsx";
import "./Navbar.css";

export default function Navbar() {
  const { auth, logout } = useAuth();
  const isLoggedIn = !!auth?.accessToken;

  return (
    <nav className="nav-root">
      <div className="nav-left">
        {/* Logo / Brand */}
        <Link to="/" className="nav-link">
          Home
        </Link>

        <Link to="/products" className="nav-link">
          Products
        </Link>

        {isLoggedIn && (
          <>
            <Link to="/cart" className="nav-link">
              Cart
            </Link>
            <Link to="/orders" className="nav-link">
              Orders
            </Link>
          </>
        )}

        {/* ✅ Always-visible Admin hyperlink for admin panel */}
        <Link to="/admin" className="nav-link">
          Admin
        </Link>
      </div>

      <div className="nav-right">
        {isLoggedIn ? (
          <span
            className="nav-link"
            style={{ cursor: "pointer" }}
            onClick={logout}
          >
            Logout
          </span>
        ) : (
          <>
            <Link to="/login" className="nav-link">
              Login
            </Link>
            <Link to="/signup" className="nav-link">
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
