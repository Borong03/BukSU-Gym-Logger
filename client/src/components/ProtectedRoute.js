import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Correct import for jwt-decode

// ProtectedRoute component
const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem("jwtToken"); // Make sure to use the correct key
  const role = localStorage.getItem("role") || "guest"; // Default role to 'guest' if not found

  // If there's no token, redirect to login page
  if (!token) {
    console.log("No token found, redirecting to login.");
    return <Navigate to="/login" />;
  }

  let decodedToken = null;

  try {
    // Decode the token
    decodedToken = jwtDecode(token);
    console.log("Decoded token:", decodedToken); // Log the decoded token
  } catch (error) {
    console.error("Error decoding token:", error);
    return <Navigate to="/login" />;
  }

  // Ensure the token has a valid expiration field
  if (!decodedToken || !decodedToken.exp) {
    console.error("Token does not have an expiration field.");
    return <Navigate to="/login" />;
  }

  // Get expiration date from the token and check if it has expired
  const expirationDate = decodedToken.exp * 1000;
  console.log("Current Date:", new Date());
  console.log("Token Expiration Date:", new Date(expirationDate));

  const isExpired = expirationDate < new Date().getTime();
  if (isExpired) {
    console.log("Token has expired, redirecting to login.");
    localStorage.removeItem("jwtToken"); // Optionally clear expired token
    return <Navigate to="/login" />;
  }

  // Log the current user role
  console.log("User role:", role);

  // If role is required, check if it matches the stored role
  if (requiredRole && role !== requiredRole) {
    console.log(`Role mismatch: Expected ${requiredRole}, found ${role}`);
    return <Navigate to="/login" />;
  }

  // If everything checks out, render the children (protected content)
  return children;
};

export default ProtectedRoute;
