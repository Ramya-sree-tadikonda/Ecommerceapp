
import httpClient from "./httpClient.js";

// USER AUTH (with OTP flow)

export function signupApi(payload) {
  // { fullName, email, password }
  return httpClient.post("/api/auth/signup", payload);
}

export function verifyEmailApi(payload) {
  // { email, otp }
  return httpClient.post("/api/auth/verify-email", payload);
}

export function resendOtpApi(payload) {
  // { email }
  return httpClient.post("/api/auth/resend-otp", payload);
}

export function loginApi(payload) {
  // { email, password }
  return httpClient.post("/api/auth/signin", payload);
}

export function forgotPasswordApi(payload) {
  // { email }
  return httpClient.post("/api/auth/forgot-password", payload);
}

export function resetPasswordViaLinkApi(payload) {
  return httpClient.post("/api/auth/reset-password-link", payload);
}

export function refreshTokenApi(refreshToken) {
  return httpClient.post("/api/auth/refresh-token", { refreshToken });
}

// ADMIN AUTH (username + password, NO OTP)

export function adminSignupApi(data) {
  // { username, fullName, email, password }
  return httpClient.post("/api/admin/auth/signup", data);
}

export function adminLoginApi(data) {
  // { username, password }
  return httpClient.post("/api/admin/auth/login", data);
}
