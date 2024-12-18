import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./admin.css";

const AdminPanel = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [recentSignup, setRecentSignup] = useState(null);
  const [currentMembers, setCurrentMembers] = useState(0);
  const navigate = useNavigate();

  // Fetch recent signup and current members
  useEffect(() => {
    const fetchRecentSignup = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/misc/recent-signup"
        );
        if (response.ok) {
          const data = await response.json();
          setRecentSignup(data);
        } else {
          console.error("Failed to fetch recent signup data.");
        }
      } catch (error) {
        console.error("Error fetching recent signup data:", error);
      }
    };

    const fetchCurrentMembers = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/misc/current-members"
        );
        if (response.ok) {
          const data = await response.json();
          setCurrentMembers(data.count);
        } else {
          console.error("Failed to fetch current members.");
        }
      } catch (error) {
        console.error("Error fetching current members:", error);
      }
    };

    fetchRecentSignup();
    fetchCurrentMembers();

    // Update current members every 30 seconds
    const interval = setInterval(fetchCurrentMembers, 30000);
    return () => clearInterval(interval);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("role");
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("isAdmin");
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
            <a className="nav-link" onClick={() => navigate("/admin/generate")}>
              Report Generation
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
          {/* Welcome Section */}
          <div className="container mt-4 welcome">
            <img src="/media/hello.webp" className="bigimage" alt="Welcome" />
            <h1 className="headertxt">Good day, Admin!</h1>
            <p>
              Here are the common tools used to manage members and gym
              information.
            </p>
          </div>

          {/* Widgets */}
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
                  onClick={() => navigate("/admin/generate")}
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

          {/* Recent Signups and Current Gym Users */}
          <div className="container mt-4">
            <div className="row">
              {/* Recent Signup */}
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
                          {recentSignup ? (
                            <>
                              <p className="card-text">
                                {recentSignup.name || "N/A"}
                              </p>
                              <p className="card-text">
                                <small className="text-body-secondary">
                                  ID: {recentSignup.id || "N/A"}
                                </small>
                              </p>
                            </>
                          ) : (
                            <p className="card-text">Loading...</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Gym Users */}
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
                            There are {currentMembers} members inside the gym
                            right now.
                          </p>
                          <p className="card-text">
                            <small className="text-body-secondary">
                              Updated every 30 seconds.
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
