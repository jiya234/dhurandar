import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

/* Fix leaflet icons */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

/* Click handler */
const LocationPicker = ({ onSelect }) => {
  useMapEvents({
    click(e) {
      onSelect(e.latlng);
    },
  });
  return null;
};

const GuestDashboard = () => {
  const [location, setLocation] = useState(null);

  const recommendation = location
    ? {
        crops: "Wheat, Mustard, Chickpea",
        confidence: "High",
        reason: "Based on soil + climate + public research data",
      }
    : null;

  return (
    <div style={{ minHeight: "100vh", background: "#F4F7F6" }}>
      {/* HEADER */}
      <div
        style={{
          height: "64px",
          background: "#1F4037",
          color: "white",
          display: "flex",
          alignItems: "center",
          padding: "0 32px",
          fontSize: "18px",
          fontWeight: "600",
        }}
      >
        🌱 AgriSmart — Guest View
      </div>

      {/* MAIN LAYOUT */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2.2fr 1fr",
          gap: "24px",
          padding: "24px 32px",
        }}
      >
        {/* MAP */}
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
            <LocationPicker onSelect={setLocation} />

            {location && (
              <Marker position={location}>
                <Popup>
                  {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                </Popup>
              </Marker>
            )}
          </MapContainer>

          <div
            style={{
              marginTop: "10px",
              padding: "10px 14px",
              background: "#FFFFFF",
              borderRadius: "10px",
              border: "1px solid #E5E7EB",
              fontSize: "13px",
              color: "#4B5563",
            }}
          >
            📍 Click anywhere on the map to get crop suggestions.
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div
          style={{
            background: "white",
            borderRadius: "12px",
            border: "1px solid #D1D5DB",
            padding: "22px",
          }}
        >
          {!location && (
            <>
              <h3 style={{ color: "#1F4037" }}>Select a Location</h3>
              <p style={{ color: "#6B7280", fontSize: "14px" }}>
                Guests can view public crop recommendations based on map
                location.
              </p>
            </>
          )}

          {location && recommendation && (
            <>
              <h3 style={{ color: "#1F4037" }}>🌾 Crop Recommendation</h3>
              <p>
                <strong>Crops:</strong> {recommendation.crops}
              </p>
              <p>
                <strong>Confidence:</strong> {recommendation.confidence}
              </p>
              <p>
                <strong>Based On:</strong> {recommendation.reason}
              </p>

              <div
                style={{
                  marginTop: "14px",
                  padding: "14px",
                  background: "#F0F7F4",
                  borderRadius: "10px",
                  border: "1px solid #CFE3DB",
                  fontSize: "13px",
                }}
              >
                🌱 This is public research data.  
                Log in for personalized and admin-approved insights.
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuestDashboard;
