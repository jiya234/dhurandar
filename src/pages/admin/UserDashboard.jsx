import React, { useState } from "react";
import { Rectangle } from "react-leaflet";
import { useEffect } from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

/* 🔧 Leaflet marker fix */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

/* 📍 Map click handler */
const LocationPicker = ({ onSelect }) => {
  useMapEvents({
    click(e) {
      onSelect(e.latlng);
    },
  });
  return null;
};
const Legend = ({ color, text }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "10px",
      marginBottom: "6px",
      fontSize: "13px",
      color: "#374151",
    }}
  >
    <div
      style={{
        width: "14px",
        height: "14px",
        borderRadius: "4px",
        background: color,
      }}
    />
    {text}
  </div>
);
const Info = ({ label, value }) => (
  <div>
    <p
      style={{
        fontSize: "13px",
        color: "#6B7280",
        marginBottom: "2px",
      }}
    >
      {label}
    </p>
    <p
      style={{
        fontSize: "14px",
        color: "#111827",
        fontWeight: "500",
      }}
    >
      {value}
    </p>
  </div>
);
const SettingRow = ({ label, value }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      padding: "14px 0",
      borderBottom: "1px solid #F1F5F9",
      fontSize: "14px",
    }}
  >
    <span style={{ color: "#374151" }}>{label}</span>
    <span style={{ color: "#111827", fontWeight: "500" }}>{value}</span>
  </div>
);



