import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/styles.css";

const Logout = () => {
  const navigate = useNavigate();

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
                <b>Goodbye, $NamePlaceholder!</b>
              </h5>
              <p className="card-text">
                Your time out has been logged. <br></br>
                <br></br> Redirecting to the login screen in %nth seconds...
              </p>

              <div className="reqbuttons">
                <button
                  onClick={() => navigate("/fingerprint")}
                  className="btn btn-primary signup"
                >
                  Log another user
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logout;
