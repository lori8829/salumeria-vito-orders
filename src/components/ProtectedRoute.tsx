import { useState } from "react";
import { AdminAuth } from "./AdminAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean | null>(null);

  const handleAdminLogin = (isAdmin: boolean) => {
    setIsAdminAuthenticated(isAdmin);
  };

  // If admin authentication status is not determined yet, show admin login
  if (isAdminAuthenticated === null) {
    return <AdminAuth onAdminLogin={handleAdminLogin} />;
  }

  // If admin authentication failed, show login again
  if (!isAdminAuthenticated) {
    return <AdminAuth onAdminLogin={handleAdminLogin} />;
  }

  // If admin is authenticated, show the protected content
  return <>{children}</>;
};