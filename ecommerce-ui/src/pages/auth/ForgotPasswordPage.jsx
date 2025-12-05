import { useState } from "react";
import { forgotPasswordApi } from "../../api/authApi.js";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await forgotPasswordApi({ email });
      setMessage(res.data || "Reset link sent to your email.");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          err.response?.data ||
          "Failed to send reset link."
      );
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "2rem auto" }}>
      <h2>Forgot Password</h2>
      <p style={{ fontSize: "0.9rem", color: "#4b5563" }}>
        Enter your email. You will receive a password reset link.
      </p>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>

        <button type="submit" style={{ marginTop: "1rem" }}>
          Send Reset Link
        </button>
      </form>
    </div>
  );
}
