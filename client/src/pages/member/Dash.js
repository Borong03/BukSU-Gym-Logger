import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/styles.css";

const Dash = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // extract query params from url
  const queryParams = new URLSearchParams(location.search);
  const firstName = queryParams.get("name") || "User";
  const userId = queryParams.get("userId"); 

  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/login";
  }

  const handleLogout = async () => {
    const userId = new URLSearchParams(location.search).get("userId");
  
    try {
      const response = await fetch("http://localhost:5000/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }), // send userId
      });
  
      const data = await response.json();
      if (response.ok) {
        alert(data.message); // show success message
        navigate("/login"); // redirect to login page after logout
      } else {
        alert(data.message || "Logout failed, please try again.");
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("An error occurred during logout.");
    }
  };  

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
                Your user ID is: <b>{userId}</b> <br />
                Your time in has been logged. <br />
                %nth out of 3 visits per week has been used.<br />
                <br />
                You can now click <b>Log another user</b> and enjoy the Fitness
                Gym amenities.
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
