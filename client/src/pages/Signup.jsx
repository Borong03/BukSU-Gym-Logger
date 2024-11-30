import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";

const Signup = () => {
  const navigate = useNavigate();
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [localPart, setLocalPart] = useState("");
  const [domain, setDomain] = useState("@student.buksu.edu.ph");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    // Check strength
    if (value.length < 6) {
      setPasswordStrength("👎 Password must be at least 6 characters.");
    } else if (value.match(/[A-Z]/) && value.match(/[0-9]/)) {
      setPasswordStrength("💖 Your Password is strong like you!");
    } else {
      setPasswordStrength(
        "😐 Hmmm... It can be better. Try adding a number and an uppercase letter."
      );
    }

    // Validate password match
    setPasswordMatch(value === confirmPassword);
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setPasswordMatch(value === password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullEmail = `${localPart}${domain}`;

    if (!passwordMatch || passwordStrength === "Weak") {
      alert("Please fix the errors before submitting.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email: fullEmail,
          password,
        }),
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        if (data.userId) {
          navigate(`/success?userId=${data.userId}`);
        } else {
          alert("Signup successful but no userId returned.");
        }
      } else {
        const data = await response.json();
        alert(data.message || "Signup failed, please try again.");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleGoogleSignIn = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };

  const goBack = () => navigate(-1);

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ paddingTop: "6rem", paddingBottom: "6rem" }}
    >
      <div className="card twotone">
        <div className="row">
          <div className="col dark-background">
            <div className="half">
              <img src="/media/write.webp" className="idlogo" alt="ID Logo" />
              <h5>
                <b>Register for free!</b>
              </h5>
              <p>
                Signup using your BukSU email <br /> to enjoy your fitness
                perks!
              </p>
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
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-floating mb-3">
                      <input
                        type="text"
                        className="form-control"
                        id="floatingFirstName"
                        placeholder="John"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                      <label htmlFor="floatingFirstName">First Name</label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating mb-3">
                      <input
                        type="text"
                        className="form-control"
                        id="floatingLastName"
                        placeholder="Doe"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                      <label htmlFor="floatingLastName">Last Name</label>
                    </div>
                  </div>
                </div>

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

                <div className="form-floating mb-3">
                  <input
                    type="password"
                    className="form-control"
                    id="floatingPassword"
                    placeholder="Password"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                  />
                  <label htmlFor="floatingPassword">Password</label>
                  <div className="mt-2">
                    <small
                      className={`text-${
                        passwordStrength ===
                        "💖 Your Password is strong like you!"
                          ? "success"
                          : passwordStrength ===
                            "😐 Hmmm... It can be better. Try adding a number and an uppercase letter."
                          ? "warning"
                          : "danger"
                      }`}
                    >
                      {passwordStrength}
                    </small>
                  </div>
                </div>

                <div className="form-floating mb-3">
                  <input
                    type="password"
                    className={`form-control ${
                      passwordMatch ? "" : "is-invalid"
                    }`}
                    id="floatingConfirmPassword"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    required
                  />
                  <label htmlFor="floatingConfirmPassword">
                    Confirm Password
                  </label>
                  {!passwordMatch && (
                    <div className="invalid-feedback">
                      Passwords do not match.
                    </div>
                  )}
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
                    I have read the
                    <b
                      className="text-primary"
                      style={{ cursor: "pointer" }}
                      onClick={() => setShowTerms(true)}
                    >
                      Terms & Conditions
                    </b>{" "}
                    and
                    <b
                      className="text-primary"
                      style={{ cursor: "pointer" }}
                      onClick={() => setShowPrivacy(true)}
                    >
                      BukSU Data Collection & Privacy
                    </b>
                  </label>
                </div>

                <div className="reqbuttons">
                  <button onClick={goBack} className="btn btn-dark backback">
                    Go Back
                  </button>
                  <button type="submit" className="btn btn-primary gotit">
                    Continue
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* terms modal */}
      <Modal show={showTerms} onHide={() => setShowTerms(false)} centered>
        <Modal.Header>
          <Modal.Title>Terms & Conditions</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>tbd</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowTerms(false)}>
            Got it!
          </Button>
        </Modal.Footer>
      </Modal>
      {/* privacy modal */}
      <Modal show={showPrivacy} onHide={() => setShowPrivacy(false)} centered>
        <Modal.Header>
          <Modal.Title>BukSU Data Collection & Privacy</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            In compliance with the <b>Data Privacy Act of 2012</b>, BukSU
            Fitness Gym - Digital Logging System is committed to protect and
            respect your personal data privacy.
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

export default Signup;
