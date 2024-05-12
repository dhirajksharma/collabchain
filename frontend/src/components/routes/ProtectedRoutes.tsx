// ProtectedRoute.tsx
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
// import { AuthContext } from './AuthProvider';

const ProtectedRoutes: React.FC = () => {
  const location = useLocation();
  const isAuthenticated = useAuth() || location.state?.isAuthenticated;

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;
