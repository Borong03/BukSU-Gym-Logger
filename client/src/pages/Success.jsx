import React, { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";
import { useNavigate, useSearchParams } from "react-router-dom";

const Success = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const barcodeRef = useRef(null);

  // Extract the localPart from the query parameters
  const localPart = searchParams.get("localPart");

  useEffect(() => {
    // Generate the barcode using JsBarcode
    if (barcodeRef.current && localPart) {
      JsBarcode(barcodeRef.current, localPart, { format: "CODE39" });
    }
  }, [localPart]);

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ paddingTop: "4rem", paddingBottom: "6rem" }}
    >
      <div className="card cardwhole">
        <div className="row">
          <div className="card-body">
            <div className="successcard">
              <img src="media/done.webp" className="done" alt="Done" />
              <h5 className="card-title">
                <b>You are now Registered!</b>
              </h5>
              <p className="card-text">
                Please visit the Admin Kiosk with your requirements <br />
                for your membership activation. <br />
                <br /> You can use the barcode below to access the gym.{" "}
                <br></br> Please save it or take a screenshot for later use.
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginLeft: "-2.5rem",
                  marginBottom: "-1rem",
                }}
                className="barcode-container"
              >
                <svg ref={barcodeRef}></svg> {/* Render the barcode */}
              </div>
              <div className="reqbuttons">
                <button
                  onClick={() => navigate("/signup")}
                  className="btn btn-dark signgo"
                >
                  Register another User
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="btn btn-primary logingo"
                >
                  Continue to Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Success;
