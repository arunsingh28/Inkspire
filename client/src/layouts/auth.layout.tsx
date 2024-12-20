import { Outlet, Navigate } from "react-router-dom";

import { useAuthState } from "@/provider/auth.contex";

const AuthLayout = () => {
  const { token } = useAuthState(); 

  if (Object.keys(token ?? {}).length) {
    return <Navigate to={`/`} replace />;
  }

  return <Outlet />;
};

export default AuthLayout;