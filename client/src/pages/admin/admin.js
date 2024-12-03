import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./admin.css";

const AdminPanel = () => {
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
        paddingTop: "-4rem",
        marginTop: "-4rem",
        paddingTop: "6rem",
        paddingBottom: "6rem",
      }}
    >
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "show" : ""}`} id="sidebar">
        <ul className="nav flex-column">
          <li className="nav-item">
            <a className="nav-link active" onClick={() => navigate("")}>
              Home
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" onClick={() => navigate("/admin/manage")}>
              Members
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" onClick={() => navigate("/admin/reports")}>
              Report Generation
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" onClick={() => navigate("")}>
              Equipments
            </a>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div
        className={`content flex-grow-1 ${sidebarOpen ? "sidebar-open" : ""}`}
      >
        {/* Navbar */}
        <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
          <div className="container-fluid d-flex align-items-center">
            <button
              className="btn btn-primary hamburger"
              type="button"
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
            >
              ☰
            </button>
            <a
              className="navbar-brand branding ms-2"
              onClick={() => navigate("/admin")}
            >
              <img src="/media/logo.png" className="slogo" alt="Logo" />
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
          {/* welcome section */}
          <div className="container mt-4 welcome">
            <img src="/media/hello.webp" className="bigimage" alt="Welcome" />
            <h1 className="headertxt">Good day, Admin!</h1>
            <p>
              Here are the common tools used to manage members and gym
              information.
            </p>
          </div>

          {/* widgets */}
          <div className="container mt-4">
            <div className="row widgets justify-content-center">
              <div className="col-md">
                <div
                  className="newcard mb-4 no-border"
                  onClick={() => navigate("/admin/idcheck")}
                >
                  <img
                    src="../media/act.png"
                    className="card-img-top act"
                    alt="Activate Member"
                  />
                  <div className="card-body">
                    <h5 className="card-title">
                      <b>Activate a Member</b>
                    </h5>
                    <p className="card-text">
                      Activate members who submitted requirements.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div
                  className="newcard mb-4 no-border"
                  onClick={() => navigate("/admin/manage")}
                >
                  <img
                    src="../media/all.png"
                    className="card-img-top"
                    alt="Manage Members"
                  />
                  <div className="card-body">
                    <h5 className="card-title">
                      <b>Manage Members</b>
                    </h5>
                    <p className="card-text">
                      Add, edit, or delete members from the gym database.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div
                  className="newcard mb-4 no-border"
                  onClick={() => navigate("/admin/reports")}
                >
                  <img
                    src="../media/equip.png"
                    className="card-img-top"
                    alt="Equipments"
                  />
                  <div className="card-body">
                    <h5 className="card-title">
                      <b>Generate Reports</b>
                    </h5>
                    <p className="card-text">
                      Print member attendance logs and other stats.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* recent signups and current gym users */}
          <div className="container mt-4">
            <div className="row">
              <div className="col">
                <div
                  className="newcard mb-3 no-border"
                  style={{ maxWidth: "440px" }}
                >
                  <div className="row g-0">
                    <div className="col-md-4">
                      <img
                        src="../media/new.png"
                        className="img-fluid rounded-start"
                        alt="Recent Signup"
                      />
                    </div>
                    <div className="col-md-8">
                      <div className="card-body d-flex flex-column justify-content-between">
                        <h5 className="card-title">
                          <b>Recent Signup</b>
                        </h5>
                        <div className="mt-auto">
                          <p className="card-text">$NamePlaceholder</p>
                          <p className="card-text">
                            <small className="text-body-secondary">
                              $IDPlaceholder
                            </small>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col">
                <div
                  className="newcard mb-3 no-border"
                  style={{ maxWidth: "440px" }}
                >
                  <div className="row g-0">
                    <div className="col-md-4">
                      <img
                        src="../media/current.png"
                        className="img-fluid rounded-start"
                        alt="Current Gym Users"
                      />
                    </div>
                    <div className="col-md-8">
                      <div className="card-body d-flex flex-column justify-content-between">
                        <h5 className="card-title">
                          <b>Current Gym Users</b>
                        </h5>
                        <div className="mt-auto">
                          <p className="card-text">
                            There are # members inside the gym right now.
                          </p>
                          <p className="card-text">
                            <small className="text-body-secondary">
                              Updated # mins ago based on last login.
                            </small>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
