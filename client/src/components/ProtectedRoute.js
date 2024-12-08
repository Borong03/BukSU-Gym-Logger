import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children, requiredRole }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = () => {
      const token = localStorage.getItem("jwtToken");

      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const expirationDate = decodedToken.exp * 1000; // convert to milisecond

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
  }, [requiredRole]);

  if (isLoading) {
    return <div>Loading...</div>; // show loading state while checking authentication
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
