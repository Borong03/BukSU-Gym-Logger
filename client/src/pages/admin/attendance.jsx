import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./admin.css";
import ReportGenerator from "./report";

const Attendance = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div
      className="d-flex"
      style={{
        backgroundImage: `url(${require("../../assets/images/gaussian.png")})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        backgroundPosition: "center",
        minHeight: "100vh",
        paddingTop: "2rem",
        paddingBottom: "6rem",
      }}
    >
      <div className={`sidebar ${sidebarOpen ? "show" : ""}`} id="sidebar">
        <ul className="nav flex-column">
          <li className="nav-item">
            <a className="nav-link" onClick={() => navigate("/admin")}>
              Home
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" onClick={() => navigate("/admin/manage")}>
              Members
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link active">Report Generation</a>
          </li>
        </ul>
      </div>

      <div
        className={`content flex-grow-1 ${sidebarOpen ? "sidebar-open" : ""}`}
      >
        <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
          <div className="container-fluid d-flex align-items-center">
            <button
              className="btn btn-primary hamburger"
              type="button"
              aria-label="Toggle sidebar"
              onClick={toggleSidebar}
            >
              ☰
            </button>
            <a
              className="navbar-brand branding ms-2"
              onClick={() => navigate("/admin")}
            >
              <img src="../media/logo.png" className="slogo" alt="Logo" />
              BukSU Fitness Gym Admin Panel
            </a>
            <div className="ms-auto">
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleLogout}
              >
                Log out
              </button>
            </div>
          </div>
        </nav>

        <div className="contentbody">
          {/* Render ReportGenerator component */}
          <ReportGenerator />
        </div>
      </div>
    </div>
  );
};

export default Attendance;
