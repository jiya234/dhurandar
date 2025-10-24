// src/pages/admin/ResearcherDashboard.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ResearcherDashboard.css";

// Map ke imports
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Icons ke imports
import {
  Bell,
  LogOut,
  Edit2,
  ChevronDown,
  UploadCloud,
  MapPin,
  FileText,
  Search,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

// --- Leaflet icon fix (File ke top par) ---
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});
// ----------------------------------------

// Initial data
const initialDatasets = [
  { name: "Rice Crop Yield 2024", region: "Punjab, India", date: "Jan 15, 2025", status: "Approved" },
  { name: "Wheat Disease Detection", region: "Haryana, India", date: "Jan 18, 2025", status: "Pending" },
  { name: "Cotton Water Usage", region: "Gujarat, India", date: "Jan 20, 2025", status: "Approved" },
];

// Status Badge component (isi file mein)
const StatusBadge = ({ status }) => {
  const statusConfig = {
    Approved: { icon: <CheckCircle size={16} />, className: "status-approved" },
    Pending: { icon: <Clock size={16} />, className: "status-pending" },
    Rejected: { icon: <XCircle size={16} />, className: "status-rejected" },
  };
  const config = statusConfig[status] || statusConfig.Pending;
  return (
    <span className={`status-badge ${config.className}`}>
      {config.icon}
      {status}
    </span>
  );
};


