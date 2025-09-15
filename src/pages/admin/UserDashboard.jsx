// src/pages/admin/UserDashboard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const UserDashboard = () => {
  const navigate = useNavigate();

  return (
    <div style={{ width: "90%", margin: "20px auto" }}>
      {/* Navbar */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          padding: "10px",
          borderBottom: "1px solid #ccc",
        }}
      >
        <h1>🌱 AgriSmart User Dashboard</h1>
        <div>
          <button
            onClick={() => alert("Profile clicked")}
            style={{ marginRight: "10px" }}
          >
            Profile
          </button>
          <button onClick={() => navigate("/login")}>Logout</button>
        </div>
      </nav>

      {/* Map */}
      <MapContainer
        center={[28.6139, 77.209]}
        zoom={5}
        style={{ height: "400px", width: "100%", marginBottom: "20px" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <Marker position={[28.6139, 77.209]}>
          <Popup>Delhi</Popup>
        </Marker>
      </MapContainer>

      {/* Dashboard actions */}
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        <button onClick={() => alert("Check Weather")}>Check Weather</button>
        <button onClick={() => alert("Crop Recommendations")}>
          Crop Recommendations
        </button>
        <button onClick={() => alert("Market Prices")}>Market Prices</button>
      </div>
    </div>
  );
};

export default UserDashboard;
