// ProtectedRoute.tsx
import React, { ReactNode, useEffect, useState } from "react";
import {
  useNavigate,
  Route,
  RouteProps,
  Navigate,
  Routes,
  Outlet,
  useLocation,
} from "react-router-dom";
import useAuth from "../../hooks/useAuth";
// import { AuthContext } from './AuthProvider';

const ProtectedRoutes: React.FC = () => {
  const location = useLocation();
  // console.log(location.state.isAuthenticated);
  const isAuthenticated = useAuth() || location.state?.isAuthenticated;

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;
