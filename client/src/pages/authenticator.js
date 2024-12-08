import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Authenticator = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");
    const name = queryParams.get("name");
    const userId = queryParams.get("userId");
    const isAdmin = queryParams.get("isAdmin");

    if (token && userId) {
      // save the token and user details to localStorage
      localStorage.setItem("jwtToken", token);
      localStorage.setItem("name", name || "User");
      localStorage.setItem("userId", userId);
      localStorage.setItem("isAdmin", isAdmin === "true" ? "true" : "false");

      console.log("Authentication successful. Redirecting to /dash...");

      // redirect to /dash
      navigate("/dash", { replace: true });
    } else {
      console.error("Missing token or userId. Redirecting to /login.");
      navigate("/login");
    }
  }, [location, navigate]);

  return <div>Authenticating...</div>;
};

export default Authenticator;
