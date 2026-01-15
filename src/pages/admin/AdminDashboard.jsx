import React from "react";
import { Outlet } from "react-router-dom";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  return (
    <div className="layout">

      {/* MAIN */}
      <div className="content">
        <header className="topbar">
          <div>
            <h2>Admin Dashboard</h2>
            <p>System overview & controls</p>
          </div>

          <div className="avatar">
            <img src="https://i.pravatar.cc/40" alt="admin" />
          </div>
        </header>

        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard;
