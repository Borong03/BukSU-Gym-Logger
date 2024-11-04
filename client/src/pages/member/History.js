import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/styles.css";

const History = () => {
  const navigate = useNavigate();

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
              <p>You can check your visit history at here.</p>
            </div>
          </div>
          <div className="col light-background">
            <div className="card-body">
              <table class="table table-dark border-light table-striped-columns table-hover">
                <thead>
                  <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Time In</th>
                    <th scope="col">Time Out</th>
                    <th scope="col">Total Visit Hours</th>
                  </tr>
                </thead>
                <tbody></tbody>
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
