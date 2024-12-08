import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import * as bootstrap from "bootstrap";
import "../../styles/styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { jwtDecode } from "jwt-decode";

const Dash = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  const [visits, setVisits] = useState(0);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(30); // countdown timer in seconds
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    const tokenFromQuery = queryParams.get("token");
    const nameFromQuery = queryParams.get("name");
    const userIdFromQuery = queryParams.get("userId");
    const isAdminFromQuery = queryParams.get("isAdmin");

    const tokenFromLocalStorage = localStorage.getItem("jwtToken");
    const userIdFromLocalStorage = localStorage.getItem("userId");

    if (tokenFromQuery && userIdFromQuery) {
      console.log("Storing token and userId from query params.");

      // save token and user details to localStorage
      localStorage.setItem("jwtToken", tokenFromQuery);
      localStorage.setItem("name", nameFromQuery || "User");
      localStorage.setItem("userId", userIdFromQuery);
      localStorage.setItem(
        "isAdmin",
        isAdminFromQuery === "true" ? "true" : "false"
      );

      // clean up query params
      queryParams.delete("token");
      queryParams.delete("name");
      queryParams.delete("userId");
      queryParams.delete("isAdmin");
      navigate(location.pathname, { replace: true });
    } else if (!tokenFromLocalStorage || !userIdFromLocalStorage) {
      console.error("Missing token or userId. Redirecting to login.");
      localStorage.clear();
      navigate("/login");
      return;
    }

    // validate token from localStorage
    try {
      const token = localStorage.getItem("jwtToken");
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        console.error("Token expired. Clearing localStorage and redirecting.");
        localStorage.clear();
        navigate("/login");
        return;
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      localStorage.clear();
      navigate("/login");
    }
  }, [navigate, location.pathname, queryParams]);

  useEffect(() => {
    if (!loading) {
      const interval = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown <= 1) {
            clearInterval(interval);
            navigate("/");
            return 0;
          }
          return prevCountdown - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [loading, navigate]);

  const handleLogout = async () => {
    const token = localStorage.getItem("jwtToken");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      console.error("Missing token or userId. Redirecting to login.");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Logout successful:", data.message);
        localStorage.clear();
        navigate("/login");
      } else {
        console.error("Logout failed:", data.message);
        showToast(data.message || "Logout failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      showToast("An error occurred during logout.");
    }
  };

  const handleViewHistory = () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.error("No userId found. Redirecting to login.");
      navigate("/login");
      return;
    }

    navigate(
      `/history?name=${encodeURIComponent(
        localStorage.getItem("name")
      )}&userId=${userId}`,
      { state: { from: location } }
    );
  };

  useEffect(() => {
    const fetchVisits = async () => {
      const token = localStorage.getItem("jwtToken");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        console.error("Missing token or userId. Redirecting to login.");
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(`${API_URL}/auth/visits/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          if (data.visits >= 3) {
            navigate(`/limit?userId=${userId}`);
          } else {
            await logTimeIn();
            setVisits(data.visits);
          }
        } else {
          console.error("Failed to fetch visits:", data.message);
          showToast(data.message || "Failed to fetch visits.");
        }
      } catch (error) {
        console.error("Error fetching visits:", error);
        showToast("An error occurred while fetching visits.");
      } finally {
        setLoading(false);
      }
    };

    const logTimeIn = async () => {
      const token = localStorage.getItem("jwtToken");
      const userId = localStorage.getItem("userId");

      try {
        const response = await fetch(`${API_URL}/auth/log-time-in`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId }),
        });

        const data = await response.json();

        if (!response.ok) {
          console.error("Error logging time in:", data.message);
        }
      } catch (error) {
        console.error("Error logging time in:", error);
      }
    };

    fetchVisits();
  }, [API_URL, navigate]);

  const handleLogAnotherUser = () => {
    localStorage.clear();
    navigate("/login");
  };

  const showToast = (message) => {
    const toastBody = document.querySelector("#logoutToast .toast-body");
    if (toastBody) {
      toastBody.textContent = message;
    }
    const toastEl = document.getElementById("logoutToast");
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ paddingTop: "6rem", paddingBottom: "6rem" }}
    >
      <div className="card cardwhole">
        <div className="row">
          <div className="card-body">
            <div className="successcard">
              <img src="media/hello.webp" className="done" alt="Done" />
              <h5 className="card-title">
                <b>Hello, {localStorage.getItem("name") || "User"}!</b>
              </h5>
              <p className="card-text">
                {loading ? (
                  "Loading your visit count..."
                ) : (
                  <>
                    Your time in has been logged. <br />
                    <b>{visits} out of 3 visits per week</b> have been used.{" "}
                    <br />
                    <br />
                    Please enjoy the fitness gym amenities. 💪
                    <br />
                    Redirecting to the Home page in <b>{countdown} seconds</b>.
                  </>
                )}
              </p>

              <div className="reqbuttons">
                <button
                  onClick={handleViewHistory}
                  className="btn btn-primary left"
                >
                  View Visit History
                </button>
                <button
                  onClick={handleLogAnotherUser}
                  className="btn btn-dark middle"
                >
                  Log another User
                </button>
                <button onClick={handleLogout} className="btn btn-danger right">
                  Log out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="toast align-items-center"
        id="logoutToast"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        style={{
          position: "fixed",
          bottom: "1rem",
          right: "1rem",
          zIndex: 1055,
        }}
      >
        <div className="toast-header">
          <strong className="me-auto">Notification</strong>
          <small>Just now</small>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="toast"
            aria-label="Close"
          ></button>
        </div>
        <div className="toast-body"></div>
      </div>
    </div>
  );
};

export default Dash;
