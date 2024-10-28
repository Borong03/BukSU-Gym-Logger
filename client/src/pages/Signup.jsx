import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import "./styles.css";

const Signup = () => {
  const navigate = useNavigate();
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const validateEmail = (e) => {
    const emailValue = e.target.value;
    setEmail(emailValue);

    // RegEX to match only @student.buksu.edu.ph or @buksu.edu.ph emails
    const emailPattern =
      /^[a-zA-Z0-9._%+-]+@(student\.buksu\.edu\.ph||buksu\.edu\.ph)$/;

    if (!emailPattern.test(emailValue)) {
      setEmailError("Please use a valid BukSU institutional email.");
    } else {
      setEmailError("");
    }
  };

  const goBack = () => navigate(-1);

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
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
                Signup using your BukSU email to <br></br> enjoy your fitness
                perks!
              </p>
            </div>
          </div>
          <div className="col light-background">
            <div className="card-body">
              <div className="image-container">
                <img className="svgs" src="media/dummy.svg" alt="Dummy" />
                <img className="svgs" src="media/divider2.svg" alt="Divider" />
              </div>

              <form
                action="/success"
                onSubmit={(e) => {
                  if (emailError) {
                    e.preventDefault(); // Prevent submission if email is invalid
                    alert("Please use a valid BukSU email.");
                  }
                }}
              >
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-floating mb-3">
                      <input
                        type="text"
                        className="form-control"
                        id="floatingFirstName"
                        placeholder="John"
                        required
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
                      />
                      <label htmlFor="floatingLastName">Last Name</label>
                    </div>
                  </div>
                </div>

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
          <p>Here you can write your Terms & Conditions...</p>
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
            respect your personal data privacy. The University collects various
            data and information from various subjects using different systems.
            In processing this data and information, BukSU ensures the free flow
            of information as required under the{" "}
            <b>Freedom of Information Act (Executive Order No. 2 S. 2016).</b>
          </p>
          <br></br>
          <p>
            Should there be data privacy concerns and requests, you may contact
            the University Data Protection Officer at{" "}
            <b>dataprivacyoffice@buksu.edu.ph</b>.
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
