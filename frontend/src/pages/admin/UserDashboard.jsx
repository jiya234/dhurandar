import React, { useState, useEffect } from "react";
import CropSuggestionUI from "./CropSuggestionUI";
import SoilHealthUI from "./SoilHealthUI";
import Weather from "./Weather";
import { MapContainer, TileLayer, Marker, Popup, Rectangle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useMapEvents } from "react-leaflet";
import L from 'leaflet';
import {
  Cloud, Wind, Eye, Gauge, Map, Settings,
  LayoutDashboard, CloudRain, Wheat, Navigation, X, LogOut,
  Database, FileText, Download, Menu
} from "lucide-react";
import "./Users.css";

// Leaflet Icon Fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function UserDashboard() {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [inputLat, setInputLat] = useState("27.80");
  const [inputLng, setInputLng] = useState("78.65");
  const [researchData, setResearchData] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [user, setUser] = useState({ name: "", email: "", role: "" });

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/users/researchers/")
      .then(res => res.json())
      .then(data => setResearchData(data))
      .catch(err => console.error("Research fetch error:", err));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) window.location.href = "/login";
  }, []);

  const handleGenerate = async () => {
    try {
      setIsAnalyzing(true);
      let payload = {};

      if (inputLat && inputLng) {
        if (isNaN(inputLat) || isNaN(inputLng)) {
          alert("Please enter valid numeric latitude and longitude");
          return;
        }
        payload = {
          latitude: parseFloat(inputLat),
          longitude: parseFloat(inputLng)
        };
      } else {
        payload = {
          Nitrogen: Number(n),
          Phosphorus: Number(p),
          Potassium: Number(k),
          Ph: Number(ph)
        };
      }

      const res = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.error) { alert(data.error); return; }

      setRecommendations(data.recommendations);
      setWeather({
        temp: data.temperature,
        humidity: data.humidity,
        rainfall: data.rainfall,
        city: data.city
      });
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:8000/api/users/update_user/", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Token ${token}` },
        body: JSON.stringify({ full_name: settings.name, email: settings.email })
      });
      if (res.ok) {
        alert("Saved successfully!");
        setUser(prev => ({ ...prev, name: settings.name, email: settings.email }));
      } else {
        alert("Error saving ❌");
      }
    } catch (err) {
      console.error(err);
      alert("Server error ❌");
    }
    setIsSaving(false);
  };

  const [recommendations, setRecommendations] = useState([]);
  const [weather, setWeather] = useState(null);
  const [dashboardWeather, setDashboardWeather] = useState(null);
  const [activePage, setActivePage] = useState("dashboard");
  const [place, setPlace] = useState("");
  const [selectedSoil, setSelectedSoil] = useState(null);
  const [showSoilModal, setShowSoilModal] = useState(false);
  const [soilPrediction, setSoilPrediction] = useState([]);
  const [loadingPrediction, setLoadingPrediction] = useState(false);
  const [fields, setFields] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newField, setNewField] = useState({ name: "", crop: "", area: "", lat: "", lng: "" });
  const [soilData, setSoilData] = useState([]);
  const [nutrient, setNutrient] = useState("N");
  const [settings, setSettings] = useState({ name: "", email: "" });
  const [isSaving, setIsSaving] = useState(false);

  function MapClickHandler() {
    useMapEvents({
      click(e) {
        setInputLat(e.latlng.lat.toFixed(4));
        setInputLng(e.latlng.lng.toFixed(4));
      }
    });
    return null;
  }

  const getCurrentLocation = () => {
    if (!navigator.geolocation) { alert("Geolocation not supported"); return; }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setInputLat(position.coords.latitude.toFixed(4));
        setInputLng(position.coords.longitude.toFixed(4));
      },
      () => alert("Location access denied ❌")
    );
  };

  const handleSearchLocation = async () => {
    if (!place.trim()) { alert("Please enter a location"); return; }
    try {
      const res = await fetch(`http://127.0.0.1:5000/geocode?place=${place}`);
      const data = await res.json();
      if (data.error) { alert(data.error); return; }
      setInputLat(data.lat);
      setInputLng(data.lon);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!inputLat || !inputLng) return;
      fetch(`http://127.0.0.1:5000/weather?lat=${inputLat}&lon=${inputLng}`)
        .then(res => res.json())
        .then(data => setDashboardWeather({ temp: data.temperature, humidity: data.humidity, rainfall: data.rainfall }))
        .catch(err => console.error("Weather fetch error:", err));
    }, 800);
    return () => clearTimeout(timeout);
  }, [inputLat, inputLng]);

  const fetchFields = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://127.0.0.1:8000/api/users/fields/", {
      headers: { Authorization: `Token ${token}` }
    });
    const data = await res.json();
    setFields(data.map(f => ({
      id: f.id, name: f.field_name, crop: f.crop || "Fallow",
      area: f.area || "0", lat: parseFloat(f.lat), lng: parseFloat(f.lng), color: "green"
    })));
  };

  useEffect(() => { fetchFields(); }, []);

  useEffect(() => {
    fetch("/soil_data.json")
      .then(res => res.json())
      .then(data => setSoilData(data.Sheet1 || []))
      .catch(err => console.log("Soil Data Error:", err));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://127.0.0.1:8000/api/users/profile/", {
      headers: { Authorization: `Token ${token}` }
    })
      .then(res => { if (!res.ok) throw new Error(); return res.json(); })
      .then(data => {
        setUser({ name: data.full_name, email: data.email, role: data.role });
        setSettings({ name: data.full_name, email: data.email });
      })
      .catch(err => console.error("Profile fetch error:", err));
  }, []);

  const getColor = (value, type) => {
    if (type === "N") { if (value < 150) return "#ef4444"; if (value < 250) return "#facc15"; return "#22c55e"; }
    if (type === "P") { if (value < 10) return "#ef4444"; if (value < 25) return "#facc15"; return "#22c55e"; }
    if (type === "K") { if (value < 100) return "#ef4444"; if (value < 200) return "#facc15"; return "#22c55e"; }
    if (type === "pH") { if (value < 6) return "#60a5fa"; if (value < 7.5) return "#22c55e"; return "#f97316"; }
    return "#cccccc";
  };

  const handleAddField = async () => {
    const token = localStorage.getItem("token");
    if (!newField.name || !newField.lat || !newField.lng) return alert("Please fill all details");
    try {
      await fetch("http://127.0.0.1:8000/api/users/add-field/", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Token ${token}` },
        body: JSON.stringify({
          field_name: newField.name, crop: newField.crop,
          area: newField.area, lat: parseFloat(newField.lat), lng: parseFloat(newField.lng)
        })
      });
      fetchFields();
      setShowModal(false);
      setNewField({ name: "", crop: "", area: "", lat: "", lng: "" });
    } catch (err) { alert("Error saving field ❌"); }
  };

  const handleLogout = async () => {
    if (!window.confirm("Are you sure you want to logout?")) return;
    try {
      const res = await fetch("http://127.0.0.1:8000/api/users/logout/", {
        method: "POST", credentials: "include"
      });
      if (res.ok) {
        localStorage.removeItem("token");
        sessionStorage.clear();
        window.location.href = "/login";
      } else { alert("Logout failed ❌"); }
    } catch (err) { alert("Server error ❌"); }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map(w => w[0]).join("").toUpperCase();
  };

  // Navigate and close mobile sidebar
  const navigate = (page) => {
    setActivePage(page);
    setSidebarOpen(false);
  };

  return (
    <div className="app-container">

      {/* ── Hamburger (mobile only) ── */}
      <button className="hamburger" onClick={() => setSidebarOpen(o => !o)} aria-label="Menu">
        <Menu size={20} />
      </button>

      {/* ── Mobile backdrop ── */}
      <div
        className={`sidebar-backdrop ${sidebarOpen ? "visible" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* ── SIDEBAR ── */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="logo-section">
          <div className="logo-box"><CloudRain size={20} color="white" /></div>
          <span className="logo-text">AgriSmart</span>
        </div>

        <div className="profile-section">
          <div className="profile-avatar">{getInitials(user.name)}</div>
          <div className="profile-details">{user.name || "User"}</div>
          <div className="status-badge">● Active field</div>
        </div>

        <nav className="nav-menu">
          {[
            { id: "dashboard",      label: "Dashboard",      icon: <LayoutDashboard size={18} /> },
            { id: "weather",        label: "Weather",        icon: <Cloud size={18} /> },
            { id: "fieldMap",       label: "Field Map",      icon: <Map size={18} /> },
            { id: "cropSuggestions",label: "Crop Suggestions",icon: <Wheat size={18} /> },
            { id: "soilHealth",     label: "Soil Health",    icon: <Wheat size={18} /> },
            { id: "researcherData", label: "Researcher Data",icon: <Database size={18} /> },
            { id: "settings",       label: "Settings",       icon: <Settings size={18} /> },
          ].map(({ id, label, icon }) => (
            <div
              key={id}
              className={`nav-item ${activePage === id ? "active" : ""}`}
              onClick={() => navigate(id)}
              title={label}
            >
              {icon}
              <span>{label}</span>
            </div>
          ))}
        </nav>

        <div className="logout-section" onClick={handleLogout} title="Logout">
          <LogOut size={18} />
          <span>Logout</span>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="main-content">

        {/* 1. DASHBOARD */}
        {activePage === "dashboard" && (
          <div className="content-fade-in" key="dashboard">
            <header className="page-header">
              <h1>Welcome, {user.name} 👋</h1>
              <p>Here's what's happening with your fields today</p>
            </header>

            <div className="dashboard-grid">
              <div className="stat-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: "100%" }}>
                  <div>
                    <p style={{ fontSize: "11px", color: "#9ca3af", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>
                      {dashboardWeather ? "Live Weather" : "Loading..."}
                    </p>
                    <h2 style={{ fontSize: "30px", fontWeight: "700", color: "#111827", margin: "0 0 4px" }}>
                      {dashboardWeather ? `${dashboardWeather.temp}°C` : "--"}
                    </h2>
                    <p style={{ fontSize: "13px", color: "#4b5563" }}>
                      {dashboardWeather ? `Humidity: ${dashboardWeather.humidity}%` : ""}
                    </p>
                  </div>
                  <div style={{ fontSize: "44px", lineHeight: 1 }}>
                    {dashboardWeather?.rainfall > 20 ? "🌧️" : dashboardWeather?.temp > 30 ? "☀️" : "🌤️"}
                  </div>
                </div>
              </div>

              <div className="stat-card">
                <p style={{ fontSize: "11px", color: "#9ca3af", fontWeight: "600", marginBottom: "10px" }}>Enter Location</p>
                <input
                  type="text" placeholder="Enter city / village" value={place}
                  onChange={(e) => setPlace(e.target.value)}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #eee", marginBottom: "10px" }}
                />
                <div style={{ display: "flex", gap: "10px" }}>
                  <button onClick={handleSearchLocation}
                    style={{ flex: 1, padding: "10px", background: "#7da07d", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13px" }}>
                    🌍 Get Coordinates
                  </button>
                  <button onClick={getCurrentLocation}
                    style={{ flex: 1, padding: "10px", background: "#2563eb", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13px" }}>
                    📍 My Location
                  </button>
                </div>
              </div>
            </div>

            <div className="lower-grid">
              {/* Map Panel */}
              <div className="map-panel">
                <div className="panel-header" onClick={() => navigate("fieldMap")} style={{ cursor: "pointer" }}>
                  <h3>📍 Field Location</h3>
                  <Navigation size={16} style={{ transform: "rotate(45deg)" }} />
                </div>
                <div className="coord-inputs">
                  <div className="input-group">
                    <label>LATITUDE</label>
                    <input type="number" value={inputLat} onChange={(e) => setInputLat(e.target.value)} placeholder="Latitude" />
                  </div>
                  <div className="input-group">
                    <label>LONGITUDE</label>
                    <input type="number" value={inputLng} onChange={(e) => setInputLng(e.target.value)} placeholder="Longitude" />
                  </div>
                </div>
                <button className="generate-btn" onClick={handleGenerate} disabled={isAnalyzing}>
                  {isAnalyzing ? "🔄 Analyzing..." : "✨ Generate Recommendations"}
                </button>
                <div className="map-view" style={{ position: "relative" }}>
                  <div onClick={() => navigate("fieldMap")} style={{ position: "absolute", inset: 0, zIndex: 10, cursor: "pointer" }} />
                  <MapContainer center={[parseFloat(inputLat) || 27.80, parseFloat(inputLng) || 78.65]} zoom={13} scrollWheelZoom={false} zoomControl={false} style={{ height: "100%", width: "100%" }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap" />
                    <Marker position={[parseFloat(inputLat) || 27.80, parseFloat(inputLng) || 78.65]}><Popup>Selected Location</Popup></Marker>
                  </MapContainer>
                </div>
              </div>

              {/* Recommendations Panel */}
              <div className="recommendation-panel">
                <div className="panel-header">
                  <h3>🌾 Crop Recommendation</h3>
                  <span className="badge">High Confidence</span>
                </div>
                {isAnalyzing ? (
                  <div className="loading-state">
                    <div className="spinner" />
                    <p>AI is analyzing soil at {inputLat}, {inputLng}...</p>
                  </div>
                ) : (
                  <>
                    <div className="crop-list">
                      {recommendations.map((item, i) => (
                        <div key={i} className="crop-card">
                          <span className="crop-emoji">🌱</span>
                          <strong>{item.crop}</strong>
                          <p>{item.confidence}% confidence</p>
                        </div>
                      ))}
                    </div>
                    {weather && (
                      <div className="weather-info">
                        <p>📍 City: {weather.city}</p>
                        <p>🌡 Temp: {weather.temp}°C</p>
                        <p>💧 Humidity: {weather.humidity}%</p>
                        <p>🌧 Rainfall: {weather.rainfall} mm</p>
                      </div>
                    )}
                    <div className="why-crops">
                      <h4>Why these crops?</h4>
                      <ul>
                        <li>✅ Suitable for local soil type (alluvial)</li>
                        <li>✅ Compatible with regional rainfall patterns</li>
                      </ul>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 2. RESEARCHER DATA */}
        {activePage === "researcherData" && (
          <div className="content-fade-in" key="researcherData">
            <header className="page-header">
              <h1>Researcher Datasets</h1>
              <p className="subtitle-small">View all available agricultural datasets shared by researchers</p>
            </header>
            <div className="settings-container-layout">
              <div className="settings-card" style={{ padding: 0, overflow: "hidden" }}>
                <div className="card-title-row" style={{ padding: "24px 28px", borderBottom: "1px solid #f0f0f0" }}>
                  <div className="icon-box-light"><span>📊</span></div>
                  <div><h3>Available Datasets</h3><p>Access public research data and regional soil reports</p></div>
                </div>
                <div className="dataset-table-container" style={{ padding: "0 28px 28px" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                    <thead>
                      <tr style={{ borderBottom: "2px solid #f5f5f5", color: "#888", fontSize: "12px", textTransform: "uppercase" }}>
                        <th style={{ padding: "14px 0" }}>Date</th>
                        <th style={{ padding: "14px 0" }}>Researcher</th>
                        <th style={{ padding: "14px 0" }}>Dataset Title</th>
                        <th style={{ padding: "14px 0", textAlign: "right" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {researchData.length === 0 ? (
                        <tr><td colSpan="4" style={{ textAlign: "center", padding: "40px", color: "#888" }}>
                          <div style={{ fontSize: "22px", marginBottom: "8px" }}>📁</div>No datasets available.
                        </td></tr>
                      ) : (
                        researchData.map((item) => (
                          <tr key={item.id} className="table-row-hover" style={{ borderBottom: "1px solid #f9f9f9", fontSize: "14px" }}>
                            <td style={{ padding: "14px 0", color: "#666" }}>{item.date}</td>
                            <td style={{ padding: "14px 0", fontWeight: "600", color: "#374151" }}>{item.researcher_name || "Admin"}</td>
                            <td style={{ padding: "14px 0" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                                <FileText size={15} color="#7da07d" /><span>{item.name}</span>
                              </div>
                            </td>
                            <td style={{ padding: "14px 0", textAlign: "right" }}>
                              <a href={item.url} target="_blank" rel="noopener noreferrer" className="download-link-btn"
                                style={{ display: "inline-flex", alignItems: "center", gap: "5px", color: "#7da07d", fontWeight: "600", textDecoration: "none" }}>
                                <Download size={13} /> View Data
                              </a>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. WEATHER */}
        {activePage === "weather" && <div className="content-fade-in" key="weather"><Weather /></div>}

        {/* 4. FIELD MAP */}
        {activePage === "fieldMap" && (
          <div className="content-fade-in" key="fieldMap">
            <header className="page-header-flex">
              <div><h1>Field Map</h1><p>Soil Health Analysis & Field Management</p></div>
              <button className="add-field-btn" onClick={() => setShowModal(true)}>+ Add Field</button>
            </header>

            <div className="map-grid-layout">
              <div className="map-main-area">
                <div className="coord-bar">
                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    <div className="input-box"><label>LATITUDE</label><input type="text" value={inputLat} onChange={(e) => setInputLat(e.target.value)} /></div>
                    <div className="input-box"><label>LONGITUDE</label><input type="text" value={inputLng} onChange={(e) => setInputLng(e.target.value)} /></div>
                    <button onClick={getCurrentLocation} style={{ height: "38px", marginTop: "20px", padding: "0 12px", background: "#2563eb", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13px" }}>
                      📍 My Location
                    </button>
                  </div>
                  <div className="nutrient-select-box">
                    <label style={{ fontSize: "12px", color: "#6b7280" }}>Layer:</label>
                    <select value={nutrient} onChange={(e) => setNutrient(e.target.value)}>
                      <option value="N">Nitrogen (N)</option>
                      <option value="P">Phosphorus (P)</option>
                      <option value="K">Potassium (K)</option>
                      <option value="pH">Soil pH</option>
                    </select>
                  </div>
                </div>

                <div className="interactive-map-container">
                  <div style={{ position: "absolute", top: "14px", right: "14px", background: "#fff", padding: "7px 12px", borderRadius: "8px", fontSize: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", zIndex: 1000 }}>
                    Click map to select 📍
                  </div>

                  <MapContainer key={`${inputLat}-${inputLng}`} center={[parseFloat(inputLat) || 27.8083, parseFloat(inputLng) || 78.6458]} zoom={13} scrollWheelZoom={false} style={{ height: "100%", width: "100%", borderRadius: "20px" }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap" />
                    <MapClickHandler />
                    <Marker position={[parseFloat(inputLat), parseFloat(inputLng)]}><Popup>📍 Selected Location</Popup></Marker>

                    {soilData.map((cell, idx) => {
                      const size = 0.003;
                      const key = nutrient === "N" ? "n" : nutrient === "P" ? "p" : nutrient === "K" ? "k" : "pH";
                      const val = cell[key];
                      const color = getColor(val, nutrient);
                      if (!val) return null;
                      return (
                        <Rectangle key={idx}
                          bounds={[[cell.Latitude - size, cell.Longitude - size], [cell.Latitude + size, cell.Longitude + size]]}
                          pathOptions={{ color, fillColor: color, fillOpacity: 0.5, weight: 0 }}
                          eventHandlers={{
                            click: async () => {
                              const cd = { lat: cell.Latitude, lng: cell.Longitude, N: cell.n, P: cell.p, K: cell.k, ph: cell.pH };
                              setSelectedSoil(cd);
                              setShowSoilModal(true);
                              try {
                                setLoadingPrediction(true);
                                const wRes = await fetch(`http://127.0.0.1:5000/weather?lat=${cd.lat}&lon=${cd.lng}`);
                                const w = await wRes.json();
                                const pRes = await fetch("http://127.0.0.1:5000/predict", {
                                  method: "POST",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ Nitrogen: cd.N, Phosphorus: cd.P, Potassium: cd.K, Ph: cd.ph, temperature: w.temperature, humidity: w.humidity, rainfall: w.rainfall })
                                });
                                const pData = await pRes.json();
                                setSoilPrediction(pData.recommendations || []);
                              } catch (e) { console.error(e); } finally { setLoadingPrediction(false); }
                            }
                          }}>
                          <Popup><strong>Soil Data</strong><br />{nutrient}: {val}</Popup>
                        </Rectangle>
                      );
                    })}

                    {fields.map(f => (
                      <Marker key={f.id} position={[f.lat, f.lng]}><Popup><strong>{f.name}</strong><br />{f.crop}</Popup></Marker>
                    ))}
                    {fields.map(f => (
                      <Rectangle key={"r-" + f.id}
                        bounds={[[f.lat - 0.002, f.lng - 0.002], [f.lat + 0.002, f.lng + 0.002]]}
                        pathOptions={{ color: "#2563eb", fillOpacity: 0.1 }} />
                    ))}
                  </MapContainer>

                  {showSoilModal && selectedSoil && (
                    <div className="soil-modal-overlay">
                      <div className="soil-modal">
                        <h2 className="modal-title">🌱 Soil Insights</h2>
                        <div className="soil-grid">
                          <div className="soil-card n"><span>N</span><strong>{selectedSoil.N}</strong></div>
                          <div className="soil-card p"><span>P</span><strong>{selectedSoil.P}</strong></div>
                          <div className="soil-card k"><span>K</span><strong>{selectedSoil.K}</strong></div>
                          <div className="soil-card ph"><span>pH</span><strong>{selectedSoil.ph}</strong></div>
                        </div>
                        <div className="prediction-box">
                          <h3>🌾 Top Crop Recommendations</h3>
                          {loadingPrediction ? <div className="loader" /> : (
                            <div className="crop-list-modal">
                              {soilPrediction.slice(0, 3).map((c, i) => (
                                <div key={i} className="crop-item">🌱 {c.crop}<span>{c.confidence.toFixed(1)}%</span></div>
                              ))}
                            </div>
                          )}
                        </div>
                        <button className="close-btn-modal" onClick={() => { setShowSoilModal(false); setSoilPrediction([]); }}>Close</button>
                      </div>
                    </div>
                  )}

                  <div className="map-legend-overlay">
                    <h4>{nutrient} Levels</h4>
                    {nutrient === "pH" ? (
                      <><div className="legend-item"><span style={{ background: "#60a5fa" }} />Acidic</div><div className="legend-item"><span style={{ background: "#22c55e" }} />Neutral</div><div className="legend-item"><span style={{ background: "#f97316" }} />Alkaline</div></>
                    ) : (
                      <><div className="legend-item"><span style={{ background: "#ef4444" }} />Low</div><div className="legend-item"><span style={{ background: "#facc15" }} />Medium</div><div className="legend-item"><span style={{ background: "#22c55e" }} />High</div></>
                    )}
                  </div>
                </div>
              </div>

              <div className="fields-sidebar">
                <div className="field-list-header"><span>📂</span><h3>Your Fields</h3></div>
                <div className="field-cards-container">
                  {fields.map(f => (
                    <div key={f.id} className="field-item" onClick={() => { setInputLat(f.lat); setInputLng(f.lng); }}>
                      <div className={`field-status ${f.color}`} />
                      <div className="field-info"><strong>{f.name}</strong><p>{f.crop} • {f.area} ha</p></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {showModal && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <div className="modal-header"><h3>Add New Field</h3><button className="close-btn" onClick={() => setShowModal(false)}><X size={18} /></button></div>
                  <div className="modal-body">
                    <div><label>Field Name</label><input type="text" value={newField.name} onChange={(e) => setNewField({ ...newField, name: e.target.value })} /></div>
                    <div className="form-row">
                      <div><label>Crop</label><input type="text" value={newField.crop} onChange={(e) => setNewField({ ...newField, crop: e.target.value })} /></div>
                      <div><label>Area (ha)</label><input type="text" value={newField.area} onChange={(e) => setNewField({ ...newField, area: e.target.value })} /></div>
                    </div>
                    <div className="form-row">
                      <div><label>Lat</label><input type="text" value={newField.lat} onChange={(e) => setNewField({ ...newField, lat: e.target.value })} /></div>
                      <div><label>Lng</label><input type="text" value={newField.lng} onChange={(e) => setNewField({ ...newField, lng: e.target.value })} /></div>
                    </div>
                  </div>
                  <div className="modal-footer"><button className="save-btn" onClick={handleAddField}>Save Field</button></div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 5. CROP SUGGESTIONS */}
        {activePage === "cropSuggestions" && <CropSuggestionUI />}

        {/* 6. SOIL HEALTH */}
        {activePage === "soilHealth" && <SoilHealthUI />}

        {/* 7. SETTINGS */}
        {activePage === "settings" && (
          <div className="content-fade-in" key="settings">
            <header className="page-header">
              <h1>Settings</h1>
              <p className="subtitle-small">Manage account preferences</p>
            </header>
            <div className="settings-container-layout">
              <div className="settings-card">
                <div className="card-title-row">
                  <div className="icon-box-light"><span>👤</span></div>
                  <div><h3>Profile</h3><p>Personal details</p></div>
                </div>
                <div className="settings-form-grid">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" value={settings.name} onChange={(e) => setSettings({ ...settings, name: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" value={settings.email} onChange={(e) => setSettings({ ...settings, email: e.target.value })} />
                  </div>
                </div>
              </div>
              <div className="settings-actions">
                <button className="save-settings-btn" onClick={handleSaveSettings} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}