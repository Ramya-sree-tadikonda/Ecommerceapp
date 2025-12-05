import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loginApi } from "../../api/authApi.js";
import useAuth from "../../hooks/useAuth.jsx";

import { jwtDecode } from "jwt-decode";


export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await loginApi(form);
      const { accessToken, refreshToken } = res.data;

      let user = { email: form.email, role: "USER" };

      try {
        const decoded = jwtDecode(accessToken);
        user = {
          email: decoded.sub || decoded.email || form.email,
          role: decoded.role || "USER", // "USER" or "ADMIN"
        };
      } catch (decodeErr) {
        console.error("Failed to decode JWT:", decodeErr);
      }

      login(user, accessToken, refreshToken);
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Failed to login. Please check email and password."
      );
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "2rem auto" }}>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
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
          />
        </div>

        <button type="submit" style={{ marginTop: "1.5rem" }}>
          Login
        </button>
      </form>

      <p style={{ marginTop: "1rem" }}>
        <a href="/forgot-password">Forgot password?</a>
      </p>
    </div>
  );
}
