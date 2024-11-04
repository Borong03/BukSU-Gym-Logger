import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

const Fingerprint = () => {
  const navigate = useNavigate();

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <div className="card">
        <div className="row">
          <div className="col">
            <img
              src="media/finger.png"
              className="img-fluid rounded-start"
              alt="Fingerprint"
            />
          </div>
          <div className="col">
            <div className="card-body">
              <div className="contents">
                <span className="material-symbols-outlined">fingerprint</span>
                <h5 className="card-title">
                  <b>Please place your finger at the scanner.</b>
                </h5>
                <p className="card-text">
                  Don’t have an account yet? <br />
                  Signup for free!
                </p>
                <div className="button-container">
                  <button
                    onClick={() => navigate("/disclaimer")}
                    className="btn btn-primary signup"
                  >
                    Sign up
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fingerprint;
