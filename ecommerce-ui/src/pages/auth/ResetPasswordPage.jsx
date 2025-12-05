import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { resetPasswordViaLinkApi } from "../../api/authApi.js";

export default function ResetPasswordPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Read token/email from URL once
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const t = params.get("token");
    const e = params.get("email");
    if (t && e) {
      setToken(t);
      setEmail(e);
    } else {
      setError("Invalid reset link.");
    }
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!token || !email) {
      setError("Invalid or missing reset token.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const res = await resetPasswordViaLinkApi({
        email,
        token,
        newPassword,
      });

      setMessage(res.data || "Password reset successful.");

      // Small delay then redirect to login (refresh app)
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1500);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          err.response?.data ||
          "Failed to reset password."
      );
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "2rem auto" }}>
      <h2>Reset Password</h2>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!error && (
        <form onSubmit={handleSubmit}>
          <div>
            <label>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              style={{ width: "100%" }}
            />
          </div>

          <div style={{ marginTop: "1rem" }}>
            <label>Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={{ width: "100%" }}
            />
          </div>

          <button type="submit" style={{ marginTop: "1.5rem" }}>
            Update Password
          </button>
        </form>
      )}
    </div>
  );
}
