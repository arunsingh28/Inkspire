import { Navigate, useLocation } from "react-router-dom";
import { useAuthState } from "@/provider/auth.contex";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { token } = useAuthState();
  const { pathname } = useLocation();


  if (!Object.keys(token ?? {}).length) {
    return <Navigate to={`/auth/login`} state={{ destination: pathname }} />;
  }

  return children;
};

export default ProtectedRoute;
