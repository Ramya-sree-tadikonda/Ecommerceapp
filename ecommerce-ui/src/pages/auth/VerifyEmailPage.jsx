import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyEmailApi, resendOtpApi } from "../../api/authApi.js";

export default function VerifyEmailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState(location.state?.email || "");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const res = await verifyEmailApi({ email, otp });
      setMessage(res.data || "Email verified successfully.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          err.response?.data ||
          "Verification failed. Please check OTP."
      );
    }
  };

  const handleResend = async () => {
    setError("");
    setMessage("");

    try {
      const res = await resendOtpApi({ email });
      setMessage(res.data || "OTP resent successfully.");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          err.response?.data ||
          "Failed to resend OTP."
      );
    }
  };

  return (
    <div style={{ maxWidth: "450px", margin: "2rem auto" }}>
      <h2>Verify Email</h2>
      <p>Enter the OTP sent to your email.</p>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleVerify}>
        <div style={{ marginBottom: "1rem" }}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>OTP</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            style={{ width: "100%" }}
          />
        </div>

        <button type="submit">Verify</button>
        <button
          type="button"
          style={{ marginLeft: "1rem" }}
          onClick={handleResend}
        >
          Resend OTP
        </button>
      </form>
    </div>
  );
}
