import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./admin.css";

const ReportGenerator = () => {
  const [rangeType, setRangeType] = useState("daily");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [reportLink, setReportLink] = useState(null);
  const [message, setMessage] = useState("");

  const handleGenerateReport = async () => {
    setLoading(true);
    setMessage("");
    setReportLink(null);

    const payload = {
      rangeType,
      customStart: rangeType === "custom" ? customStart : null,
      customEnd: rangeType === "custom" ? customEnd : null,
      adminEmail,
    };

    try {
      const response = await fetch("http://localhost:5000/report/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (response.ok) {
        setMessage("Report generated successfully!");
        setReportLink(data.sheetUrl);
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Failed to generate report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h1
        className="text-center headertxt"
        style={{
          color: "white",
        }}
      >
        Attendance Report Generator
      </h1>
      <div
        className="form-group mt-3"
        style={{
          color: "white",
        }}
      >
        <label>Select a Range:</label>
        <select
          className="form-control"
          value={rangeType}
          onChange={(e) => setRangeType(e.target.value)}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="custom">Custom Date Range</option>
        </select>
      </div>
      {rangeType === "custom" && (
        <div
          className="form-row mt-3"
          style={{
            color: "white",
          }}
        >
          <div className="col">
            <label>Start Date:</label>
            <input
              type="date"
              className="form-control"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
            />
          </div>
          <div className="col">
            <label>End Date:</label>
            <input
              type="date"
              className="form-control"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
            />
          </div>
        </div>
      )}
      <div
        className="form-group mt-3"
        style={{
          color: "white",
        }}
      >
        <label>Where do you want to send the email?</label>
        <input
          type="email"
          className="form-control"
          placeholder="Enter admin email (optional)"
          value={adminEmail}
          onChange={(e) => setAdminEmail(e.target.value)}
        />
      </div>
      <button
        className="btn btn-primary mt-4"
        onClick={handleGenerateReport}
        disabled={loading}
      >
        {loading ? (
          <>
            <span
              className="spinner-border spinner-border-sm"
              aria-hidden="true"
            ></span>
            <span className="ms-2">Generating...</span>
          </>
        ) : (
          "Generate Report"
        )}
      </button>

      {message && <div className="alert alert-info mt-4">{message}</div>}
      {reportLink && (
        <div className="mt-3">
          <a
            href={reportLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-success"
          >
            View Report
          </a>
        </div>
      )}
    </div>
  );
};

export default ReportGenerator;
