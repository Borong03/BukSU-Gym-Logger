import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as bootstrap from "bootstrap";
import "./admin.css";

const UpdateDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user || {}; // Receive data from previous

  // Variables to store user data
  const [firstName, setFirstName] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [email, setEmail] = useState(user.email || "");

  // Show toast notification
  const showToast = (message) => {
    const toastBody = document.querySelector("#updateToast .toast-body");
    if (toastBody) {
      toastBody.textContent = message;
    }
    const toastEl = document.getElementById("updateToast");
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
  };

  // Handle submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Data to be sent:", { email, firstName, lastName }); // Data format

    try {
      const response = await fetch(`http://localhost:5000/users/update-name`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, firstName, lastName }),
      });

      const responseText = await response.text();
      console.log("Response:", responseText); // Log

      if (response.ok) {
        showToast("User updated successfully!");
        setTimeout(() => navigate(-1), 3000); // Redirect after 3 seconds
      } else {
        const errorData = JSON.parse(responseText);
        showToast(
          `Failed to update user: ${errorData.message || "Unknown error"}`
        );
      }
    } catch (error) {
      showToast(`Error: ${error.message}`);
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ paddingTop: "7rem", paddingBottom: "6rem" }}
    >
      <div className="card twotone">
        <div className="row">
          <div className="col dark-background">
            <div className="half">
              <img src="/media/pen.webp" className="idlogo" alt="Edit Icon" />
              <h5>
                <b>Edit Information</b>
              </h5>
              <p>
                If a member has made a mistake entering their info, you can
                update their First and Last Name. <br />
                <br />
              </p>
            </div>
          </div>
          <div className="col light-background">
            <form onSubmit={handleSubmit}>
              <div
                className="row"
                style={{ marginTop: "7rem", marginBottom: "6rem" }}
              >
                <div className="col-md-6">
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="floatingFirstName"
                      placeholder="John"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
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
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                    <label htmlFor="floatingLastName">Last Name</label>
                  </div>
                </div>

                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className="form-control"
                    id="floatingInput"
                    placeholder="12345678@buksu.edu.ph"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled
                  />
                  <label htmlFor="floatingInput">Institutional Email</label>
                </div>
              </div>

              <div className="reqbuttons">
                <button
                  type="button"
                  onClick={goBack}
                  className="btn btn-dark backback"
                >
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

      {/* Toast for Update Notifications */}
      <div
        className="toast align-items-center"
        id="updateToast"
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

export default UpdateDetails;
