import React, { useEffect, useRef, useState } from "react";
import Quagga from "quagga";
import { useNavigate } from "react-router-dom";

const Barcode = () => {
  const navigate = useNavigate();
  const scannerRef = useRef(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Prevent duplicate requests

  // Barcode detection handler
  const handleBarcodeDetected = (data) => {
    if (loading) return; // Prevent multiple detections
    setLoading(true); // Block further detections
    const barcode = data.codeResult.code;
    Quagga.stop(); // Stop scanning after detection
    handleBarcodeLogin(barcode);
  };

  // Handle barcode login
  const handleBarcodeLogin = async (barcode) => {
    setError(null); // Clear any existing errors

    try {
      const response = await fetch("http://localhost:5000/auth/login-barcode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ barcode }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null); // Handle non-JSON responses
        if (response.status === 429) {
          // Weekly visit limit reached
          if (data && data.userId) {
            navigate(`/limit?userId=${data.userId}`);
          } else {
            setError("Weekly visit limit reached, but no userId returned.");
          }
        } else {
          setError(data?.message || "Barcode login failed.");
        }
        Quagga.start(); // Restart scanning for retries
        return;
      }

      const data = await response.json();
      const { firstName, userId, isAdmin, token } = data;

      // Save token and user role in localStorage
      localStorage.setItem("jwtToken", token); // Save JWT token
      localStorage.setItem("role", isAdmin ? "admin" : "user"); // Save role

      // Redirect to appropriate dashboard
      const redirectUrl = isAdmin
        ? `/admin?name=${encodeURIComponent(firstName)}&userId=${userId}`
        : `/dash?name=${encodeURIComponent(firstName)}&userId=${userId}`;
      navigate(redirectUrl);
    } catch (err) {
      console.error("Error during barcode login:", err);
      setError("An error occurred while processing the barcode.");
      Quagga.start(); // Restart scanning for retries
    } finally {
      setLoading(false); // Allow new requests
    }
  };

  // Initialize Quagga
  useEffect(() => {
    Quagga.init(
      {
        inputStream: {
          type: "LiveStream",
          target: scannerRef.current, // Attach camera feed here
          constraints: {
            facingMode: "environment", // Use rear camera
          },
        },
        decoder: {
          readers: ["code_39_reader"], // Use Code 39 barcode format
        },
      },
      (err) => {
        if (err) {
          console.error("Error initializing Quagga:", err);
          setError("Unable to access camera for barcode scanning.");
          return;
        }
        Quagga.start();
      }
    );

    // Add barcode detection event
    Quagga.onDetected(handleBarcodeDetected);

    // Cleanup Quagga on component unmount
    return () => {
      Quagga.offDetected(handleBarcodeDetected);
      Quagga.stop();
    };
  }, []); // Empty dependency array ensures this runs only once

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
              <p className="card-text">
                Please scan your barcode to login. <br />
                You can find your barcode below your Student ID.
              </p>
              {error && <p className="text-danger">{error}</p>}
              <div
                className="barcode-container"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "600px",
                  height: "300px",
                  margin: "0 auto 20px",
                  border: "2px solid #ccc",
                  borderRadius: "10px",
                  overflow: "hidden",
                }}
              >
                <div
                  ref={scannerRef}
                  style={{
                    width: "100%",
                    height: "100%",
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
    </div>
  );
};

export default Barcode;
