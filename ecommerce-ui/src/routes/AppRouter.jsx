
import { Routes, Route } from "react-router-dom";

import HomePage from "../pages/catalog/HomePage.jsx";
import ProductsPage from "../pages/products/ProductsPage.jsx";
import ProductDetailsPage from "../pages/catalog/ProductDetailsPage.jsx";

import SignupPage from "../pages/auth/SignupPage.jsx";
import VerifyEmailPage from "../pages/auth/VerifyEmailPage.jsx";
import LoginPage from "../pages/auth/LoginPage.jsx";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage.jsx";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage.jsx";
import AdminLayout from "../components/layout/AdminLayout.jsx";
import CartPage from "../pages/cart/CartPage.jsx";
import CheckoutPage from "../pages/checkout/CheckoutPage.jsx";
import OrdersPage from "../pages/orders/OrdersPage.jsx";

import AdminDashboardPage from "../pages/admin/AdminDashboardPage.jsx";
import AdminProductsPage from "../pages/admin/AdminProductsPage.jsx";

import AdminLoginPage from "../pages/admin/AdminLoginPage.jsx";
import AdminSignupPage from "../pages/admin/AdminSignupPage.jsx";

import AdminOrdersPage from "../pages/admin/AdminOrdersPage.jsx";

import ProtectedRoute from "../components/auth/ProtectedRoute.jsx";


export default function AppRouter() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/products/:id" element={<ProductDetailsPage />} />

      {/* Auth */}
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Protected: USER */}
      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <CartPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <OrdersPage />
          </ProtectedRoute>
        }
      />

      {/* Admin section with its own UI (login/signup/products/cart/orders) */}
      <Route path="/admin" element={<AdminLayout />}>
        {/* default admin route -> login */}
        <Route index element={<AdminLoginPage />} />
        <Route path="login" element={<AdminLoginPage />} />
        <Route path="signup" element={<AdminSignupPage />} />

        {/* Protected: ADMIN-only views */}
        <Route
          path="dashboard"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="products"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminProductsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="cart"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <CartPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="orders"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminOrdersPage />
            </ProtectedRoute>
          }
        />

        
      </Route>
    </Routes>
  );
}
