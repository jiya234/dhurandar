import { useState } from "react";
import Plot from "react-plotly.js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./SoilHealthUI.css";

function SoilHealthUI() {
  const [formData, setFormData] = useState({
    N: "", P: "", K: "", pH: "",
    EC: "", OC: "", S: "",
    Fe: "", Zn: "", Mn: "", Cu: ""
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const nutrientRanges = {
    N:  { min: 0, max: 500 },
    P:  { min: 0, max: 300 },
    K:  { min: 0, max: 500 },
    pH: { min: 0, max: 14 },
    EC: { min: 0, max: 10 },
    OC: { min: 0, max: 10 },
    S:  { min: 0, max: 200 },
    Fe: { min: 0, max: 100 },
    Zn: { min: 0, max: 50 },
    Mn: { min: 0, max: 100 },
    Cu: { min: 0, max: 50 }
  };

  const getBarColor = (name, value) => {
    const num = parseFloat(value);
    if (isNaN(num)) return "#93c5fd";
    if (name === "pH") {
      if (num < 6.5) return "#ef4444";
      if (num <= 7.5) return "#22c55e";
      return "#f59e0b";
    }
    const range = nutrientRanges[name];
    if (!range) return "#93c5fd";
    const span = range.max - range.min;
    if (num < range.min + span * 0.3) return "#ef4444";
    if (num > range.min + span * 0.7) return "#22c55e";
    return "#f59e0b";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value);
    if (nutrientRanges[name] && value !== "") {
      const { min, max } = nutrientRanges[name];
      if (numValue < min || numValue > max) {
        toast.warning(`${name}: Enter value between ${min} – ${max}`, { toastId: name });
        return;
      }
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://127.0.0.1:5000/soil-health", {
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

  const chartData = Object.entries(formData).map(([name, value]) => ({
    name,
    value: parseFloat(value) || 0,
    color: getBarColor(name, value),
  }));

  const getCategoryStyle = (cat) => {
    if (cat === "Good") return { bg: "#f0fdf4", border: "#10b981", text: "#065f46", icon: "🌱", sub: "Soil is healthy and productive" };
    if (cat === "Moderate") return { bg: "#fffbeb", border: "#f59e0b", text: "#78350f", icon: "⚠️", sub: "Needs some improvement" };
    return { bg: "#fef2f2", border: "#ef4444", text: "#7f1d1d", icon: "❌", sub: "Poor condition, needs attention" };
  };

  return (
    <div className="sh-container">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* ── FORM CARD ── */}
      <div className="sh-card">
        <div className="sh-desc-box">
          <h4>🌿 Soil Health Analysis Guide</h4>
          <p>Analyze your soil based on essential macronutrients and micronutrients.</p>
          <ul>
            <li>Fill macronutrients: Nitrogen, Phosphorus, Potassium, and pH.</li>
            <li>Add micronutrients like Iron, Zinc, Copper for detailed analysis.</li>
          </ul>
          <p>Output: Soil Health Index, nutrient deficiencies, and improvement suggestions.</p>
        </div>

        <h5 className="sh-section-title">🧪 Soil Nutrient Inputs</h5>

        <form onSubmit={handleSubmit}>
          <div className="sh-form-grid">
            {[
              { name: "N",  label: "Nitrogen",        unit: "kg/ha" },
              { name: "P",  label: "Phosphorus",       unit: "kg/ha" },
              { name: "K",  label: "Potassium",        unit: "kg/ha" },
              { name: "pH", label: "pH",               unit: "0–14",  step: "0.1" },
              { name: "EC", label: "EC",               unit: "dS/m",  step: "0.01" },
              { name: "OC", label: "Organic Carbon",   unit: "%",     step: "0.01" },
              { name: "S",  label: "Sulphur",          unit: "ppm",   step: "0.1" },
              { name: "Fe", label: "Iron",             unit: "ppm",   step: "0.01" },
              { name: "Zn", label: "Zinc",             unit: "ppm",   step: "0.01" },
              { name: "Mn", label: "Manganese",        unit: "ppm",   step: "0.01" },
              { name: "Cu", label: "Copper",           unit: "ppm",   step: "0.01" },
            ].map(({ name, label, unit, step }) => (
              <div className="form-group" key={name}>
                <label>{label} <span className="unit">{unit}</span></label>
                <input
                  type="number"
                  name={name}
                  step={step || "1"}
                  min={nutrientRanges[name]?.min}
                  max={nutrientRanges[name]?.max}
                  placeholder={`${nutrientRanges[name]?.min}–${nutrientRanges[name]?.max}`}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}
          </div>

          {error && <p className="error-msg">⚠️ {error}</p>}

          <button type="submit" className="sh-btn" disabled={loading}>
            {loading ? <span className="btn-loader" /> : "🔬"} {loading ? "Analyzing..." : "Analyze Soil"}
          </button>
        </form>
      </div>

      {/* ── RESULTS ── */}
      {result && (
        <div className="result-section">

          {/* Top Row */}
          <div className="top-result-grid">

            {/* Gauge */}
            <div className="sh-card">
              <h5 className="sh-section-title">🌱 Soil Health Index</h5>
              <div className="gauge-wrap">
                <Plot
                  data={[{
                    type: "indicator",
                    mode: "gauge+number",
                    value: result.shi,
                    gauge: {
                      axis: { range: [0, 100], tickfont: { size: 11 } },
                      bar: { color: "#059669", thickness: 0.25 },
                      bgcolor: "white",
                      borderwidth: 0,
                      steps: [
                        { range: [0, 40],  color: "#fee2e2" },
                        { range: [40, 70], color: "#fef9c3" },
                        { range: [70, 100], color: "#dcfce7" },
                      ],
                    },
                    number: { font: { size: 36, color: "#111827" }, suffix: "" },
                  }]}
                  layout={{
                    width: undefined,
                    height: 220,
                    margin: { t: 20, b: 10, l: 20, r: 20 },
                    paper_bgcolor: "transparent",
                    font: { family: "DM Sans, sans-serif" },
                  }}
                  style={{ width: "100%" }}
                  config={{ displayModeBar: false, responsive: true }}
                />
                <div className="gauge-legend">
                  <span className="leg-item"><span className="leg-dot" style={{ background: "#ef4444" }} />Poor (0–40)</span>
                  <span className="leg-item"><span className="leg-dot" style={{ background: "#f59e0b" }} />Moderate (40–70)</span>
                  <span className="leg-item"><span className="leg-dot" style={{ background: "#10b981" }} />Good (70–100)</span>
                </div>
              </div>
            </div>

            {/* Nutrient Bar Chart */}
            <div className="sh-card">
              <h5 className="sh-section-title">📊 Nutrient Overview</h5>
              <div className="color-legend">
                <span><span className="leg-dot-sm" style={{ background: "#ef4444" }} />Low</span>
                <span><span className="leg-dot-sm" style={{ background: "#f59e0b" }} />Normal</span>
                <span><span className="leg-dot-sm" style={{ background: "#22c55e" }} />High</span>
              </div>
              <div className="nutrient-bars">
                {chartData.map(({ name, value, color }) => {
                  const range = nutrientRanges[name];
                  const pct = Math.min(100, range ? (value / range.max) * 100 : 0);
                  return (
                    <div className="nb-row" key={name}>
                      <span className="nb-label">{name}</span>
                      <div className="nb-track">
                        <div className="nb-fill" style={{ width: `${pct}%`, background: color }} />
                      </div>
                      <span className="nb-val">{value}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="bottom-result-grid">

            {/* Category */}
            <div className="sh-card">
              <h5 className="sh-section-title">📋 Category Insight</h5>
              {(() => {
                const s = getCategoryStyle(result.category);
                return (
                  <div className="cat-box" style={{ background: s.bg, borderColor: s.border }}>
                    <p className="cat-icon">{s.icon}</p>
                    <p className="cat-val" style={{ color: s.text }}>{result.category}</p>
                    <p className="cat-sub" style={{ color: s.text }}>{s.sub}</p>
                  </div>
                );
              })()}
            </div>

            {/* Deficiencies */}
            <div className="sh-card">
              <h5 className="sh-section-title">⚠️ Nutrient Deficiencies</h5>
              {result.deficiencies?.length > 0 ? (
                <div className="badge-grid">
                  {result.deficiencies.map((item, i) => (
                    <span key={i} className="badge badge-red">⚠ {item}</span>
                  ))}
                </div>
              ) : (
                <span className="badge badge-green">✅ No Deficiencies Found</span>
              )}
            </div>

            {/* Suggestions */}
            <div className="sh-card">
              <h5 className="sh-section-title">🌿 Suggestions</h5>
              <div className="suggestions-list">
                {result.suggestions?.map((tip, i) => (
                  <div key={i} className="suggestion-item">
                    <span className="sug-icon">🌿</span>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default SoilHealthUI;