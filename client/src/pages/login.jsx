import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";

const Login = () => {
  const navigate = useNavigate();
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const validateEmail = (e) => {
    const emailValue = e.target.value;
    setEmail(emailValue);

    // match only @student.buksu.edu.ph or @buksu.edu.ph emails
    const emailPattern =
      /^[a-zA-Z0-9._%+-]+@(student\.buksu\.edu\.ph|buksu\.edu\.ph)$/;

    if (!emailPattern.test(emailValue)) {
      setEmailError("Please use a valid BukSU institutional email.");
    } else {
      setEmailError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (emailError || !email || !password) {
      alert("Please fill in all fields correctly.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.status === 429) {
        alert(data.message); // inform the user that they've hit the limit
        navigate(`/limit?userId=${data.userId}`);
        return; // prevent further execution
      }
      if (response.ok) {
        const { firstName, userId, isAdmin } = data;
        const redirectUrl = isAdmin
          ? `/admin?name=${encodeURIComponent(firstName)}&userId=${userId}`
          : `/dash?name=${encodeURIComponent(firstName)}&userId=${userId}`;
        navigate(redirectUrl);
      } else {
        alert(data.message || "Login failed, please try again.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleGoogleSignIn = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };

  return (
    <div className="d-flex justify-content-center align-items-center">
      <div className="card twotone">
        <div className="row">
          <div className="col dark-background">
            <div className="half">
              <img src="/media/write.webp" className="idlogo" alt="ID Logo" />
              <h5>
                <b>
                  Login to the <br></br> BukSU Fitness Gym
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
                  <img
                    className="svgs"
                    src="media/divider2.svg"
                    alt="Divider"
                  />
                </div>
              </button>

              <form onSubmit={handleSubmit}>
                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className={`form-control ${emailError ? "is-invalid" : ""}`}
                    id="floatingInput"
                    placeholder="12345678@buksu.edu.ph"
                    value={email}
                    onChange={validateEmail}
                    required
                  />
                  <label htmlFor="floatingInput">Institutional Email</label>
                  {emailError && (
                    <div className="invalid-feedback">{emailError}</div>
                  )}
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

      {/* Terms and Privacy Modals */}
      <Modal show={showTerms} onHide={() => setShowTerms(false)} centered>
        <Modal.Header>
          <Modal.Title>Terms & Conditions</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>to be discussed...</p>
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
    </div>
  );
};

export default Login;
