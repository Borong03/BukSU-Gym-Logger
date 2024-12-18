import React, { useEffect, useRef, useState, useCallback } from "react";
import Quagga from "quagga";
import { useNavigate } from "react-router-dom";
import * as bootstrap from "bootstrap";

const Barcode = () => {
  const navigate = useNavigate();
  const scannerRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Show toast notification
  const showToast = (message) => {
    const toastEl = document.getElementById("barcodeToast");
    if (!toastEl) return;

    const toastBody = toastEl.querySelector(".toast-body");
    if (toastBody) toastBody.textContent = message;

    const toast =
      bootstrap.Toast.getInstance(toastEl) || new bootstrap.Toast(toastEl);
    toast.show();
  };

  // Handle barcode login
  const handleBarcodeLogin = useCallback(
    async (barcode) => {
      try {
        console.log("Sending barcode to server:", barcode);

        const response = await fetch(
          "http://localhost:5000/auth/login-barcode",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ barcode }),
          }
        );

        // Stop processing immediately if server responds with an error
        if (!response.ok) {
          let message = "User not found.";
          if (response.status === 403) {
            message =
              "Your account is not activated. Please visit the admin kiosk for account activation.";
          } else if (response.status === 429) {
            message = "Weekly visit limit reached.";
          }
          showToast(message);
          return;
        }

        const data = await response.json();
        const { firstName, userId, isAdmin, token } = data;

        // Save user data
        localStorage.setItem("jwtToken", token);
        localStorage.setItem("userId", userId);
        localStorage.setItem("name", firstName || "User");
        localStorage.setItem("isAdmin", isAdmin ? "true" : "false");

        const redirectUrl = isAdmin
          ? `/admin?name=${encodeURIComponent(firstName)}&userId=${userId}`
          : `/dash?name=${encodeURIComponent(firstName)}&userId=${userId}`;
        navigate(redirectUrl);
      } catch (err) {
        console.error("Error during barcode login:", err);
        showToast("An unexpected error occurred. Please try again.");
      } finally {
        setIsProcessing(false);
        setLoading(false);
        Quagga.start(); // Restart the scanner after processing
      }
    },
    [navigate]
  );

  // Barcode detection handler
  const handleBarcodeDetected = useCallback(
    (data) => {
      try {
        if (!data?.codeResult?.code) {
          console.warn("Invalid or incomplete barcode data:", data);
          return; // Skip invalid results
        }

        if (isProcessing || loading) return; // Avoid duplicate processing

        const barcode = data.codeResult.code;
        console.log("Valid barcode detected:", barcode);

        setIsProcessing(true);
        setLoading(true);

        Quagga.offDetected(handleBarcodeDetected); // Stop Quagga event
        Quagga.stop(); // Stop Quagga completely
        handleBarcodeLogin(barcode); // Process the barcode
      } catch (err) {
        console.error("Error in barcode detection:", err);
        showToast("Error processing the barcode. Please try again.");
        setIsProcessing(false);
        setLoading(false);
        Quagga.start(); // Restart Quagga if error occurs
      }
    },
    [handleBarcodeLogin, isProcessing, loading]
  );

  // Initialize Quagga
  useEffect(() => {
    Quagga.init(
      {
        inputStream: {
          type: "LiveStream",
          target: scannerRef.current,
          constraints: { facingMode: "environment" },
        },
        decoder: { readers: ["code_39_reader"] },
        locate: true,
      },
      (err) => {
        if (err) {
          console.error("Error initializing Quagga:", err);
          showToast("Unable to access the camera.");
          return;
        }
        Quagga.start();
      }
    );

    Quagga.onDetected(handleBarcodeDetected);

    return () => {
      Quagga.offDetected(handleBarcodeDetected);
      Quagga.stop();
    };
  }, [handleBarcodeDetected]);

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ paddingTop: "3.5rem", paddingBottom: "4rem" }}
    >
      <div className="card cardwhole">
        <div className="row">
          <div className="card-body">
            <div className="successcard">
              <img src="media/id.webp" className="done" alt="Barcode" />
              <h5 className="card-title">
                <b>Login with Barcode</b>
              </h5>
              <p className="card-text">Please scan your barcode to login.</p>

              {/* Camera Viewfinder with Smaller Size */}
              <div
                className="barcode-container"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "400px", // Smaller width
                  height: "300px", // Smaller height
                  margin: "0 auto 20px",
                  border: "2px solid #ccc",
                  borderRadius: "10px",
                  backgroundColor: "#000", // Black background for contrast
                  overflow: "hidden", // Ensures content doesn't exceed the container
                }}
              >
                <div
                  ref={scannerRef}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover", // Scales video to fit container without overflow
                  }}
                ></div>
              </div>
              <div className="reqbuttons">
                <button
                  onClick={() => navigate("/login")}
                  className="btn btn-primary logingo"
                >
                  Back to Regular Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      <div
        className="toast align-items-center"
        id="barcodeToast"
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

export default Barcode;
