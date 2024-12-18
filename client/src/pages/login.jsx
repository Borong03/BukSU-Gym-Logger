import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import * as bootstrap from "bootstrap";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [localPart, setLocalPart] = useState("");
  const [domain, setDomain] = useState("@student.buksu.edu.ph");
  const [password, setPassword] = useState("");
  const [termsChecked, setTermsChecked] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  // Show toast notification
  const showToast = (message) => {
    const toastBody = document.querySelector("#loginToast .toast-body");
    if (toastBody) toastBody.textContent = message;

    const toastEl = document.getElementById("loginToast");
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
  };

  // Handle errors from Google OAuth callback
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const error = params.get("error");

    if (error) {
      let errorMessage = "An unknown error occurred.";
      switch (error) {
        case "google_auth_failed":
          errorMessage = "Google authentication failed. Please try again.";
          break;
        case "user_not_found":
          errorMessage =
            "User not found. You can sign up to the Digital Logging System by clicking on Signup!";
          break;
        case "inactive_account":
          errorMessage =
            "You are signed up, but not yet activated. Please proceed to the admin kiosk for account activation.";
          break;
        case "visit_limit_reached":
          errorMessage = "Weekly visit limit reached. Access denied.";
          break;
        case "auth_error":
          errorMessage = "An authentication error occurred. Try again.";
          break;
        default:
          errorMessage = "Unexpected error occurred. Please retry.";
      }
      showToast(errorMessage);
    }
  }, [location]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!termsChecked) {
      showToast("Please agree to the Terms & Privacy Policy.");
      return;
    }

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
        const { firstName, userId, isAdmin, token } = data;
        localStorage.setItem("jwtToken", token);
        localStorage.setItem("userId", userId);
        localStorage.setItem("name", firstName);
        localStorage.setItem("isAdmin", isAdmin ? "true" : "false");

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

  // Handle Google sign-in
  const handleGoogleSignIn = () => {
    window.location.href = `${API_URL}/auth/google`;
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
<<<<<<< Updated upstream
              <div className="divider" style={{ textAlign: "center" }}>
=======
<<<<<<< Updated upstream
              <div className="divider">
=======

              <div className="divider" style={{ textAlign: "center" }}>
>>>>>>> Stashed changes
>>>>>>> Stashed changes
                <img
                  className="svgs centerpls"
                  style={{
                    display: "block",
                    margin: "0 auto",
                    marginBottom: "1rem",
                    width: "80%",
                    maxWidth: "300px",
                  }}
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
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <label>Password</label>
                </div>

                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="flexCheckDefault"
                    checked={termsChecked}
                    onChange={() => setTermsChecked(!termsChecked)}
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
                    and{" "}
                    <b
                      className="text-primary"
                      onClick={() => setShowPrivacy(true)}
                    >
                      BukSU Data Collection & Privacy
                    </b>
                  </label>
                </div>

                <div className="reqbuttons">
                  <button
                    onClick={() => navigate("/disclaimer")}
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

      {/* Terms Modal */}
      <Modal show={showTerms} onHide={() => setShowTerms(false)} centered>
        <Modal.Header>
          <Modal.Title>Terms & Conditions</Modal.Title>
        </Modal.Header>
        <Modal.Body>Terms and conditions content...</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowTerms(false)}>
            Got it!
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Privacy Modal */}
      <Modal show={showPrivacy} onHide={() => setShowPrivacy(false)} centered>
        <Modal.Header>
          <Modal.Title>BukSU Data Collection & Privacy</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          In compliance with the <b>Data Privacy Act of 2012</b>, BukSU Fitness
          Gym is committed to protecting your data privacy.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowPrivacy(false)}>
            Got it!
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Toast */}
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
          ></button>
        </div>
        <div className="toast-body"></div>
      </div>
    </div>
  );
};

export default Login;
