import ReCAPTCHA from "react-google-recaptcha";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import Leaderboard from "./leaderboards"; // Import the Leaderboard component (Corrected)
import FaqAccordion from "./dafaqs"; // Import the FAQ Accordion component (Corrected)

const Home = () => {
  const [showCaptchaModal, setShowCaptchaModal] = useState(false);
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);
  const [showFaqModal, setShowFaqModal] = useState(false); // New state for FAQ modal
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
          alert("CAPTCHA verification failed. Please try again.");
        }
      } catch (error) {
        console.error("Error verifying CAPTCHA:", error);
        alert("Error verifying CAPTCHA. Please try again.");
      }
    }
  };

  return (
    <div
      className="main-container"
      style={{ paddingTop: "6rem", paddingBottom: "6rem" }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col">
            <img src="/media/logo.png" className="fitlogo" alt="logo" />

            <div className="welcomepage">
              <p>Welcome to the</p>
              <h1>
                <b>BukSU Fitness Gym</b>
              </h1>
            </div>

            <div className="groupbuttons">
              <button
                type="button"
                className="FAQs btn btn-light"
                onClick={() => setShowFaqModal(true)} // Show FAQ modal
              >
                FAQs
              </button>
              <button
                type="button"
                className="Visits btn btn-light"
                onClick={() => setShowLeaderboardModal(true)} // Show leaderboard modal
              >
                Most Visits
              </button>
              <button
                onClick={() => setShowCaptchaModal(true)} // Show CAPTCHA modal
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
          <Leaderboard /> {/* Embed Leaderboard component */}
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
          <FaqAccordion /> {/* Embed FAQ component */}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Home;
