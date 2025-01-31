import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useUser } from "@/client/services/user";

export const AuthGuard = () => {
  const location = useLocation();
  const redirectTo = location.pathname + location.search;

  const { user, loading } = useUser();

  if (loading) return null;

  if (user) {
    return user.role === "user" ? <Outlet /> : <Navigate replace to={`/admin/users`} />;
  }

  return <Navigate replace to={`/auth/login?redirect=${redirectTo}`} />;
};
