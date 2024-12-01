import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import * as bootstrap from "bootstrap";
import "../../styles/styles.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Dash = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const firstName = queryParams.get("name") || "User";
  const userId = queryParams.get("userId");

  const [visits, setVisits] = useState(0);
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (response.ok) {
        // Update toast message and show it
        const toastBody = document.querySelector("#logoutToast .toast-body");
        if (toastBody) {
          toastBody.textContent = data.message;
        }
        const toastEl = document.getElementById("logoutToast");
        const toast = new bootstrap.Toast(toastEl);
        toast.show();

        navigate("/login");
      } else {
        const toastBody = document.querySelector("#logoutToast .toast-body");
        if (toastBody) {
          toastBody.textContent =
            data.message || "Logout failed, please try again.";
        }
        const toastEl = document.getElementById("logoutToast");
        const toast = new bootstrap.Toast(toastEl);
        toast.show();
      }
    } catch (error) {
      console.error("Logout error:", error);
      const toastBody = document.querySelector("#logoutToast .toast-body");
      if (toastBody) {
        toastBody.textContent = "An error occurred during logout.";
      }
      const toastEl = document.getElementById("logoutToast");
      const toast = new bootstrap.Toast(toastEl);
      toast.show();
    }
  };

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const response = await fetch(`${API_URL}/auth/visits/${userId}`);
        const data = await response.json();

        if (response.ok) {
          setVisits(data.visits);

          if (data.visits >= 4) {
            navigate(`/limit?userId=${userId}`);
          } else {
            await logTimeIn();
          }
        } else {
          console.error("Failed to fetch visits:", data.message);
        }
      } catch (error) {
        console.error("Error fetching visits:", error);
      } finally {
        setLoading(false);
      }
    };

    const logTimeIn = async () => {
      try {
        const response = await fetch(`${API_URL}/auth/log-time-in`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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

    if (userId) {
      fetchVisits();
    }
  }, [userId, API_URL, navigate]);

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
                <b>Hello, {firstName}!</b>
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
                    You can now click <b>Log another user</b> and enjoy the
                    Fitness Gym amenities.
                  </>
                )}
              </p>

              <div className="reqbuttons">
                <button
                  onClick={() => navigate(`/history?userId=${userId}`)}
                  className="btn btn-primary left"
                >
                  View Visit History
                </button>
                <button
                  onClick={() => navigate("/login")}
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

      {/* Toast for Notifications */}
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
