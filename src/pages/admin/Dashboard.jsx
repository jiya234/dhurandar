import React from "react";
import "./Dashboard.css"; // apna CSS import karo

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h1 className="page-title">Admin Dashboard</h1>
      <div className="stats-container">
        <div className="stat-card">
          <h2>Total Users</h2>
          <p>120</p>
        </div>
        <div className="stat-card">
          <h2>Active Research</h2>
          <p>15</p>
        </div>
        <div className="stat-card">
          <h2>Pending Requests</h2>
          <p>8</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
