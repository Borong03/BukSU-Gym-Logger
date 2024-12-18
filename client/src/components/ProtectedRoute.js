import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children, requiredRole }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAuthentication = () => {
      const token = localStorage.getItem("jwtToken");

      // Allow access to /limit route even without a token
      if (location.pathname === "/limit") {
        setIsAuthenticated(true);
        setIsLoading(false);
        return;
      }

      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const expirationDate = decodedToken.exp * 1000; // convert to milliseconds

          if (expirationDate > Date.now()) {
            const role =
              localStorage.getItem("isAdmin") === "true" ? "admin" : "user";

            if (!requiredRole || role === requiredRole) {
              setIsAuthenticated(true);
            } else {
              console.warn(
                `Role mismatch. Required: ${requiredRole}, Found: ${role}`
              );
            }
          } else {
            console.warn("Token expired. Clearing localStorage.");
            localStorage.clear();
          }
        } catch (error) {
          console.error("Error decoding token:", error);
          localStorage.clear();
        }
      } else {
        console.warn("No token found in localStorage.");
      }

      setIsLoading(false);
    };

    checkAuthentication();
  }, [requiredRole, location.pathname]);

  if (isLoading) {
    return <div>Loading...</div>; // show loading state while checking authentication
  }

  // Render children for /limit or authenticated routes
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
