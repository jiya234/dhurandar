import React, { useState } from "react";
import "./ResearchRequests.css";

const ResearchRequests = () => {

  const [requests, setRequests] = useState([
    {
      id: 101,
      researcher: "Anjali Sharma",
      region: "Kasganj",
      dataType: "Soil Quality Report",
      status: "Pending"
    },
    {
      id: 102,
      researcher: "Rahul Verma",
      region: "Aligarh",
      dataType: "Weather Data Access",
      status: "Approved"
    },
    {
      id: 103,
      researcher: "Karan Singh",
      region: "Mathura",
      dataType: "Crop Disease Analysis",
      status: "Pending"
    }
  ]);

  const handleApprove = (id) => {
    setRequests(prev =>
      prev.map(req =>
        req.id === id ? { ...req, status: "Approved" } : req
      )
    );
  };

  const handleDecline = (id) => {
    setRequests(prev =>
      prev.map(req =>
        req.id === id ? { ...req, status: "Declined" } : req
      )
    );
  };

  return (
    <div className="section">
      <h2>Researcher Data Approval Requests</h2>

      {requests.length === 0 ? (
        <p className="empty">No pending requests 🎉</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Researcher</th>
              <th>Region</th>
              <th>Dataset</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {requests.map(req => (
              <tr key={req.id}>
                <td>{req.researcher}</td>
                <td>{req.region}</td>
                <td>{req.dataType}</td>

                <td>
                  <span className={`status ${req.status.toLowerCase()}`}>
                    {req.status}
                  </span>
                </td>

                <td>
                  {req.status === "Pending" && (
                    <>
                      <button
                        className="approve"
                        onClick={() => handleApprove(req.id)}
                      >
                        Approve
                      </button>

                      <button
                        className="decline"
                        onClick={() => handleDecline(req.id)}
                      >
                        Decline
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ResearchRequests;
