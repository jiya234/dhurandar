import React, { useState } from "react";
import { 
  Cloud, Sun, Wind, Eye, Gauge, Map, Settings, 
  LayoutDashboard, CloudRain, Wheat, Navigation 
} from "lucide-react";
import "./Users.css";

export default function UserDashboard() {
  const [activePage, setActivePage] = useState("dashboard");

  return (
    <div className="app-container">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="logo-section">
          <div className="logo-box">
            <CloudRain size={20} color="white" />
          </div>
          <span className="logo-text">AgriSense</span>
        </div>

        <div className="profile-section">
          <div className="profile-avatar">RS</div>
          <div className="profile-details">
            <h4>Ramesh Singh</h4>
            <p>Kasganj, UP</p>
          </div>
          <div className="status-badge">● Active field</div>
        </div>

        <nav className="nav-menu">
          <div className={`nav-item ${activePage === "dashboard" ? "active" : ""}`} onClick={() => setActivePage("dashboard")}>
            <LayoutDashboard size={18} /> <span>Dashboard</span>
          </div>
          <div className={`nav-item ${activePage === "weather" ? "active" : ""}`} onClick={() => setActivePage("weather")}>
            <Cloud size={18} /> <span>Weather</span>
          </div>
          {/* Field Map Link (FIXED: Added onClick here) */}
          <div 
            className={`nav-item ${activePage === "fieldMap" ? "active" : ""}`} 
            onClick={() => setActivePage("fieldMap")}
          >
            <Map size={18} /> <span>Field Map</span>
          </div>
         <div className={`nav-item ${activePage === "cropSuggestions" ? "active" : ""}`} onClick={() => setActivePage("cropSuggestions")}>
            <Wheat size={18} /> <span>Crop Suggestions</span>
          </div>
          <div className="nav-item"><Settings size={18} /> <span>Settings</span></div>
        </nav>

        <div className="news-section">
          <h5>AGRI NEWS</h5>
          <div className="news-item">IMD predicts normal monsoon this season</div>
          <div className="news-item">Govt revises MSP for wheat by 7%</div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        {activePage === "dashboard" && (
          <div className="content-fade-in">
            <header className="page-header">
              <h1>Good Morning, Ramesh 👋</h1>
              <p>Here's what's happening with your fields today</p>
            </header>

            <div className="dashboard-grid">
              <div className="stat-card">
                <div className="stat-icon sun">☀️</div>
                <h2>28°C</h2>
                <p>Partly Cloudy</p>
                <span className="small-alert">Rain expected Wed-Thu</span>
              </div>
              <div className="stat-card">
                <div className="stat-icon leaf">🌱</div>
                <h2>3 Fields</h2>
                <p>Active this season</p>
                <span className="small-alert">All fields healthy</span>
              </div>
              <div className="stat-card">
                <div className="stat-icon trend">📈</div>
                <h2>Good</h2>
                <p>Soil health status</p>
                <span className="small-alert">Consider adding phosphorus</span>
              </div>
            </div>

            <div className="lower-grid">
              <div className="map-panel">
                <div className="panel-header">
                  <h3>📍 Field Location</h3>
                  <Navigation size={16} />
                </div>
                <div className="coord-inputs">
                  <div className="input-group"><label>LATITUDE</label><input value="27.8" readOnly /></div>
                  <div className="input-group"><label>LONGITUDE</label><input value="78.65" readOnly /></div>
                  <button className="apply-btn">Apply</button>
                </div>
                <div className="map-view">
                   {/* Map image or component here */}
                   <img src="https://via.placeholder.com/600x300/e0e0e0/808080?text=Map+Preview" alt="Map" />
                </div>
              </div>

              <div className="recommendation-panel">
                <div className="panel-header">
                   <h3>🌾 Crop Recommendation</h3>
                   <span className="badge">High Confidence</span>
                </div>
                <div className="crop-list">
                  <div className="crop-card">
                    <span className="crop-emoji">🌾</span>
                    <strong>Wheat</strong>
                    <p>92% match</p>
                  </div>
                  <div className="crop-card">
                    <span className="crop-emoji">🌻</span>
                    <strong>Mustard</strong>
                    <p>87% match</p>
                  </div>
                  <div className="crop-card">
                    <span className="crop-emoji">🫘</span>
                    <strong>Chickpea</strong>
                    <p>84% match</p>
                  </div>
                </div>
                <div className="why-crops">
                  <h4>Why these crops?</h4>
                  <ul>
                    <li>✅ Suitable for local soil type (alluvial)</li>
                    <li>✅ Compatible with regional rainfall patterns</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

       {/* --- 2. WEATHER PAGE --- */}
        {activePage === "weather" && (
          <div className="content-fade-in">
            <header className="page-header">
              <h1>Weather Forecast</h1>
              <p>Kasganj, Uttar Pradesh</p>
            </header>
            <div className="weather-grid">
              <div className="weather-main-col">
                <div className="weather-hero-card">
                  <div className="hero-content">
                    <div className="hero-text">
                      <p className="date-label">Today, December 15</p>
                      <div className="temp-display">
                        <span className="main-temp">28°</span>
                        <div className="condition-box"><h2>Partly Cloudy</h2><p>Feels like 30°C</p></div>
                      </div>
                    </div>
                    <Sun size={100} className="weather-illustration" />
                  </div>
                  <div className="weather-metrics">
                    <div className="metric"><Cloud size={18} /> <div><p>HUMIDITY</p><strong>65%</strong></div></div>
                    <div className="metric"><Wind size={18} /> <div><p>WIND</p><strong>12 km/h</strong></div></div>
                    <div className="metric"><Eye size={18} /> <div><p>VISIBILITY</p><strong>10 km</strong></div></div>
                    <div className="metric"><Gauge size={18} /> <div><p>PRESSURE</p><strong>1015 hPa</strong></div></div>
                  </div>
                </div>
                <div className="hourly-forecast-card">
                  <h3>Today's Forecast</h3>
                  <div className="hourly-row">
                    {["6 AM", "9 AM", "12 PM", "3 PM", "6 PM"].map((t, i) => (
                      <div key={i} className={`hour-item ${t === "3 PM" ? "active" : ""}`}>
                        <span>{t}</span><Sun size={20} /><strong>{t === "3 PM" ? "30°" : "22°"}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="weather-side-col">
                <div className="impact-panel">
                  <h3>🌡️ Farming Impact</h3>
                  <div className="advisory-card green"><strong>Ideal for Sowing</strong><p>Current conditions are good for wheat.</p></div>
                  <div className="advisory-card blue"><strong>Rain Alert</strong><p>Postpone irrigation.</p></div>
                </div>
                <div className="sun-moon-card">
                  <h3>Sun & Moon</h3>
                  <div className="astro-flex">
                    <div className="astro-box sunrise"><small>Sunrise</small><strong>6:45 AM</strong></div>
                    <div className="astro-box sunset"><small>Sunset</small><strong>5:30 PM</strong></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- 3. FIELD MAP PAGE (Ab yeh Weather ke bahar hai) --- */}
        {activePage === "fieldMap" && (
          <div className="content-fade-in">
            <header className="page-header-flex">
              <div>
                <h1>Field Map</h1>
                <p>Manage and view your agricultural fields</p>
              </div>
              <button className="add-field-btn">+ Add Field</button>
            </header>
            <div className="map-grid-layout">
              <div className="map-main-area">
                <div className="coord-bar">
                  <div className="input-box"><label>LATITUDE</label><input type="text" value="27.8" readOnly /></div>
                  <div className="input-box"><label>LONGITUDE</label><input type="text" value="78.65" readOnly /></div>
                  <button className="go-btn">🚀 Go</button>
                </div>
                <div className="interactive-map-container">
                  <img src="https://via.placeholder.com/800x500/e0e0e0/808080?text=Map+Preview" alt="Map" className="map-img" />
                </div>
              </div>
              <div className="fields-sidebar">
                <div className="field-list-header"><span>📂</span><h3>Your Fields</h3></div>
                <div className="field-item"><div className="field-status green"></div><div className="field-info"><strong>North Field</strong><p>Wheat • 4.2 ha</p></div></div>
                <div className="field-item"><div className="field-status yellow"></div><div className="field-info"><strong>South Field</strong><p>Mustard • 3.8 ha</p></div></div>
              </div>
            </div>
          </div>
        )}
      
 <div className={`nav-item ${activePage === "cropSuggestions" ? "active" : ""}`} onClick={() => setActivePage("cropSuggestions")}>

{activePage === "cropSuggestions" && (
  <div className="content-fade-in">
    <header className="page-header">
      <h1>Crop Suggestions</h1>
      <p className="subtitle-small">AI-powered recommendations based on your soil and weather data</p>
    </header>

    <div className="crops-container-layout">
      {/* LEFT SIDE: Crop Selector List */}
      <div className="crop-sidebar-list">
        {[
          { name: "Wheat", season: "Rabi • 120-150 days", match: "92%", icon: "🌾", active: true },
          { name: "Mustard", season: "Rabi • 110-140 days", match: "87%", icon: "🌻", active: false },
          { name: "Chickpea", season: "Rabi • 95-110 days", match: "84%", icon: "🫘", active: false },
          { name: "Barley", season: "Rabi • 100-120 days", match: "78%", icon: "🌱", active: false }
        ].map((crop, idx) => (
          <div key={idx} className={`crop-mini-card ${crop.active ? 'active' : ''}`}>
            <span className="mini-icon">{crop.icon}</span>
            <div className="mini-info">
              <h4>{crop.name}</h4>
              <p>{crop.season}</p>
            </div>
            <div className="mini-match">
              <div className="progress-bar"><div className="progress-fill" style={{width: crop.match}}></div></div>
              <span>{crop.match} match</span>
            </div>
          </div>
        ))}
      </div>

      {/* RIGHT SIDE: Main Analysis Area */}
      <div className="crop-analysis-main">
        {/* Main Hero Card */}
        <div className="crop-detail-hero">
          <div className="hero-top-flex">
            <span className="large-icon">🌾</span>
            <div className="hero-title-box">
              <h2>Wheat</h2>
              <p>Rabi Season Crop</p>
            </div>
            <span className="confidence-pill">92% Match</span>
          </div>
          
          <p className="hero-text-desc">
            Ideal for the current soil conditions. High yield potential with proper irrigation management.
          </p>

          <div className="quick-stats-grid">
            <div className="qs-item"><small>Water Need</small><strong>Medium</strong></div>
            <div className="qs-item"><small>Temperature</small><strong>15-25°C</strong></div>
            <div className="qs-item"><small>Duration</small><strong>120-150 days</strong></div>
            <div className="qs-item"><small>Soil Type</small><strong>Loamy</strong></div>
          </div>
        </div>

        {/* Bottom Split Cards */}
        <div className="bottom-info-flex">
          <div className="info-box-card">
            <h3>🛡️ Why This Crop?</h3>
            <ul>
              <li>Well-suited for alluvial soil in your region</li>
              <li>Compatible with current moisture levels</li>
              <li>Good market price expected this season</li>
              <li>Lower pest risk in winter months</li>
            </ul>
          </div>

          <div className="info-box-card">
            <h3>💡 Growing Tips</h3>
            <ol>
              <li>Sow seeds 2-3 cm deep</li>
              <li>Maintain row spacing of 20-22 cm</li>
              <li>First irrigation at 20-25 days after sowing</li>
              <li>Apply nitrogen fertilizer in 2-3 split doses</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  </div>
)}
</div>

      </main>
    </div>
  );
}