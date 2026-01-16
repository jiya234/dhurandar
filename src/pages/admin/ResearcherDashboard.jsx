import React, { useState } from "react";
import {
  UploadCloud,
  CheckCircle,
  Clock,
  XCircle
} from "lucide-react";
import "./ResearcherDashboard.css";

const ResearcherDashboard = () => {
  const [file, setFile] = useState(null);

  const approvedCount = 12;
  const pendingCount = 4;
  const rejectedCount = 2;

  return (
    <div className="researcher-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="brand-logo">AgriSmart</div>
        <nav className="header-nav">
          <a className="active">Dashboard</a>
          <a>Map</a>
          <a>Logout</a>
        </nav>
      </header>

      {/* Content */}
      <main className="dashboard-content">
        <div className="welcome-header">
          <h2>Welcome Researcher 👋</h2>
          <p>Upload datasets and track AI moderation results</p>
        </div>

        {/* Top Grid */}
        <div className="dashboard-grid-top">
          {/* Upload Card */}
          <div className="dashboard-card">
            <h3>Upload Dataset</h3>

            <form className="upload-form">
              <label>Dataset Name</label>
              <input type="text" placeholder="Enter dataset name" />

              <label>Dataset File</label>
              <div className="file-drop">
                <UploadCloud size={20} />
                <span>Click to upload or drag & drop</span>
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  accept=".csv,.xls,.xlsx,.json"
                />
              </div>

              <button className="btn-upload">Upload Dataset</button>
            </form>
          </div>

          {/* Analytics Card */}
          <div className="dashboard-card">
            <h3>Moderation Summary</h3>

            <div className="analytics-summary">
              <div className="analytics-row approved">
                <CheckCircle size={18} />
                <span>Approved</span>
                <strong>{approvedCount}</strong>
              </div>

              <div className="analytics-row pending">
                <Clock size={18} />
                <span>Pending</span>
                <strong>{pendingCount}</strong>
              </div>

              <div className="analytics-row rejected">
                <XCircle size={18} />
                <span>Rejected</span>
                <strong>{rejectedCount}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="dashboard-card datasets-card">
          <h3>Uploaded Datasets</h3>

          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Soil Data 2024</td>
                <td>12 Jan 2026</td>
                <td>
                  <span className="status-badge status-approved">
                    Approved
                  </span>
                </td>
              </tr>

              <tr>
                <td>Crop Yield</td>
                <td>14 Jan 2026</td>
                <td>
                  <span className="status-badge status-pending">
                    Pending
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default ResearcherDashboard;
