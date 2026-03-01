import React, { useEffect, useState } from "react";
import { Sun, Cloud, Wind, Eye, Gauge } from "lucide-react";
import "./Weather.css"; // 👈 make sure this file is linked

const Weather = () => {
  const API_KEY = "43ef35045c8f53ed9fd6a462d0354108";
  const CITY = "Kasganj";
  const COUNTRY = "IN";

  const [weather, setWeather] = useState(null);

  useEffect(() => {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${CITY},${COUNTRY}&units=metric&appid=${API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => setWeather(data))
      .catch((err) => console.log(err));
  }, [API_KEY]);

  if (!weather) return <div className="weather-page">Loading...</div>;

  const { temp, humidity, pressure } = weather.main;
  const wind = weather.wind.speed;
  const visibility = weather.visibility / 1000;
  const condition = weather.weather[0].description;

  return (
    <div className="weather-page">
      <h1 className="title">Live Weather - {CITY}</h1>
      <p className="location">{condition}</p>

      <div className="weather-grid">
        {/* LEFT SIDE */}
        <div>
          <div className="today-card">
            <div>
              <p className="date">{new Date().toDateString()}</p>
              <div className="temp-row">
                <h2>{temp}°C</h2>
                <div>
                  <div className="condition">{condition}</div>
                  <small>Feels like {weather.main.feels_like}°C</small>
                </div>
              </div>

              <div className="stats">
                <div>Humidity<br /><strong>{humidity}%</strong></div>
                <div>Wind<br /><strong>{wind} m/s</strong></div>
                <div>Pressure<br /><strong>{pressure} hPa</strong></div>
                <div>Visibility<br /><strong>{visibility} km</strong></div>
              </div>
            </div>

            <Sun className="sun" />
          </div>

          {/* Hourly placeholder */}
          <div className="hourly-box">
            <h3>Today's Overview</h3>
            <div className="hours">
              <div className="hour active">Temp<br /><strong>{temp}°</strong></div>
              <div className="hour">Humidity<br /><strong>{humidity}%</strong></div>
              <div className="hour">Wind<br /><strong>{wind}</strong></div>
              <div className="hour">Pressure<br /><strong>{pressure}</strong></div>
              <div className="hour">Visibility<br /><strong>{visibility}</strong></div>
              <div className="hour">{condition}</div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="side-panel">
          <div className="impact green">
            <strong>Farming Advisory</strong>
            <p>{getAdvice(temp)}</p>
          </div>

          <div className="sun-moon">
            <h3>Sun & Moon</h3>
            <div className="sun-box">
              <div>
                <small>Sunrise</small>
                <strong>{formatTime(weather.sys.sunrise)}</strong>
              </div>
              <div>
                <small>Sunset</small>
                <strong>{formatTime(weather.sys.sunset)}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const getAdvice = (temp) => {
  if (temp < 20) return "Cool weather 🌾 - Ideal for wheat sowing.";
  if (temp > 35) return "High temperature ☀ - Ensure irrigation.";
  return "Normal farming conditions ✅";
};

const formatTime = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleTimeString();
};

export default Weather;