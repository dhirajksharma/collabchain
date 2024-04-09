// ProtectedRoute.tsx
import React, { ReactNode, useEffect, useState } from "react";
import {
  useNavigate,
  Route,
  RouteProps,
  Navigate,
  Routes,
  Outlet,
} from "react-router-dom";
import useAuth from "../../hooks/useAuth";
// import { AuthContext } from './AuthProvider';

const ProtectedRoutes: React.FC = () => {
  const isAuthenticated = useAuth();

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;
