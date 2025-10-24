import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// 🛠 Fix Leaflet default marker issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// 📍 Component to handle map clicks
const LocationMarker = ({ setLocation }) => {
  useMapEvents({
    click(e) {
      setLocation(e.latlng); // update state with clicked coordinates
    },
  });
  return null;
};

const UserDashboard = () => {
  const navigate = useNavigate();
  const [popupData, setPopupData] = useState(null);
  const [location, setLocation] = useState(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (popupData && markerRef.current) {
      markerRef.current.openPopup();
    }
  }, [popupData]);

  // 🌦 Button actions
  const handleWeather = () => {
    if (!location)
      return alert("📍 Please select a location on the map first!");
    setPopupData({
      title: "☁️ Weather Update",
      content: `At (${location.lat.toFixed(2)}, ${location.lng.toFixed(
        2
      )}): 30°C | Humidity 65% | Clear Sky`,
    });
  };

  const handleCropRecommendation = () => {
    if (!location)
      return alert("📍 Please select a location on the map first!");
    setPopupData({
      title: "🌾 Crop Recommendation",
      content: `Based on this region (${location.lat.toFixed(
        2
      )}, ${location.lng.toFixed(2)}): Grow Rice and Maize this season.`,
    });
  };

  const handleMarketPrices = () => {
    if (!location)
      return alert("📍 Please select a location on the map first!");
    setPopupData({
      title: "💰 Market Prices",
      content: `Wheat: ₹2400/quintal | Rice: ₹2800/quintal | Maize: ₹2200/quintal`,
    });
  };

  return (
    <div
      style={{
        width: "90%",
        margin: "20px auto",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      {/* 🌱 Navbar */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          padding: "15px 25px",
          borderBottom: "2px solid #e0e0e0",
          background: "#f6fff9",
          borderRadius: "10px",
        }}
      >
        <h1 style={{ color: "#2f855a" }}>🌱 AgriSmart User Dashboard</h1>
        <div>
          <button
            onClick={() => alert("Profile clicked")}
            style={{
              marginRight: "10px",
              padding: "8px 14px",
              border: "none",
              borderRadius: "8px",
              background: "#2f855a",
              color: "white",
              cursor: "pointer",
            }}
          >
            Profile
          </button>
          <button
            onClick={() => navigate("/login")}
            style={{
              padding: "8px 14px",
              border: "none",
              borderRadius: "8px",
              background: "#e53e3e",
              color: "white",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* 🗺️ Map */}
      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        style={{
          height: "450px",
          width: "100%",
          borderRadius: "12px",
          marginBottom: "25px",
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        />
        <LocationMarker setLocation={setLocation} />
        {location && (
          <Marker ref={markerRef} position={location}>
            <Popup>
              {popupData ? (
                <div>
                  <h4>{popupData.title}</h4>
                  <p>{popupData.content}</p>
                </div>
              ) : (
                <p>
                  You selected: <br /> ({location.lat.toFixed(2)},{" "}
                  {location.lng.toFixed(2)})
                </p>
              )}
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* 🔘 Buttons */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <button
          onClick={handleWeather}
          style={{
            padding: "12px 20px",
            border: "none",
            borderRadius: "10px",
            background: "#63b3ed",
            color: "white",
            fontSize: "16px",
            cursor: "pointer",
            minWidth: "180px",
          }}
        >
          🌦 Check Weather
        </button>

        <button
          onClick={handleCropRecommendation}
          style={{
            padding: "12px 20px",
            border: "none",
            borderRadius: "10px",
            background: "#48bb78",
            color: "white",
            fontSize: "16px",
            cursor: "pointer",
            minWidth: "180px",
          }}
        >
          🌾 Crop Recommendations
        </button>

        <button
          onClick={handleMarketPrices}
          style={{
            padding: "12px 20px",
            border: "none",
            borderRadius: "10px",
            background: "#ed8936",
            color: "white",
            fontSize: "16px",
            cursor: "pointer",
            minWidth: "180px",
          }}
        >
          💰 Market Prices
        </button>
      </div>
    </div>
  );
};

export default UserDashboard;
