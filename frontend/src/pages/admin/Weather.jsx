import React, { useEffect, useState } from "react";
import "./Weather.css";

const Weather = () => {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState("Kasganj");
  const [inputCity, setInputCity] = useState("");
  const [loading, setLoading] = useState(true);

  const API_KEY = process.env.REACT_APP_WEATHER_KEY;

  useEffect(() => {
    setLoading(true);
    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city},IN&units=metric&appid=${API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        setWeather(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [city]);

  const handleUseLocation = () => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      setLoading(true);
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
      );
      const data = await res.json();
      setWeather(data);
      setCity(data.city.name);
      setLoading(false);
    });
  };

  const handleSearch = () => {
    if (inputCity.trim()) setCity(inputCity.trim());
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  if (loading) return <div className="loading"><span className="loader" />Loading...</div>;

  if (!weather) return <div className="loading">Something went wrong.</div>;

  if (weather.cod !== "200") {
    return <div className="loading">❌ {weather.message}</div>;
  }

  const current = weather.list[0];
  const desc = current.weather[0].description;
  const { temp, humidity, pressure } = current.main;
  const wind = current.wind.speed;
  const visibility = (current.visibility / 1000).toFixed(1);

  const hourlyData = weather.list.slice(0, 8);
  const dailyData = weather.list.filter((item) =>
    item.dt_txt.includes("12:00:00")
  );

  const getEmoji = (desc) => {
    const d = desc.toLowerCase();
    if (d.includes("thunderstorm")) return "⛈️";
    if (d.includes("heavy intensity rain")) return "🌧️";
    if (d.includes("rain") || d.includes("drizzle")) return "🌦️";
    if (d.includes("snow")) return "❄️";
    if (d.includes("mist") || d.includes("fog") || d.includes("haze")) return "🌫️";
    if (d.includes("overcast")) return "☁️";
    if (d.includes("broken clouds")) return "🌥️";
    if (d.includes("few clouds") || d.includes("scattered")) return "⛅";
    if (d.includes("clear")) return "☀️";
    return "🌤️";
  };

  const getWeatherType = () => {
    const d = current.weather[0].description.toLowerCase();
    if (d.includes("thunderstorm")) return "thunder";
    if (d.includes("heavy intensity rain")) return "heavy-rain";
    if (d.includes("rain") || d.includes("drizzle")) return "rain";
    if (d.includes("snow")) return "snow";
    if (d.includes("mist") || d.includes("fog") || d.includes("haze")) return "mist";
    if (d.includes("overcast")) return "heavy-clouds";
    if (d.includes("broken clouds")) return "cloudy";
    if (d.includes("scattered clouds") || d.includes("few clouds")) return "partly-cloudy";
    if (d.includes("clear")) return "clear";
    return "clear";
  };

  const weatherType = getWeatherType();

  return (
    <div className={`weather-page ${weatherType}`}>
      <div className="weather-container">

        {/* Search */}
        <div className="search-box">
          <input
            type="text"
            placeholder="Search city..."
            value={inputCity}
            onChange={(e) => setInputCity(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button onClick={handleSearch}>Search</button>
          <button onClick={handleUseLocation} className="location-btn">
            📍 My Location
          </button>
        </div>

        {/* City + Current */}
        <div className="city-label">{weather.city.name}, {weather.city.country}</div>
        <div className="current">
          <h1>{getEmoji(desc)} {Math.round(temp)}°C</h1>
          <p className="desc-text">{desc}</p>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <Stat icon="💧" label="Humidity" value={`${humidity}%`} />
          <Stat icon="🌬️" label="Wind" value={`${wind} m/s`} />
          <Stat icon="👁️" label="Visibility" value={`${visibility} km`} />
          <Stat icon="📊" label="Pressure" value={`${pressure} hPa`} />
        </div>

        {/* Hourly */}
        <h3 className="section-title">Hourly Forecast</h3>
        <div className="hourly">
          {hourlyData.map((item, i) => (
            <div key={i} className="hour-card">
              <p className="h-time">{new Date(item.dt_txt).getHours()}:00</p>
              <p className="h-icon">{getEmoji(item.weather[0].description)}</p>
              <p className="h-temp">{Math.round(item.main.temp)}°C</p>
              <p className="h-hum">{item.main.humidity}%</p>
            </div>
          ))}
        </div>

        {/* Daily */}
        <h3 className="section-title">Next Days</h3>
        <div className="weekly">
          {dailyData.map((day, i) => (
            <div key={i} className="day-card">
              <p className="d-date">{new Date(day.dt_txt).toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" })}</p>
              <p className="d-icon">{getEmoji(day.weather[0].description)}</p>
              <p className="d-temp">{Math.round(day.main.temp)}°C</p>
              <p className="d-cond">{day.weather[0].main}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

const Stat = ({ icon, label, value }) => (
  <div className="stat-box">
    <p className="stat-icon">{icon}</p>
    <p className="stat-label">{label}</p>
    <p className="stat-val">{value}</p>
  </div>
);

export default Weather;