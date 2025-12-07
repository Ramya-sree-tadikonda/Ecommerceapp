
import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const token = localStorage.getItem("accessToken");
  const role = localStorage.getItem("role");

  if (!token || role !== "ROLE_ADMIN") {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
