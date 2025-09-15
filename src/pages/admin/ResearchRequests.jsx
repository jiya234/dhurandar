import React from "react";
import "./ResearchRequests.css";

const ResearchRequests = () => {
  const requests = [
    { id: 101, title: "Soil Quality Report", status: "Pending" },
    { id: 102, title: "Weather Data Access", status: "Approved" },
    { id: 103, title: "Crop Disease Analysis", status: "Pending" },
  ];

  return (
    <div className="requests-page">
      <h1 className="page-title">Research Requests</h1>
      <ul className="requests-list">
        {requests.map((req) => (
          <li key={req.id} className="request-item">
            <span>{req.title}</span>
            <span className={`status ${req.status.toLowerCase()}`}>
              {req.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResearchRequests;
