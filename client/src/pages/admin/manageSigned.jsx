import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import * as bootstrap from "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../admin.css";
import DataTable from "datatables.net-dt";
import "datatables.net-dt/css/dataTables.dataTables.css";

const ManageMembers = () => {
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // Fetch members from the backend
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch("http://localhost:5000/users");
        const data = await response.json();

        // Filter inactive members and format the data
        const formattedData = data
          .filter((member) => !member.isActive)
          .map((member) => ({
            ...member,
            userId: member.email.split("@")[0],
            signupMethod: member.googleId ? "Continue with Google" : "Manual",
          }));

        setMembers(formattedData);
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    };

    fetchMembers();
  }, []);

  // Initialize DataTable when members are loaded
  useEffect(() => {
    if (members.length > 0) {
      new DataTable("#myTable");
    }
  }, [members]);

  // Show confirmation modal for activation
  const handleActivateClick = (member) => {
    setSelectedMember(member); // Set the selected member
    setShowModal(true); // Show modal
  };

  // Confirm activation of a member
  const confirmActivation = async () => {
    try {
      const response = await fetch("http://localhost:5000/users/activate", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: selectedMember.email }),
      });

      if (response.ok) {
        await response.json(); // Parse the JSON response
        const updatedMembers = members.filter(
          (member) => member.email !== selectedMember.email
        );
        setMembers(updatedMembers);

        // Dynamically update the toast body
        const toastBody = document.querySelector(
          "#activationToast .toast-body"
        );
        if (toastBody) {
          toastBody.textContent = `Congrats, ${selectedMember.firstName} has been activated!`;
        }

        // Initialize and show the toast
        const toastEl = document.getElementById("activationToast");
        const toast = new bootstrap.Toast(toastEl, { delay: 3000 }); // 3 seconds
        toast.show();

        // Close the modal
        setShowModal(false);
      } else {
        const result = await response.json(); // Parse error response
        console.error("Activation error:", result.message);
        alert(result.message || "Error activating member");
      }
    } catch (error) {
      console.error("Error activating member:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  const handleUpdateClick = (member) => {
    navigate("/update", { state: { user: member } });
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="sidebar" id="sidebar">
        <ul className="nav flex-column">
          <li className="nav-item">
            <a className="nav-link" href="/">
              Home
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link active" href="/">
              Members
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/">
              Report Generation
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/">
              Equipments
            </a>
          </li>
        </ul>
      </div>

      {/* Main content */}
      <div className="content flex-grow-1">
        <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
          <div className="container-fluid d-flex align-items-center">
            <button
              className="btn btn-primary hamburger"
              type="button"
              aria-label="Toggle sidebar"
              onClick={() => {
                document.getElementById("sidebar").classList.toggle("show");
                document
                  .querySelector(".content")
                  .classList.toggle("sidebar-open");
              }}
            >
              ☰
            </button>
            <a className="navbar-brand branding ms-2" href="/">
              <img src="../media/logo.png" className="slogo" alt="Logo" />
              BukSU Fitness Gym Admin Panel
            </a>
            <div className="ms-auto">
              <button type="button" className="btn btn-danger">
                Log out
              </button>
            </div>
          </div>
        </nav>

        <div className="contentbody">
          <div className="container mt-4 welcome">
            <img
              src="../media/members.webp"
              className="bigimage"
              alt="Welcome"
            />
            <h1 className="headertxt">Manage Members</h1>
            <p>Add, edit, or activate members in this list.</p>
          </div>

          <ul className="nav navpill nav-pills">
            <li className="nav-item">
              <a className="nav-link inactivepill" href="/manage">
                Activated
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link pilled active " aria-current="page">
                Signed Up
              </a>
            </li>
            <li className="nav-item">
              <div className="linee"></div>
            </li>
            <li className="nav-item">
              <button
                onClick={() => navigate("/signup")}
                className="btn circlebuttonsb"
              >
                <i className="bi bi-plus-lg"></i>
              </button>
            </li>
            <li className="nav-item">
              <button className="btn circlebuttonsr">
                <i className="bi bi-archive"></i>
              </button>
            </li>
          </ul>

          <div className="custom-table-background">
            <table className="table table-striped table-hover" id="myTable">
              <thead>
                <tr>
                  <th>
                    <input type="checkbox" />
                  </th>
                  <th>Name</th>
                  <th>Email Username</th>
                  <th>Signup Method</th>
                  <th>Options</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member._id}>
                    <td>
                      <input type="checkbox" />
                    </td>
                    <td>{`${member.firstName} ${member.lastName}`}</td>
                    <td>{member.userId}</td>
                    <td>{member.signupMethod}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-primary updatebutton"
                        onClick={() => handleUpdateClick(member)}
                      >
                        Update Details
                      </button>

                      <button
                        type="button"
                        className="btn btn-success goodbutton"
                        onClick={() => handleActivateClick(member)}
                      >
                        Activate Member
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal for Activation Confirmation */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Activation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to activate{" "}
          <strong>
            {selectedMember?.firstName} {selectedMember?.lastName}
          </strong>
          ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={confirmActivation}>
            Activate
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Toast for Activation Success */}
      <div
        className="toast align-items-center"
        id="activationToast"
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
          <strong className="me-auto">Activation Services</strong>
          <small>Just now</small>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="toast"
            aria-label="Close"
          ></button>
        </div>
        <div className="toast-body">
          Congrats, {selectedMember?.firstName} has been activated!
        </div>
      </div>
    </div>
  );
};

export default ManageMembers;
