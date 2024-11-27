import React from "react";
import { useNavigate } from "react-router-dom";

const Success = () => {
  const navigate = useNavigate();

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ paddingTop: "6rem", paddingBottom: "6rem" }}
    >
      <div className="card cardwhole">
        <div className="row">
          <div className="card-body">
            <div className="successcard">
              <img src="media/done.webp" className="done" alt="Done" />
              <h5 className="card-title">
                <b>You are now Registered!</b>
              </h5>
              <p className="card-text">
                Please visit the Admin Kiosk with your requirements <br />
                for verification and fingerprint registration.
                <br />
                <br />
                Thank you!
              </p>

              <div className="reqbuttons">
                <button
                  onClick={() => navigate("/signup")}
                  className="btn btn-dark signgo"
                >
                  Register another User
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="btn btn-primary logingo"
                >
                  Continue to Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Success;
