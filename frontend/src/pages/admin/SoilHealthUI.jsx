import { useState } from "react";
import Plot from "react-plotly.js";
import "./SoilHealthUI.css";

function SoilHealthUI() {

  const [formData, setFormData] = useState({
    N: "", P: "", K: "", pH: "",
    EC: "", OC: "", S: "",
    Fe: "", Zn: "", Mn: "", Cu: ""
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://127.0.0.1:5000/soil-health", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });

    const data = await res.json();
    console.log("SOIL DATA:", data);
    setResult(data);
  };

  return (
    <div className="crop-container">

      {/* FORM */}
      <div className="crop-card-ui">
        <h5 className="crop-title">🌱 Soil Health Analysis</h5>

        <form onSubmit={handleSubmit}>

          <div className="form-grid">

  <div className="form-group">
    <label>Nitrogen</label>
    <input type="number" name="N" onChange={handleChange} required />
  </div>

  <div className="form-group">
    <label>Phosphorus</label>
    <input type="number" name="P" onChange={handleChange} required />
  </div>

  <div className="form-group">
    <label>Potassium</label>
    <input type="number" name="K" onChange={handleChange} required />
  </div>

  <div className="form-group">
    <label>pH</label>
    <input type="number" step="0.1" name="pH" onChange={handleChange} required />
  </div>

  <div className="form-group">
    <label>EC</label>
    <input type="number" step="0.01" name="EC" onChange={handleChange} required />
  </div>

  <div className="form-group">
    <label>Organic Carbon</label>
    <input type="number" step="0.01" name="OC" onChange={handleChange} required />
  </div>

  <div className="form-group">
    <label>Sulphur</label>
    <input type="number" step="0.1" name="S" onChange={handleChange} required />
  </div>

  <div className="form-group">
    <label>Iron</label>
    <input type="number" step="0.01" name="Fe" onChange={handleChange} required />
  </div>

  <div className="form-group">
    <label>Zinc</label>
    <input type="number" step="0.01" name="Zn" onChange={handleChange} required />
  </div>

  <div className="form-group">
    <label>Manganese</label>
    <input type="number" step="0.01" name="Mn" onChange={handleChange} required />
  </div>

  <div className="form-group">
    <label>Copper</label>
    <input type="number" step="0.01" name="Cu" onChange={handleChange} required />
  </div>

</div>

          <button className="crop-btn">Analyze Soil</button>

        </form>
      </div>

      {/* RESULT */}
      {result && (
        <div className="result-grid">

          {/* GAUGE */}
          <div className="crop-card-ui">
            <h5>🌱 Soil Health Index</h5>

            <Plot
              data={[
                {
                  type: "indicator",
                  mode: "gauge+number",
                  value: result.shi,
                  title: { text: "Soil Health Index" },
                  gauge: {
                    axis: { range: [0, 100] },
                    bar: { color: "#2e7d32" },
                    steps: [
                      { range: [0, 40], color: "#ef5350" },
                      { range: [40, 70], color: "#ffa726" },
                      { range: [70, 100], color: "#66bb6a" }
                    ]
                  }
                }
              ]}
              layout={{ width: 300, height: 250 }}
            />

            <p><strong>Category:</strong> {result.category}</p>
          </div>

          {/* DEFICIENCIES */}
          <div className="crop-card-ui">
            <h5>⚠ Nutrient Deficiencies</h5>

            {result.deficiencies?.length > 0 ? (
              result.deficiencies.map((item, i) => (
                <p key={i} style={{ color: "red" }}>⚠ {item}</p>
              ))
            ) : (
              <p style={{ color: "green" }}>No deficiencies</p>
            )}
          </div>

          {/* SUGGESTIONS */}
          <div className="crop-card-ui">
            <h5>🌿 Suggestions</h5>

            {result.suggestions?.map((tip, i) => (
              <p key={i}>🌿 {tip}</p>
            ))}
          </div>

        </div>
      )}

    </div>
  );
}

export default SoilHealthUI;