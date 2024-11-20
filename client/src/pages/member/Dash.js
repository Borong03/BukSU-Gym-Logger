import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/styles.css";

const Dash = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const firstName = queryParams.get("name") || "User";
  const userId = queryParams.get("userId");

  const [visits, setVisits] = useState(0);
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/login";
  }

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();
      
      if (response.ok) {
        alert(data.message);
        navigate("/login");
      } else {
        alert(data.message || "Logout failed, please try again.");
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("An error occurred during logout.");
    }
  };

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const response = await fetch(`${API_URL}/auth/visits/${userId}`);
        const data = await response.json();

        if (response.ok) {
          setVisits(data.visits);

          // Redirect to /limit if visits exceed 3
          if (data.visits >= 3) {
            navigate(`/limit?userId=${userId}`);
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

    if (userId) {
      fetchVisits();
    }
  }, [userId, API_URL, navigate]);

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <div className="card">
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
                    <b>{visits} out of 3 visits per week</b> have been used. <br />
                    <br />
                    You can now click <b>Log another user</b> and enjoy the Fitness
                    Gym amenities.
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
                <button
                  onClick={handleLogout}
                  className="btn btn-danger right"
                >
                  Log out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dash;
