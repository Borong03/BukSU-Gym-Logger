import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import * as bootstrap from "bootstrap";

const Login = () => {
  const navigate = useNavigate();
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [localPart, setLocalPart] = useState("");
  const [domain, setDomain] = useState("@student.buksu.edu.ph");
  const [password, setPassword] = useState("");
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const showToast = (message) => {
    const toastBody = document.querySelector("#loginToast .toast-body");
    if (toastBody) {
      toastBody.textContent = message;
    }
    const toastEl = document.getElementById("loginToast");
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullEmail = `${localPart}${domain}`;

    if (!localPart || !password) {
      showToast("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: fullEmail, password }),
      });

      const data = await response.json();

      if (response.status === 429) {
        showToast(data.message);
        navigate(`/limit?userId=${data.userId}`);
        return;
      }

      if (response.ok) {
        const { firstName, userId, isAdmin } = data;

        // update localStorage for authentication
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("role", isAdmin ? "admin" : "user");

        const redirectUrl = isAdmin
          ? `/admin?name=${encodeURIComponent(firstName)}&userId=${userId}`
          : `/dash?name=${encodeURIComponent(firstName)}&userId=${userId}`;
        navigate(redirectUrl);
      } else {
        showToast(data.message || "Login failed, please try again.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      showToast("An error occurred. Please try again.");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      window.location.href = "http://localhost:5000/auth/google";
      localStorage.setItem("isGoogleAuthenticated", "true"); // store Google login state
      localStorage.setItem("isAuthenticated", "true"); // general authentication
    } catch (error) {
      console.error("Google Sign-In error:", error);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ paddingTop: "3.5rem", paddingBottom: "6rem" }}
    >
      <div className="card twotone">
        <div className="row">
          <div className="col dark-background">
            <div className="halfhome">
              <img
                src="/media/logo.png"
                className="idlogo"
                alt="homelogo Logo"
              />
              <h5>
                <b>
                  Login to the <br /> BukSU Fitness Gym
                </b>
              </h5>
            </div>
          </div>
          <div className="col light-background">
            <div className="card-body">
              <button
                className="google-signin-button"
                onClick={handleGoogleSignIn}
              >
                <div className="image-container">
                  <img
                    className="svgs"
                    src="media/dummy.svg"
                    alt="Google Logo"
                  />
                </div>
              </button>
              <button
                className="google-signin-button"
                onClick={() => navigate("/barcode")}
                style={{ marginTop: "-2rem" }}
              >
                <div className="image-container">
                  <img
                    className="svgs"
                    src="media/barcode.svg"
                    alt="Barcode page"
                  />
                </div>
              </button>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  className="svgs centerpls"
                  style={{ width: "80%", maxWidth: "300px" }}
                  src="media/divider2.svg"
                  alt="Divider"
                />
              </div>

              <form onSubmit={handleSubmit}>
                <div className="row align-items-center mb-3">
                  <div className="col-md-5">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Username"
                      value={localPart}
                      onChange={(e) => setLocalPart(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-7">
                    <select
                      className="form-select"
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                    >
                      <option value="@student.buksu.edu.ph">
                        @student.buksu.edu.ph
                      </option>
                      <option value="@buksu.edu.ph">@buksu.edu.ph</option>
                    </select>
                  </div>
                </div>

                <div className="form-floating">
                  <input
                    type="password"
                    className="form-control"
                    id="floatingPassword"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <label htmlFor="floatingPassword">Password</label>
                </div>

                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="flexCheckDefault"
                    required
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexCheckDefault"
                  >
                    I have read the{" "}
                    <b
                      className="text-primary"
                      onClick={() => setShowTerms(true)}
                    >
                      Terms & Conditions
                    </b>{" "}
                    and
                    <b
                      className="text-primary"
                      onClick={() => setShowPrivacy(true)}
                    >
                      {" "}
                      BukSU Data Collection & Privacy
                    </b>
                  </label>
                </div>

                <div className="reqbuttons">
                  <button
                    onClick={() => navigate("/signup")}
                    className="btn btn-dark backback"
                  >
                    Signup
                  </button>
                  <button type="submit" className="btn btn-primary gotit">
                    Login
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Terms and Privacy Modals */}
      <Modal show={showTerms} onHide={() => setShowTerms(false)} centered>
        <Modal.Header>
          <Modal.Title>Terms & Conditions</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Terms and conditions go here...</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowTerms(false)}>
            Got it!
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showPrivacy} onHide={() => setShowPrivacy(false)} centered>
        <Modal.Header>
          <Modal.Title>BukSU Data Collection & Privacy</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            In compliance with the <b>Data Privacy Act of 2012</b>, BukSU
            Fitness Gym is committed to protecting your data privacy.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowPrivacy(false)}>
            Got it!
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Toast for Login Notifications */}
      <div
        className="toast align-items-center"
        id="loginToast"
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

export default Login;
