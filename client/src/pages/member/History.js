import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/styles.css";
import DataTable from "datatables.net-dt";
import "datatables.net-dt/css/dataTables.dataTables.css";

const History = () => {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get("userId"); // Get userId from query parameter

  useEffect(() => {
    // get visit history when component mounts
    const fetchHistory = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/history?userId=${userId}`
        );
        const data = await response.json();
        if (response.ok) {
          setHistory(data);
        } else {
          alert(data.message || "Failed to fetch history.");
        }
      } catch (error) {
        console.error("Error fetching visit history:", error);
        alert("An error occurred while fetching visit history.");
      }
    };

    if (userId) {
      fetchHistory();
    }
  }, [userId]);

  useEffect(() => {
    // init DataTable only when history data is available
    if (history.length > 0) {
      new DataTable("#myTable", {
        paging: true,
        searching: false,
        info: false,
        lengthChange: false,
      });
    }
  }, [history]);

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
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
    </div>
  );
};

export default History;
