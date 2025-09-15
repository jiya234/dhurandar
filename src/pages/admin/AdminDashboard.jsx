import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>AgriSmart Admin</h2>
        <NavLink to="/admin/dashboard" end className={({ isActive }) => (isActive ? "active-link" : "")}>
          Dashboard
        </NavLink>
        <NavLink to="/admin/dashboard/users" className={({ isActive }) => (isActive ? "active-link" : "")}>
          Users
        </NavLink>
        <NavLink to="/admin/dashboard/requests" className={({ isActive }) => (isActive ? "active-link" : "")}>
          Research Requests
        </NavLink>
        <NavLink to="/admin/dashboard/settings" className={({ isActive }) => (isActive ? "active-link" : "")}>
          Settings
        </NavLink>
      </aside>

      {/* Main Content */}
      <main className="main">
        <Outlet /> {/* yahan nested routes ka content render hoga */}
      </main>
    </div>
  );
};

export default AdminDashboard;
