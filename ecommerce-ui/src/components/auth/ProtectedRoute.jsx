import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth.jsx";

export default function ProtectedRoute({ children, requiredRole }) {
  const { auth } = useAuth();
  const location = useLocation();

  // not logged in → go to login
  if (!auth?.accessToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // if route requires a specific role (e.g., ADMIN)
  if (requiredRole && auth?.user?.role !== requiredRole) {
    // you can redirect to home or show a 403 page
    return <Navigate to="/" replace />;
  }

  return children;
}