const ResearcherDashboard = () => {
  const navigate = useNavigate();
  
  // ----- YAHAN DEKHEIN: View switch karne ke lie state -----
  const [currentView, setCurrentView] = useState("home"); // 'home' ya 'map'

  // Dashboard state
  const [datasetName, setDatasetName] = useState("");
  const [region, setRegion] = useState("");
  const [file, setFile] = useState(null);
  const [datasets, setDatasets] = useState(initialDatasets);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("role");
    navigate("/");
  };

  // Dataset Upload
  const handleUpload = (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file.");
    
    const newDataset = {
      name: datasetName,
      region: region,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      status: "Pending",
    };
    setDatasets([newDataset, ...datasets]);
    alert("Dataset submitted for approval!");
    
    setDatasetName("");
    setRegion("");
    setFile(null);
    document.getElementById("datasetFile").value = null;
  };

  // Analytics stats
  const approvedCount = datasets.filter(d => d.status === 'Approved').length;
  const pendingCount = datasets.filter(d => d.status === 'Pending').length;
  const rejectedCount = datasets.filter(d => d.status === 'Rejected').length;

  // --- Render Functions ---

  // 1. Dashboard Home Content
  const renderHomeView = () => (
    <>
      <div className="welcome-header">
        <h2>Welcome back, Dr. Chen 👋</h2>
        <p>Manage your agricultural research datasets and track approval status</p>
      </div>

      <div className="dashboard-grid-top">
        {/* Upload Card */}
        <div className="dashboard-card upload-card">
          <h3><UploadCloud size={20} /> Upload New Dataset</h3>
          <p>Add agricultural research data for AI analysis</p>
          <form onSubmit={handleUpload} className="upload-form">
            <div className="form-group">
                <label htmlFor="datasetName">Dataset Name</label>
                <input type="text" id="datasetName" value={datasetName} onChange={(e) => setDatasetName(e.target.value)} placeholder="e.g., Rice Crop Yield 2025" required />
            </div>
            <div className="form-group">
                <label htmlFor="region">Region</label>
                <input type="text" id="region" value={region} onChange={(e) => setRegion(e.target.value)} placeholder="e.g., Punjab, India" required />
            </div>
            <div className="form-group">
                <label htmlFor="datasetFile">Dataset File (CSV, Excel, JSON)</label>
                <input type="file" id="datasetFile" onChange={(e) => setFile(e.target.files[0])} accept=".csv, .xls, .xlsx, .json" required />
            </div>
            <button type="submit" className="btn-upload"> <UploadCloud size={18} /> Upload Dataset </button>
          </form>
        </div>

        {/* Analytics Card */}
        <div className="dashboard-card analytics-card">
          <h3><MapPin size={20} /> Regional Analytics</h3>
          <p>Dataset locations and crop distribution</p>
          <div className="analytics-summary">
            <div className="summary-item summary-approved"> <CheckCircle size={24} /> <div className="summary-text"> <span>Approved</span> <strong>{approvedCount} Datasets</strong> </div> </div>
            <div className="summary-item summary-pending"> <Clock size={24} /> <div className="summary-text"> <span>Pending Review</span> <strong>{pendingCount} Datasets</strong> </div> </div>
            <div className="summary-item summary-rejected"> <XCircle size={24} /> <div className="summary-text"> <span>Rejected</span> <strong>{rejectedCount} Datasets</strong> </div> </div>
          </div>
        </div>
      </div>

      {/* Datasets Table */}
      <div className="dashboard-card full-width datasets-card">
        <div className="datasets-header">
            <h3><FileText size={20} /> My Datasets</h3>
            <div className="search-wrapper"> <Search size={18} /> <input type="text" placeholder="Search datasets..." /> </div>
        </div>
        <p>Previously uploaded research datasets</p>
        <div className="table-wrapper">
            <table>
                <thead> <tr> <th>Dataset Name</th> <th>Region</th> <th>Upload Date</th> <th>Status</th> </tr> </thead>
                <tbody>
                    {datasets.map((dataset, index) => (
                        <tr key={index}>
                            <td>{dataset.name}</td>
                            <td>{dataset.region}</td>
                            <td>{dataset.date}</td>
                            <td> <StatusBadge status={dataset.status} /> </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </>
  );

  // 2. Map View Content
  const renderMapView = () => (
    <div className="dashboard-card full-width map-view-card"> 
      <h2>Map View</h2>
      <p>Aggregated data points from approved datasets.</p>
      
      <MapContainer
        center={[28.6139, 77.209]}
        zoom={5}
        style={{ height: "60vh", width: "100%", borderRadius: "8px" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <Marker position={[28.6139, 77.209]}> <Popup>Delhi</Popup> </Marker>
        <Marker position={[19.0760, 72.8777]}> <Popup>Mumbai</Popup> </Marker>
        <Marker position={[22.5726, 88.3639]}> <Popup>Kolkata</Popup> </Marker>
      </MapContainer>
    </div>
  );

  // --- Final Return ---
  return (
    <div className="researcher-dashboard">
      {/* ----- Header / Navbar ----- */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1 className="brand-logo">🌱 AgriSmart</h1>
          <nav className="header-nav">
            {/* ----- YAHAN DEKHEIN: NavLink ko <a> tag se badal diya ----- */}
            <a
              href="#home"
              className={currentView === "home" ? "nav-link active" : "nav-link"}
              onClick={(e) => {
                e.preventDefault();
                setCurrentView("home");
              }}
            >
              Home
            </a>
            <a
              href="#map"
              className={currentView === "map" ? "nav-link active" : "nav-link"}
              onClick={(e) => {
                e.preventDefault();
                setCurrentView("map");
              }}
            >
              Map View
            </a>
          </nav>
        </div>
        <div className="header-right">
          <button className="icon-btn notification-btn">
            <Bell size={20} />
            <span className="notification-dot">3</span>
          </button>
          <div className="user-menu">
            <button className="user-dropdown-btn">
              <span className="user-avatar">SC</span>
              Researcher
              <ChevronDown size={16} />
            </button>
            <div className="user-dropdown-content">
              <div className="user-info">
                <strong>Dr. Sarah Chen</strong>
                <small>sarah.chen@agrismart.com</small>
              </div>
              <a href="#edit-profile" className="dropdown-link">
                <Edit2 size={14} /> Edit Profile
              </a>
              <button onClick={handleLogout} className="dropdown-link logout-btn">
                <LogOut size={14} /> Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ----- Main Content (Conditional Rendering) ----- */}
      <main className="dashboard-content">
        {/* ----- YAHAN DEKHEIN: View ke hisab se content render hoga ----- */}
        {currentView === "home" ? renderHomeView() : renderMapView()}
      </main>
    </div>
  );
};

export default ResearcherDashboard;