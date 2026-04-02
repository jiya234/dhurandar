import React, { useEffect, useState } from "react";
import { Sun, Cloud, Wind, Eye, Gauge, CloudRain } from "lucide-react";
import "./Weather.css";

const Weather = () => {
  const [weather, setWeather] = useState(null);

  const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
  const CITY = "Kasganj";
  const COUNTRY = "IN";

  useEffect(() => {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${CITY},${COUNTRY}&units=metric&appid=${API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => setWeather(data))
      .catch((err) => console.log("Weather Fetch Error:", err));
  }, [API_KEY]);

  if (!weather || weather.cod !== 200) {
    return <div className="loading">Loading Weather...</div>;
  }

  const { temp, humidity, pressure, feels_like } = weather.main;
  const wind = weather.wind.speed;
  const visibility = weather.visibility / 1000;
  const condition = weather.weather[0].main;
  const description = weather.weather[0].description;

  const getAdvice = (t) => {
    if (t < 20) return "Cool weather 🌾 - Ideal for wheat sowing.";
    if (t > 35) return "High temperature ☀️ - Increase irrigation.";
    return "Normal conditions ✅ - Good for field work.";
  };

  const renderIcon = () => {
    if (condition === "Clouds") return <Cloud size={90} />;
    if (condition === "Rain") return <CloudRain size={90} />;
    if (condition === "Clear") return <Sun size={90} />;
    return <Sun size={90} />;
  };

  return (
    <div className="weather-page">
      <div className="weather-container">

        {/* HEADER */}
        <div className="header">
          <h1>Weather Dashboard</h1>
          <p>{CITY}, Uttar Pradesh</p>
        </div>

        {/* GRID */}
        <div className="main-grid">

          {/* LEFT */}
          <div className="left-section">
            <div className="weather-card">

              <div className="weather-main">
                <div>
                  <p className="date">{new Date().toDateString()}</p>
                  <h2 className="temp">{Math.round(temp)}°C</h2>
                  <h3 className="condition">{condition}</h3>
                  <p className="feels">Feels like {Math.round(feels_like)}°C</p>
                </div>

                <div className="icon">{renderIcon()}</div>
              </div>

              {/* STATS */}
              <div className="stats-grid">
                <Stat icon={<Cloud />} label="Humidity" value={`${humidity}%`} />
                <Stat icon={<Wind />} label="Wind" value={`${wind} m/s`} />
                <Stat icon={<Eye />} label="Visibility" value={`${visibility} km`} />
                <Stat icon={<Gauge />} label="Pressure" value={`${pressure} hPa`} />
              </div>

            </div>
          </div>

          {/* RIGHT */}
          <div className="right-section">

            <div className="card white">
              <h3>Live Parameters</h3>
              <p>{description}</p>
              <p>🌅 {new Date(weather.sys.sunrise * 1000).toLocaleTimeString()}</p>
              <p>🌇 {new Date(weather.sys.sunset * 1000).toLocaleTimeString()}</p>
            </div>

            <div className="card white">
              <h3>Farming Impact</h3>

              <ImpactCard
                title="Advisory"
                desc={getAdvice(temp)}
                city={CITY}
                type="green"
              />

              <ImpactCard
                title="Irrigation"
                desc={humidity < 40 ? "Low humidity ⚠️" : "Normal moisture ✅"}
                city={CITY}
                type="blue"
              />
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

// STAT COMPONENT
const Stat = ({ icon, label, value }) => (
  <div className="stat-box">
    {icon}
    <div>
      <p className="label">{label}</p>
      <p className="value">{value}</p>
    </div>
  </div>
);

// IMPACT CARD
const ImpactCard = ({ title, desc, city, type }) => (
  <div className={`impact-card ${type}`}>
    <h4>{title}</h4>
    <p>{city}: {desc}</p>
  </div>
);

export default Weather;