import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface Props {
  children: JSX.Element;
  adminOnly?: boolean;
}

/**
 * FIX: ProtectedRoute — full auth + role enforcement on every render.
 * - Unauthenticated          → /login  (return path preserved in state)
 * - Non-admin on adminOnly   → /dashboard
 * - Authenticated + allowed  → renders children
 */
const ProtectedRoute = ({ children, adminOnly = false }: Props) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && user?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;