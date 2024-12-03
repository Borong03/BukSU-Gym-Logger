import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, requiredRole }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const isGoogleAuthenticated =
    localStorage.getItem("isGoogleAuthenticated") === "true";

  // redirect if not authenticated
  if (!isAuthenticated && !isGoogleAuthenticated) {
    return <Navigate to="/login" />;
  }

  // check roles if requiredRole is provided
  const role = localStorage.getItem("role");
  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default ProtectedRoute;
