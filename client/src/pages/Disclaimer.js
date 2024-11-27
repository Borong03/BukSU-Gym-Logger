// src/pages/Disclaimer.js
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Disclaimer = () => {
  const navigate = useNavigate();

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ paddingTop: "6rem", paddingBottom: "6rem" }}
    >
      <div className="card twotone">
        <div className="row">
          <div className="col dark-background">
            <div className="half">
              <img src="/media/id.webp" className="idlogo" alt="ID Logo" />
              <h5>
                <b>Before you go...</b>
              </h5>
              <p>
                To ensure a smooth process, prepare the following requirements:
              </p>
            </div>
          </div>
          <div className="col light-background">
            <div className="card-body">
              <div className="image-container">
                <img
                  className="requirements"
                  src="/media/requirements.svg"
                  alt="Requirements"
                />
              </div>
              <div className="reqbuttons">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="btn btn-dark backback"
                >
                  Go Back
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/signup")}
                  className="btn btn-primary gotit"
                >
                  Got it!
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Disclaimer;
