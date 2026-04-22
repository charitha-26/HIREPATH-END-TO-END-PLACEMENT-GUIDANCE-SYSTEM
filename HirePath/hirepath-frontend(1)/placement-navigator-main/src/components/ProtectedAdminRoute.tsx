import { Navigate } from "react-router-dom";
import { useRole } from "@/contexts/RoleContext";

const ProtectedAdminRoute = ({ children }: { children: JSX.Element }) => {
  const { role, isLoggedIn } = useRole();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedAdminRoute;