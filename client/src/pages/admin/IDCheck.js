import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/styles.css";
import * as bootstrap from "bootstrap";

const IDCheck = () => {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [setIsEmailSent] = useState(false);

  // Show toast notification
  const showToast = (message) => {
    const toastBody = document.querySelector("#idCheckToast .toast-body");
    if (toastBody) {
      toastBody.textContent = message;
    }
    const toastEl = document.getElementById("idCheckToast");
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
  };

  // Handle search for user
  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get("http://localhost:5000/auth/search", {
        params: { email },
      });
      setResult(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Error searching for user");
      setResult(null);
    }
  };

  // Handle activating user and sending success email
  const handleContinue = async () => {
    if (result) {
      try {
        // Activate the user
        await axios.put("http://localhost:5000/users/activate", {
          email: result.email,
        });

        // Send success email
        await axios.post("http://localhost:5000/email/send-success-email", {
          email: result.email,
        });

        showToast("Yey! User has been activated!");
        setIsEmailSent(true);
      } catch (err) {
        showToast("Failed to activate user. Please try again.");
      }
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ paddingTop: "5.5rem", paddingBottom: "6rem" }}
    >
      <div className="card twotone">
        <div className="row">
          <div className="col dark-background">
            <div
              className="half"
              style={{
                marginBottom: "10rem",
              }}
            >
              <img
                src="../media/search.webp"
                className="idlogo"
                alt="ID Logo"
              />
              <h5>
                <b>Activate a Member</b>
              </h5>
              <p>
                Please enter their registered ID.
                <br />
                <br />
                Only bonafide students, instructors, and personnel can utilize
                the fitness gym.
              </p>
            </div>
          </div>
          <div className="col light-background">
            <div className="card-body">
              <form onSubmit={handleSearch}>
                <div className="input-group mb-3 search">
                  <div className="form-floating flex-grow-1">
                    <input
                      type="text"
                      className="form-control"
                      id="floatingInput"
                      placeholder="Enter text or numbers"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <label htmlFor="floatingInput">Institutional ID</label>
                  </div>
                  <button
                    className="btn btn-outline-secondary"
                    type="submit"
                    id="button-addon2"
                  >
                    Search
                  </button>
                </div>
              </form>
              <div className="results">
                {error && <div className="alert alert-danger">{error}</div>}
                {result ? (
                  <div className="cardresult">
                    <div className="card-body">
                      <h5>Result:</h5>
                      <p>
                        <strong>Name:</strong> {result.firstName}{" "}
                        {result.lastName}
                      </p>
                      <p>
                        <strong>Email:</strong> {result.email}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="cardresult">
                    <div className="card-body">
                      Results will be displayed here after <br />
                      clicking on the search button.
                    </div>
                  </div>
                )}
              </div>
              <div className="reqbuttons">
                <button
                  type="button"
                  onClick={() => window.history.back()}
                  className="btn btn-dark backback"
                >
                  Go Back
                </button>
                <button
                  type="button"
                  className="btn btn-primary gotit"
                  onClick={handleContinue}
                  disabled={!result}
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast for IDCheck Notifications */}
      <div
        className="toast align-items-center"
        id="idCheckToast"
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

export default IDCheck;
