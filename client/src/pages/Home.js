import ReCAPTCHA from "react-google-recaptcha";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import * as bootstrap from "bootstrap";
import Leaderboard from "./leaderboards";
import FaqAccordion from "./dafaqs";

const Home = () => {
  const [showCaptchaModal, setShowCaptchaModal] = useState(false);
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);
  const [showFaqModal, setShowFaqModal] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(null);
  const navigate = useNavigate();

  const handleCaptchaChange = async (value) => {
    setCaptchaValue(value);

    if (value) {
      try {
        const response = await fetch("http://localhost:5000/verify-captcha", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ captchaResponse: value }),
        });

        const data = await response.json();

        if (data.message) {
          navigate("/login");
        } else {
          showToast("CAPTCHA verification failed. Please try again.");
        }
      } catch (error) {
        console.error("Error verifying CAPTCHA:", error);
        showToast("Error verifying CAPTCHA. Please try again.");
      }
    }
  };

  const showToast = (message) => {
    const toastBody = document.querySelector("#captchaToast .toast-body");
    if (toastBody) {
      toastBody.textContent = message;
    }
    const toastEl = document.getElementById("captchaToast");
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
  };

  return (
    <div
      className="main-container"
      style={{ paddingTop: "4.5rem", paddingBottom: "6rem" }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col">
            <img src="/media/logo.png" className="fitlogo" alt="logo" />

            <div className="welcomepage">
              <p>Welcome to the</p>
              <h1
                style={{
                  marginTop: "-1rem",
                  textShadow: "0px 0px 10px rgba(0, 0, 0, 0.25)",
                }}
              >
                <b>BukSU Fitness Gym</b>
              </h1>
            </div>

            <div className="groupbuttons">
              <button
                type="button"
                className="FAQs btn btn-light"
                onClick={() => setShowFaqModal(true)}
              >
                FAQs
              </button>
              <button
                type="button"
                className="Visits btn btn-light"
                onClick={() => setShowLeaderboardModal(true)}
              >
                Most Visits
              </button>
              <button
                onClick={() => setShowCaptchaModal(true)}
                type="button"
                className="gogo btn btn-success"
              >
                Get Started &gt;
              </button>
            </div>
          </div>
          <div className="col justify-content-lg-center">
            <div
              className="card text-bg-light newsupdates"
              style={{ Width: "500px;" }}
            >
              <div className="card-header">
                <b>News & Updates</b>
              </div>
              <div className="card-body">
                <div class="alert alert-success" role="alert">
                  There are 3 out of 10 people inside!
                </div>
                <iframe
                  src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fweb.facebook.com%2Fprofile.php%3Fid%3D61550652162170&tabs=timeline&width=500&height=300&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=true&appId=925221692879371"
                  width="500"
                  height="300"
                  style={{ border: "none", overflow: "hidden" }}
                  scrolling="no"
                  frameBorder="0"
                  allowFullScreen={true}
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for CAPTCHA */}
      <Modal
        show={showCaptchaModal}
        onHide={() => setShowCaptchaModal(false)}
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header>
          <Modal.Title>Please Verify You're Human</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ReCAPTCHA
            sitekey="6LeZQIMqAAAAAAnW9EdB-WQ4cW_ZrDcoGyLf6o-l"
            onChange={handleCaptchaChange}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowCaptchaModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for Leaderboard */}
      <Modal
        show={showLeaderboardModal}
        onHide={() => setShowLeaderboardModal(false)}
        centered
        dialogClassName="leaderboard-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Who visited the most?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Leaderboard />
        </Modal.Body>
      </Modal>

      {/* Modal for FAQs */}
      <Modal
        show={showFaqModal}
        onHide={() => setShowFaqModal(false)}
        centered
        dialogClassName="faq-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Frequently Asked Questions</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FaqAccordion />
        </Modal.Body>
      </Modal>

      {/* Toast for CAPTCHA Notifications */}
      <div
        className="toast align-items-center"
        id="captchaToast"
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

export default Home;
