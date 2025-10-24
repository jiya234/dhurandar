import React, { useState } from "react";
import "./Settings.css";

const Settings = () => {
  const [email, setEmail] = useState("admin@agrismart.com");

  const handleSave = () => {
    alert("Settings saved!");
  };

  const admins = [
    {
      id: 1,
      name: "Admin User",
      email: "admin@agrismart.com",
      role: "Super Admin",
      added: "2024-01-01",
    },
    {
      id: 2,
      name: "John Manager",
      email: "john.manager@agrismart.com",
      role: "Admin",
      added: "2024-05-12",
    },
  ];

  return (
    <div className="settings-page">
      <h1 className="page-title">Admin Settings</h1>

      {/* General Settings */}
      <div className="settings-card">
        <label>
          <span>Admin Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <button onClick={handleSave}>Save</button>
      </div>

      {/* Admin Management Section */}
      <div className="admin-management">
        <h2>👤 Admin Management</h2>
        <p className="subtitle">Add or remove system administrators</p>
        <button className="add-btn">+ Add Admin</button>

        <div className="admin-list">
          {admins.map((a) => (
            <div key={a.id} className="admin-card">
              <div className="admin-info">
                <h3>{a.name}</h3>
                <p>{a.email}</p>
                <span className="role">{a.role}</span>
              </div>
              <div className="admin-meta">Added: {a.added}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Settings;
