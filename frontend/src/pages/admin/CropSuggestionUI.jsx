import { useState } from "react";
import "./CropSuggestionUI.css";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell
} from "recharts";

function CropSuggestionUI() {
  const [formData, setFormData] = useState({
    Nitrogen: "", Phosphorus: "", Potassium: "",
    Ph: "", state: "", district: "", city: ""
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError("Could not connect to server. Make sure Flask is running.");
    } finally {
      setLoading(false);
    }
  };

  const chartData = result?.recommendations?.map((rec) => ({
    name: rec.crop,
    confidence: rec.confidence,
  })) || [];

  const topCrop = result?.recommendations?.reduce((prev, curr) =>
    curr.confidence > prev.confidence ? curr : prev
  );

  const medalEmoji = ["🥇", "🥈", "🥉"];

  const getConfidenceColor = (c) =>
    c > 80 ? "#10b981" : c > 60 ? "#f59e0b" : "#ef4444";

  const getConfidenceLabel = (c) =>
    c > 80 ? "Highly Suitable 🌟" : c > 60 ? "Moderate 👍" : "Low ⚠️";

  return (
    <div className="crop-container">

      {/* ── FORM CARD ── */}
      <div className="crop-card">
        <div className="crop-desc-box">
          <h4>🌱 Crop Recommendation Guide</h4>
          <p>Enter your soil nutrient values and location to find the best crops for your field.</p>
          <ul>
            <li>Fill Nitrogen, Phosphorus, Potassium, and pH from your soil test report.</li>
            <li>Add State, District, and City for weather-based analysis.</li>
          </ul>
          <p>Higher confidence = more suitable for your soil and local climate.</p>
        </div>

        <h5 className="crop-section-title">🌿 Soil & Location Details</h5>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Nitrogen <span className="unit">kg/ha</span></label>
              <input type="number" name="Nitrogen" step="0.01" min="0" placeholder="e.g. 90" onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Phosphorus <span className="unit">kg/ha</span></label>
              <input type="number" name="Phosphorus" step="0.01" min="0" placeholder="e.g. 42" onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Potassium <span className="unit">kg/ha</span></label>
              <input type="number" name="Potassium" step="0.01" min="0" placeholder="e.g. 43" onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>pH <span className="unit">0–14</span></label>
              <input type="number" name="Ph" step="0.1" min="0" max="14" placeholder="e.g. 6.5" onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>State</label>
              <input type="text" name="state" placeholder="Uttar Pradesh" onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>District</label>
              <input type="text" name="district" placeholder="Kasganj" onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>City</label>
              <input type="text" name="city" placeholder="Kasganj" onChange={handleChange} required />
            </div>
          </div>

          {error && <p className="error-msg">⚠️ {error}</p>}

          <button type="submit" className="crop-btn" disabled={loading}>
            {loading ? <span className="btn-loader" /> : "🚀"} {loading ? "Analyzing..." : "Get Recommendation"}
          </button>
        </form>
      </div>

      {/* ── RESULTS ── */}
      {result && result.recommendations && (
        <div className="result-section">

          {/* Three Cards Row */}
          <div className="three-grid">

            {/* Input Summary */}
            <div className="crop-card">
              <h5 className="crop-section-title">📋 Input Summary</h5>
              <div className="summary-list">
                <SummaryRow label="Nitrogen" value={`${formData.Nitrogen} kg/ha`} />
                <SummaryRow label="Phosphorus" value={`${formData.Phosphorus} kg/ha`} />
                <SummaryRow label="Potassium" value={`${formData.Potassium} kg/ha`} />
                <SummaryRow label="pH" value={formData.Ph} />
                <SummaryRow label="State" value={formData.state} />
                <SummaryRow label="District" value={formData.district} />
                <SummaryRow label="City" value={formData.city} />
              </div>
            </div>

            {/* Weather */}
            <div className="crop-card">
              <h5 className="crop-section-title">🌦️ Weather Insights</h5>
              <div className="weather-stats">
                <WeatherStat icon="🌡️" label="Temperature" value={`${result.temperature} °C`} />
                <WeatherStat icon="💧" label="Humidity" value={`${result.humidity}%`} />
                <WeatherStat icon="🌧️" label="Rainfall" value={`${result.rainfall} mm`} />
              </div>
            </div>

            {/* Recommendations */}
            <div className="crop-card">
              <h5 className="crop-section-title">🌾 Crop Recommendations</h5>
              {result.recommendations.map((rec, index) => (
                <div key={index} className="rec-item">
                  <div className="rec-header">
                    <span className="rec-name">{medalEmoji[index] || ""} {rec.crop}</span>
                    <span className="rec-pct" style={{ color: getConfidenceColor(rec.confidence) }}>
                      {rec.confidence}%
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${rec.confidence}%`,
                        background: getConfidenceColor(rec.confidence),
                      }}
                    />
                  </div>
                  <span className="rec-label">{getConfidenceLabel(rec.confidence)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Crop Banner */}
          <div className="top-crop-banner">
            🏆 Top Crop: <strong>{topCrop.crop}</strong> — {topCrop.confidence}% Confidence
          </div>

          {/* Chart */}
          <div className="crop-card">
            <h5 className="crop-section-title">📊 Recommendation Graph</h5>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 13 }} />
                <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
                <Tooltip
                  formatter={(val) => [`${val}%`, "Confidence"]}
                  contentStyle={{ borderRadius: 8, fontSize: 13 }}
                />
                <Bar dataKey="confidence" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={entry.name === topCrop.crop ? "#10b981" : "#93c5fd"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>
      )}
    </div>
  );
}

const SummaryRow = ({ label, value }) => (
  <div className="summary-row">
    <span className="summary-label">{label}</span>
    <span className="summary-value">{value}</span>
  </div>
);

const WeatherStat = ({ icon, label, value }) => (
  <div className="weather-stat-box">
    <span className="ws-icon">{icon}</span>
    <div>
      <p className="ws-label">{label}</p>
      <p className="ws-value">{value}</p>
    </div>
  </div>
);

export default CropSuggestionUI;