const AgriSmartDashboard = () => {
  const navigate = useNavigate();

  const [location, setLocation] = useState(null);
  const [soilData, setSoilData] = useState([]);
  const [nutrient, setNutrient] = useState("N");
 useEffect(() => {
  fetch("/soil_data.json")
    .then(res => res.json())
    .then(data => setSoilData(data.Sheet1));
}, []);

  const [activeTab, setActiveTab] = useState("dashboard"); // dashboard | profile | settings
   // ✅ Small reusable info box (MUST be above export default)

  /* 🔮 Temporary ML output */
  const recommendation = location
    ? {
        crops: "Wheat, Mustard, Chickpea",
        confidence: "High",
        reason:
          "Soil NPK + pH + Kasganj rainfall + Admin approved research data",
      }
    : null;
      const getColor = (value, nutrient) => {
  if (nutrient === "N") {
    if (value < 150) return "#ef4444";   // red
    if (value < 250) return "#facc15";   // yellow
    return "#22c55e";                    // green
  }

  if (nutrient === "P") {
    if (value < 10) return "#ef4444";
    if (value < 25) return "#facc15";
    return "#22c55e";
  }

  if (nutrient === "K") {
    if (value < 100) return "#ef4444";
    if (value < 200) return "#facc15";
    return "#22c55e";
  }

  if (nutrient === "pH") {
    if (value < 6) return "#60a5fa";    // acidic
    if (value < 7.5) return "#22c55e";  // neutral
    return "#f97316";                  // alkaline
  }
};

  return (
    <div style={{ minHeight: "100vh", background: "#F4F7F6" }}>
      {/* 🔝 NAVBAR */}
      <nav
        style={{
          height: "64px",
          background: "#1F4037",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 32px",
        }}
      >
        <h2 style={{ margin: 0 }}>AgriSmart</h2>

        <div style={{ display: "flex", gap: "28px" }}>
          <span
            style={navItem(activeTab === "dashboard")}
            onClick={() => setActiveTab("dashboard")}
          >
            Dashboard
          </span>
          <span
            style={navItem(activeTab === "profile")}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </span>
          <span
            style={navItem(activeTab === "settings")}
            onClick={() => setActiveTab("settings")}
          >
            Settings
          </span>
          <span
            style={{ cursor: "pointer", color: "#FCA5A5" }}
            onClick={() => navigate("/login")}
          >
            Logout
          </span>
        </div>
      </nav>

      {/* ================= DASHBOARD ================= */}
     {activeTab === "dashboard" && (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "2.2fr 1fr",
      gap: "24px",
      padding: "24px 32px",
    }}
  >
    {/* LEFT – MAP */}
    <div>
    

      <MapContainer
        center={[27.8083, 78.6458]}
        zoom={11}
        style={{
          height: "520px",
          borderRadius: "12px",
          border: "1px solid #D1D5DB",
        }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {Array.isArray(soilData) &&
          soilData.map((cell, idx) => {
            const size = 0.001;

            const key =
              nutrient === "N"
                ? "n"
                : nutrient === "P"
                ? "p"
                : nutrient === "K"
                ? "k"
                : "pH";

            const value = cell[key];
            const color = getColor(value, nutrient);

            return (
              <Rectangle
                key={idx}
                bounds={[
                  [cell.Latitude - size, cell.Longitude - size],
                  [cell.Latitude + size, cell.Longitude + size],
                ]}
                pathOptions={{
                  color,
                  fillColor: color,
                  fillOpacity: 0.45,
                  weight: 1,
                }}
              />
            );
          })}

        <LocationPicker onSelect={(latlng) => setLocation(latlng)} />

        {location && (
          <Marker position={location}>
            <Popup>
              <strong>Selected Location</strong>
              <br />
              {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>

   {/* RIGHT PANEL */}
<div
  style={{
    background: "white",
    borderRadius: "12px",
    border: "1px solid #D1D5DB",
    padding: "16px",
    display: "grid",
    gridTemplateRows: "1fr auto",
    height: "520px",
    gap: "16px",
  }}
>
  {/* TOP – Recommendation area */}
  <div style={{ overflowY: "auto", paddingRight: "6px" }}>
    {!location && (
      <>
        <h3 style={{ color: "#1F4037" }}>Select a location</h3>
        <p style={mutedText}>
          Click on the map to get crop and soil insights.
        </p>
      </>
    )}

    {location && (
      <>
        <h3 style={{ color: "#1F4037" }}>🌾 Crop Recommendation</h3>
        <p><strong>Crops:</strong> Wheat, Mustard, Chickpea</p>
        <p><strong>Confidence:</strong> High</p>
        <p><strong>Based on:</strong> Soil + Rainfall + Research Data</p>

        <div
          style={{
            marginTop: "12px",
            background: "#F0F7F4",
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid #CFE3DB",
          }}
        >
          <h4 style={{ color: "#1F4037" }}>🌱 Soil & Region</h4>
          <p style={smallText}>Kasganj, Uttar Pradesh</p>
          <p style={smallText}>Loamy to Sandy soil</p>
          <p style={smallText}>Moderate rainfall</p>
        </div>
      </>
    )}
  </div>

  {/* BOTTOM – Soil Mapping (always visible) */}
  <div
    style={{
      background: "#F9FAFB",
      padding: "12px",
      borderRadius: "10px",
      border: "1px solid #E5E7EB",
    }}
  >
   
    <h4 style={{ color: "#1F4037", marginBottom: "8px" }}>
      🧪 Soil {nutrient} Levels
    </h4>

    {nutrient === "pH" ? (
      <>
        <Legend color="#60a5fa" text="Acidic (< 6)" />
        <Legend color="#22c55e" text="Neutral (6 – 7.5)" />
        <Legend color="#f97316" text="Alkaline (> 7.5)" />
      </>
    ) : (
      <>
        <Legend color="#ef4444" text="Low" />
        <Legend color="#facc15" text="Medium" />
        <Legend color="#22c55e" text="High" />
      </>
    )}
  </div>

   <select
  value={nutrient}
  onChange={(e) => setNutrient(e.target.value)}
  style={{
    width: "100%",
    maxWidth: "260px",
    padding: "10px 14px",
    borderRadius: "12px",
    border: "1px solid #D1D5DB",
    background: "linear-gradient(135deg, #ffffff, #f9fafb)",
    fontSize: "14px",
    fontWeight: "500",
    color: "#1F2937",
    cursor: "pointer",
    outline: "none",
    boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
    transition: "all 0.25s ease",
    appearance: "none",
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg fill='none' stroke='%231f2937' stroke-width='2' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M19 9l-7 7-7-7'/%3E%3C/svg%3E\")",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 14px center",
    backgroundSize: "16px",
  }}
>
  <option value="N">Nitrogen</option>
  <option value="P">Phosphorus</option>
  <option value="K">Potassium</option>
  <option value="pH">Soil pH</option>
</select>
</div>

   
      
    </div>
)}


   {/* ================= SETTINGS ================= */}
{activeTab === "settings" && (
  <div
    style={{
      maxWidth: "1000px",
      margin: "40px auto",
      display: "grid",
      gridTemplateColumns: "2.5fr 1fr",
      gap: "32px",
    }}
  >
    {/* LEFT CARD */}
    <div
      style={{
        background: "#ffffff",
        borderRadius: "16px",
        padding: "32px",
        border: "1px solid #E5E7EB",
      }}
    >
      <h2 style={{ marginBottom: "6px" }}>⚙️ Account Settings</h2>
      <p style={mutedText}>
        Manage your personal information and account preferences.
      </p>

      {/* BASIC INFO */}
      <h4 style={{ marginTop: "28px", marginBottom: "14px" }}>
        Basic Information
      </h4>

      <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
        <img
          src="https://i.pravatar.cc/150?img=3"
          alt="profile"
          style={{
            width: "90px",
            height: "90px",
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
        <div>
          <button
            style={{
              padding: "6px 12px",
              borderRadius: "8px",
              border: "1px solid #A7F3D0",
              background: "#ECFDF5",
              color: "#065F46",
              cursor: "pointer",
            }}
          >
            Upload new picture
          </button>
          <p
            style={{
              marginTop: "6px",
              fontSize: "13px",
              color: "#EF4444",
              cursor: "pointer",
            }}
          >
            Remove
          </p>
        </div>
      </div>

      {/* FIELDS */}
      <div style={{ marginTop: "24px" }}>
        <SettingRow label="Name" value="Ramu Rathore" />
        <SettingRow label="Date of Birth" value="18 June 2004" />
        <SettingRow label="Gender" value="Male" />
        <SettingRow label="Email" value="Ramu@agrismart.ai" />
      </div>

      {/* ACCOUNT INFO */}
      <h4 style={{ marginTop: "28px", marginBottom: "14px" }}>
        Account Information
      </h4>

      <SettingRow label="Username" value="ramu_agrismart" />
      <SettingRow label="Password" value="********" />
    </div>

    {/* RIGHT GUIDE */}
    <div
      style={{
        background: "linear-gradient(135deg, #DCFCE7, #ECFEFF)",
        borderRadius: "16px",
        padding: "24px",
        border: "1px solid #BBF7D0",
        height: "fit-content",
      }}
    >
      <h4 style={{ marginBottom: "8px", color: "#065F46" }}>
        Guide to setup your account
      </h4>
      <p style={{ fontSize: "14px", lineHeight: "1.6", color: "#064E3B" }}>
        Keeping your profile updated helps AgriSmart generate accurate crop
        recommendations using soil health cards, weather data, and
        admin-validated research datasets.
      </p>
    </div>
  </div>
)}


      {/* 🔻 FOOTER */}
      <footer
        style={{
          marginTop: "30px",
          padding: "18px",
          textAlign: "center",
          fontSize: "13px",
          color: "#6B7280",
          background: "#FFFFFF",
          borderTop: "1px solid #E5E7EB",
        }}
      >
        🌱 AgriSmart — AI-Driven Crop Recommendation System
        <br />
        Powered by Soil Health Data • Researcher Contributions • Admin Validation
      </footer>
    </div>
  );
};

/* 🎨 Styles */
const navItem = (active) => ({
  cursor: "pointer",
  fontSize: "15px",
  paddingBottom: "4px",
  borderBottom: active ? "2px solid #A7F3D0" : "2px solid transparent",
});

const mutedText = {
  color: "#6B7280",
  fontSize: "14px",
};

const smallText = {
  fontSize: "13px",
  color: "#374151",
};


export default AgriSmartDashboard;
