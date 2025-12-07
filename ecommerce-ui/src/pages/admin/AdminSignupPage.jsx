
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminSignupApi } from "../../api/authApi.js";

export default function AdminSignupPage() {
  const [form, setForm] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!form.username.endsWith("_admin")) {
      setError("Admin username must end with '_admin'.");
      return;
    }

    try {
      await adminSignupApi(form);
      setMessage("Admin account created successfully. You can login now.");
      navigate("/admin/login");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          err.response?.data ||
          "Admin signup failed. Please try again."
      );
    }
  };

  return (
    <div style={{ maxWidth: "450px", margin: "2rem auto" }}>
      <h2>Admin Signup</h2>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label>Admin Username</label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
            style={{ width: "100%" }}
          />
          <small>Must end with <code>_admin</code></small>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Full Name</label>
          <input
            type="text"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            required
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            style={{ width: "100%" }}
          />
        </div>

        <button type="submit">Sign Up as Admin</button>
      </form>

      <p style={{ marginTop: "0.5rem", fontSize: "0.9rem" }}>
        Already have an admin account?{" "}
        <a href="/admin/login">
          Login
        </a>
      </p>
    </div>
  );
}
