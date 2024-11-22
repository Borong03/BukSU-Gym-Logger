import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap"; // Import React-Bootstrap Modal
import ReCAPTCHA from "react-google-recaptcha";

const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(null);
  const navigate = useNavigate();

  const handleCaptchaChange = async (value) => {
    setCaptchaValue(value);

    // if CAPTCHA is completed successfully, redirect to /login
    if (value) {
      try {
        const response = await fetch('http://localhost:5000/verify-captcha', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ captchaResponse: value })
        });

        const data = await response.json();

        if (data.message) {
          // CAPTCHA verified successfully, proceed to login page
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

  const handleGetStartedClick = () => {
    setShowModal(true);
  };

  return (
    <div>
      <img src="/media/logo.png" className="fitlogo" alt="Gym Logo" />
      <div className="welcomepage">
        <p>Welcome to the</p>
        <h1>
          <b>BukSU Fitness Gym</b>
        </h1>
      </div>

      <div className="groupbuttons">
        <button type="button" className="FAQs btn btn-light">
          FAQs
        </button>
        <button type="button" className="Visits btn btn-light">
          Most Visits
        </button>
        <button
          onClick={handleGetStartedClick}
          type="button"
          className="gogo btn btn-success"
        >
          Get Started &gt;
        </button>
      </div>

      {/* Embed Facebook Page Plugin */}
      <div className="facebook-widget">
        <iframe
          src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fweb.facebook.com%2Fprofile.php%3Fid%3D61550652162170&tabs=timeline&width=340&height=331&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId=925221692879371"
          width="340"
          height="331"
          style={{ border: "none", overflow: "hidden" }}
          scrolling="no"
          frameBorder="0"
          allowFullScreen={true}
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          title="Facebook Page Plugin"
        ></iframe>
      </div>

      {/* modal for CAPTCHA */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
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
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* custom CSS for modal as ./style not kinda workin */}
      <style>
        {`
          .modal-backdrop {
            backdrop-filter: blur(20px);
            background-color: rgba(0, 0, 0, 0.1);
          }
          .modal.fade .modal-dialog {
            transform: translateY(-10%);
            transition: all 0.3s ease-out;
          }
          .modal.show .modal-dialog {
            transform: translateY(0);
          }
          .facebook-widget {
            margin-top: 20px;
            display: flex;
            justify-content: center;
          }
        `}
      </style>
    </div>
  );
};

export default Home;
