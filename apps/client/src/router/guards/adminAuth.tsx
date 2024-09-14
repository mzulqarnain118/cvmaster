import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useUser } from "@/client/services/user";

export const AdminAuthGuard = () => {
  const location = useLocation();
  const redirectTo = location.pathname + location.search;

  const { user, loading } = useUser();

  if (loading) return null;

  if (user) {
    return user.role === "admin" ? <Outlet /> : <Navigate replace to={`/dashboard/resumes`} />;
  }

  return <Navigate replace to={`/auth/login?redirect=${redirectTo}`} />;
};
