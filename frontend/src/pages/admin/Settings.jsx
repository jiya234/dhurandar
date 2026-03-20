import React, { useState } from "react";
import "./Settings.css";

const Settings = () => {
  const [systemMode, setSystemMode] = useState("Production");
  const [approvalRequired, setApprovalRequired] = useState(true);
  const [notifications, setNotifications] = useState(true);

  const handleSave = () => {
    alert("Settings saved successfully ✅");
  };

  return (
    <div className="settings-page">
      <h1>Admin Settings</h1>
      <p className="subtitle">Configure system level preferences</p>

      {/* SYSTEM SETTINGS */}
      <div className="settings-section">
        <h3>System Configuration</h3>

        <div className="setting-item">
          <label>System Mode</label>
          <select
            value={systemMode}
            onChange={(e) => setSystemMode(e.target.value)}
          >
            <option>Production</option>
            <option>Maintenance</option>
            <option>Testing</option>
          </select>
        </div>

        <div className="setting-item">
          <label>Dataset Approval Required</label>
          <select
            value={approvalRequired ? "Yes" : "No"}
            onChange={(e) => setApprovalRequired(e.target.value === "Yes")}
          >
            <option>Yes</option>
            <option>No</option>
          </select>
        </div>
      </div>

      {/* NOTIFICATIONS */}
      <div className="settings-section">
        <h3>Notifications</h3>

        <div className="setting-toggle">
          <span>Email Notifications</span>
          <input
            type="checkbox"
            checked={notifications}
            onChange={() => setNotifications(!notifications)}
          />
        </div>
      </div>

      {/* SAVE */}
      <button className="save-btn" onClick={handleSave}>
        Save Changes
      </button>
    </div>
  );
};

export default Settings;
