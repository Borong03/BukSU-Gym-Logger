import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/styles.css";

const Dash = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const queryParams = new URLSearchParams(location.search);
  const firstName = queryParams.get("name") || "User";

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
                Your time in has been logged. <br />
                %nth out of 3 visits per week has been used.<br />
                <br />
                You can now click <b>Log another user</b> and enjoy the Fitness
                Gym amenities.
              </p>

              <div className="reqbuttons">
                <button
                  onClick={() => navigate("/history")}
                  className="btn btn-primary left"
                >
                  View Visit History
                </button>
                <button
                  onClick={() => navigate("/fingerprint")}
                  className="btn btn-dark middle"
                >
                  Log another User
                </button>
                <button
                  onClick={() => navigate("/logout")}
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
