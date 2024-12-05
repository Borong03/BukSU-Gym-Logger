import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import * as bootstrap from "bootstrap";
import "../../styles/styles.css";
import DataTable from "datatables.net-dt";
import "datatables.net-dt/css/dataTables.dataTables.css";
import $ from "jquery";

const History = () => {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get("userId");

  const goBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    console.log("Location state in History:", location.state); // Debug
  }, [location]);

  useEffect(() => {
    console.log("Authenticated:", localStorage.getItem("isAuthenticated"));
  }, []);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/history?userId=${userId}`
        );
        const data = await response.json();
        if (response.ok) {
          setHistory(data);
        } else {
          const toastBody = document.querySelector("#historyToast .toast-body");
          if (toastBody) {
            toastBody.textContent = data.message || "Failed to fetch history.";
          }
          const toastEl = document.getElementById("historyToast");
          const toast = new bootstrap.Toast(toastEl);
          toast.show();
        }
      } catch (error) {
        console.error("Error fetching visit history:", error);
        const toastBody = document.querySelector("#historyToast .toast-body");
        if (toastBody) {
          toastBody.textContent =
            "An error occurred while fetching visit history.";
        }
        const toastEl = document.getElementById("historyToast");
        const toast = new bootstrap.Toast(toastEl);
        toast.show();
      }
    };

    if (userId) {
      fetchHistory();
    }
  }, [userId]);

  useEffect(() => {
    if (history.length > 0) {
      const tableElement = "#myTable";

      // Check if the DataTable has already been initialized
      if ($.fn.DataTable.isDataTable(tableElement)) {
        $(tableElement).DataTable().destroy();
      }

      // Reinitialize the DataTable
      new DataTable(tableElement, {
        paging: true,
        searching: false,
        info: false,
        lengthChange: false,
      });
    }
  }, [history]);

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ paddingTop: "6rem", paddingBottom: "6rem" }}
    >
      <div className="card twotone">
        <div className="row">
          <div className="col dark-background">
            <div className="half">
              <img src="/media/visit.webp" className="idlogo" alt="ID Logo" />
              <h5>
                <b>Visit History</b>
              </h5>
              <p>You can check your visit history here.</p>
            </div>
          </div>
          <div className="col light-background">
            <div className="card-body">
              <table
                className="table table-dark border-light table-striped-columns table-hover"
                id="myTable"
              >
                <thead>
                  <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Time In</th>
                    <th scope="col">Time Out</th>
                    <th scope="col">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((entry, index) => (
                    <tr key={index}>
                      <td>{new Date(entry.loginTime).toLocaleDateString()}</td>
                      <td>{new Date(entry.loginTime).toLocaleTimeString()}</td>
                      <td>
                        {entry.logoutTime
                          ? new Date(entry.logoutTime).toLocaleTimeString()
                          : "N/A"}
                      </td>
                      <td>
                        {entry.logoutTime
                          ? (() => {
                              const duration =
                                new Date(entry.logoutTime) -
                                new Date(entry.loginTime);
                              const totalMinutes = Math.floor(
                                duration / 1000 / 60
                              );
                              const hours = Math.floor(totalMinutes / 60);
                              const minutes = totalMinutes % 60;
                              return `${hours
                                .toString()
                                .padStart(2, "0")}:${minutes
                                .toString()
                                .padStart(2, "0")}`;
                            })()
                          : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="reqbuttons">
                <button onClick={goBack} className="btn btn-primary signup">
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast for Notifications */}
      <div
        className="toast align-items-center"
        id="historyToast"
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

export default History;
