// src/pages/admin/AdminLoginPage.jsx
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { adminLoginApi } from "../../api/authApi.js";
import useAuth from "../../hooks/useAuth.jsx";
import { jwtDecode } from "jwt-decode";

export default function AdminLoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // after login go to admin dashboard
  const from = location.state?.from?.pathname || "/admin/dashboard";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const username = form.username.trim();

    // enforce naming rule
    if (!username.endsWith("_admin")) {
      setError("Admin username must end with '_admin'.");
      return;
    }

    try {
      const res = await adminLoginApi({
        username,
        password: form.password,
      });

      const { accessToken, refreshToken } = res.data;

      let user = { email: username, role: "ADMIN" };

      try {
        const decoded = jwtDecode(accessToken);
        user = {
          email: decoded.sub || decoded.email || username,
          role: decoded.role || decoded.roles?.[0] || "ADMIN",
        };
      } catch (decodeErr) {
        console.error("Failed to decode JWT:", decodeErr);
      }

      if (user.role !== "ADMIN") {
        setError("This account is not authorized as ADMIN.");
        return;
      }

      // save to auth context
      login(user, accessToken, refreshToken);

      // redirect
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Admin login failed. Please check username and password."
      );
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "2rem auto" }}>
      <h2>Admin Login</h2>
      <p style={{ fontSize: "0.85rem", color: "#4b5563" }}>
        Use your admin username (must end with <code>_admin</code>).
      </p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Admin Username</label>
          <input
            name="username"
            type="text"
            value={form.username}
            onChange={handleChange}
            required
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ marginTop: "1rem" }}>
          <label>Password</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            style={{ width: "100%" }}
          />
        </div>

        <button type="submit" style={{ marginTop: "1.5rem" }}>
          Login as Admin
        </button>
      </form>

      <p style={{ marginTop: "1rem", fontSize: "0.9rem" }}>
        Need an admin account?{" "}
        <a href="/admin/signup">
          Admin Signup
        </a>
      </p>

      <p style={{ marginTop: "0.5rem", fontSize: "0.9rem" }}>
        Back to user login?{" "}
        <a href="/login">
          User Login
        </a>
      </p>
    </div>
  );
}
