import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface Props {
  children: JSX.Element;
}

/**
 * FIX: PublicRoute — blocks authenticated users from accessing /login and /register.
 * - Admin → /admin
 * - User  → /dashboard
 * - Unauthenticated → renders children (login / register page)
 */
const PublicRoute = ({ children }: Props) => {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={user?.role === "admin" ? "/admin" : "/dashboard"} replace />;
  }

  return children;
};

export default PublicRoute;