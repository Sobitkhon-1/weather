/*import { useState, useEffect } from "react";
import "./WeatherApp.css";

function WeatherApp() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const [unit, setUnit] = useState("metric"); // metric or imperial

  // Check for saved theme preference
  useEffect(() => {
    const saved = window.savedTheme || "dark";
    setDarkMode(saved === "dark");
  }, []);

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    window.savedTheme = newMode ? "dark" : "light";
  };

  const toggleUnit = () => {
    setUnit(unit === "metric" ? "imperial" : "metric");
  };

  const fetchWeatherByCity = async (cityName) => {
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
    
    setLoading(true);
    setError("");
    
    try {
      // Current weather
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          cityName
        )}&appid=${apiKey}&units=${unit}`
      );
      const data = await res.json();

      if (data.cod !== 200) {
        setError(data.message || "City not found. Please try again.");
        setWeather(null);
        setForecast([]);
        setLoading(false);
        return;
      }
      setWeather(data);

      // 5-day forecast
      const res2 = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
          cityName
        )}&appid=${apiKey}&units=${unit}`
      );
      const data2 = await res2.json();

      // Get one forecast per day at noon
      const daily = [];
      const map = {};
      data2.list.forEach((item) => {
        const date = item.dt_txt.split(" ")[0];
        if (!map[date] && item.dt_txt.includes("12:00:00")) {
          map[date] = true;
          daily.push(item);
        }
      });

      setForecast(daily);
    } catch (err) {
      console.error(err);
      setError("Error fetching weather. Please check your connection.");
    }
    setLoading(false);
  };

  const fetchWeatherByLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setLoading(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

        try {
          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${unit}`
          );
          const data = await res.json();

          if (data.cod !== 200) {
            setError("Could not fetch weather for your location");
            setLoading(false);
            return;
          }

          setWeather(data);
          setCity(data.name);

          // Fetch forecast
          const res2 = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${unit}`
          );
          const data2 = await res2.json();

          const daily = [];
          const map = {};
          data2.list.forEach((item) => {
            const date = item.dt_txt.split(" ")[0];
            if (!map[date] && item.dt_txt.includes("12:00:00")) {
              map[date] = true;
              daily.push(item);
            }
          });

          setForecast(daily);
        } catch (err) {
          console.error(err);
          setError("Error fetching weather for your location");
        }
        setLoading(false);
      },
      (error) => {
        setError("Unable to retrieve your location");
        setLoading(false);
      }
    );
  };

  const handleSearch = () => {
    if (!city.trim()) {
      setError("Please enter a city name");
      return;
    }
    fetchWeatherByCity(city);
  };

  const tempUnit = unit === "metric" ? "°C" : "°F";
  const speedUnit = unit === "metric" ? "m/s" : "mph";

  return (
    <div className={`app ${darkMode ? "dark" : "light"}`}>
      <div style={{ position: "absolute", top: "1rem", right: "1rem", display: "flex", gap: "0.5rem" }}>
        <button
          onClick={toggleTheme}
          style={{
            padding: "8px 16px",
            borderRadius: "20px",
            border: "none",
            background: "rgba(255,255,255,0.2)",
            color: darkMode ? "#fff" : "#222",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
        <button
          onClick={toggleUnit}
          style={{
            padding: "8px 16px",
            borderRadius: "20px",
            border: "none",
            background: "rgba(255,255,255,0.2)",
            color: darkMode ? "#fff" : "#222",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          {unit === "metric" ? "°F" : "°C"}
        </button>
      </div>

      <h1 className="title">🌤 Weather App</h1>

      <div className="search-box">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city..."
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button onClick={handleSearch}>Search</button>
        <button
          onClick={fetchWeatherByLocation}
          style={{
            padding: "10px 20px",
            borderRadius: "20px",
            border: "none",
            background: "#4caf50",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
          }}
          title="Use my location"
        >
          📍
        </button>
      </div>

      {loading && <p className="loading">Loading weather data...</p>}
      {error && (
        <div style={{
          textAlign: "center",
          color: "#ff5252",
          background: "rgba(255,82,82,0.1)",
          padding: "1rem",
          borderRadius: "10px",
          maxWidth: "400px",
          margin: "1rem auto",
        }}>
          {error}
        </div>
      )}

      {weather && !loading && (
        <div className="weather-card">
          <h2>{weather.name}, {weather.sys.country}</h2>
          <img
            className="weather-icon"
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt="weather icon"
          />
          <h1 style={{ fontSize: "3rem", margin: "0.5rem 0" }}>
            {Math.round(weather.main.temp)}{tempUnit}
          </h1>
          <p style={{ textTransform: "capitalize", fontSize: "1.2rem" }}>
            {weather.weather[0].description}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "1rem" }}>
            <div>
              <p>🌡️ Feels like</p>
              <p style={{ fontWeight: "bold" }}>{Math.round(weather.main.feels_like)}{tempUnit}</p>
            </div>
            <div>
              <p>💧 Humidity</p>
              <p style={{ fontWeight: "bold" }}>{weather.main.humidity}%</p>
            </div>
            <div>
              <p>💨 Wind</p>
              <p style={{ fontWeight: "bold" }}>{weather.wind.speed} {speedUnit}</p>
            </div>
            <div>
              <p>🔽 Pressure</p>
              <p style={{ fontWeight: "bold" }}>{weather.main.pressure} hPa</p>
            </div>
          </div>
        </div>
      )}

      {forecast.length > 0 && !loading && (
        <div className="forecast">
          <h3>5-Day Forecast</h3>
          <div className="forecast-grid">
            {forecast.map((day, idx) => (
              <div key={idx} className="forecast-card">
                <p style={{ fontWeight: "bold" }}>
                  {new Date(day.dt_txt).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <img
                  className="forecast-icon"
                  src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                  alt="forecast icon"
                />
                <p style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                  {Math.round(day.main.temp)}{tempUnit}
                </p>
                <p className="desc" style={{ textTransform: "capitalize" }}>
                  {day.weather[0].description}
                </p>
                <p style={{ fontSize: "0.75rem", marginTop: "0.5rem" }}>
                  💧 {day.main.humidity}%
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default WeatherApp;*/
/*
import { useState, useEffect } from "react";
import "./WeatherApp.css";

function WeatherApp() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const [unit, setUnit] = useState("metric"); // metric or imperial

  // Check for saved theme preference
  useEffect(() => {
    const saved = window.savedTheme || "dark";
    setDarkMode(saved === "dark");
  }, []);

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    window.savedTheme = newMode ? "dark" : "light";
  };

  const toggleUnit = () => {
    setUnit(unit === "metric" ? "imperial" : "metric");
  };

  const fetchWeatherByCity = async (cityName) => {
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
    
    setLoading(true);
    setError("");
    
    try {
      // Current weather
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          cityName
        )}&appid=${apiKey}&units=${unit}`
      );
      const data = await res.json();

      if (data.cod !== 200) {
        setError(data.message || "City not found. Please try again.");
        setWeather(null);
        setForecast([]);
        setLoading(false);
        return;
      }
      setWeather(data);

      // 5-day forecast
      const res2 = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
          cityName
        )}&appid=${apiKey}&units=${unit}`
      );
      const data2 = await res2.json();

      // Get one forecast per day at noon
      const daily = [];
      const map = {};
      data2.list.forEach((item) => {
        const date = item.dt_txt.split(" ")[0];
        if (!map[date] && item.dt_txt.includes("12:00:00")) {
          map[date] = true;
          daily.push(item);
        }
      });

      setForecast(daily);
    } catch (err) {
      console.error(err);
      setError("Error fetching weather. Please check your connection.");
    }
    setLoading(false);
  };

  const fetchWeatherByLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setLoading(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

        try {
          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${unit}`
          );
          const data = await res.json();

          if (data.cod !== 200) {
            setError("Could not fetch weather for your location");
            setLoading(false);
            return;
          }

          setWeather(data);
          setCity(data.name);

          // Fetch forecast
          const res2 = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${unit}`
          );
          const data2 = await res2.json();

          const daily = [];
          const map = {};
          data2.list.forEach((item) => {
            const date = item.dt_txt.split(" ")[0];
            if (!map[date] && item.dt_txt.includes("12:00:00")) {
              map[date] = true;
              daily.push(item);
            }
          });

          setForecast(daily);
        } catch (err) {
          console.error(err);
          setError("Error fetching weather for your location");
        }
        setLoading(false);
      },
      (error) => {
        setError("Unable to retrieve your location");
        setLoading(false);
      }
    );
  };

  const handleSearch = () => {
    if (!city.trim()) {
      setError("Please enter a city name");
      return;
    }
    fetchWeatherByCity(city);
  };

  const tempUnit = unit === "metric" ? "°C" : "°F";
  const speedUnit = unit === "metric" ? "m/s" : "mph";

  return (
    <div className={`app ${darkMode ? "dark" : "light"}`}>
      <div style={{ position: "absolute", top: "1rem", right: "1rem", display: "flex", gap: "0.5rem" }}>
        <button
          onClick={toggleTheme}
          style={{
            padding: "8px 16px",
            borderRadius: "20px",
            border: "none",
            background: "rgba(255,255,255,0.2)",
            color: darkMode ? "#fff" : "#222",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
        <button
          onClick={toggleUnit}
          style={{
            padding: "8px 16px",
            borderRadius: "20px",
            border: "none",
            background: "rgba(255,255,255,0.2)",
            color: darkMode ? "#fff" : "#222",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          {unit === "metric" ? "°F" : "°C"}
        </button>
      </div>

      <h1 className="title">🌤 Weather App</h1>

      <div className="search-box">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city..."
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button onClick={handleSearch}>Search</button>
        <button
          onClick={fetchWeatherByLocation}
          style={{
            padding: "10px 20px",
            borderRadius: "20px",
            border: "none",
            background: "#4caf50",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
          }}
          title="Use my location"
        >
          📍
        </button>
      </div>

      {loading && <p className="loading">Loading weather data...</p>}
      {error && (
        <div style={{
          textAlign: "center",
          color: "#ff5252",
          background: "rgba(255,82,82,0.1)",
          padding: "1rem",
          borderRadius: "10px",
          maxWidth: "400px",
          margin: "1rem auto",
        }}>
          {error}
        </div>
      )}

      {weather && !loading && (
        <div className="weather-card">
          <h2>{weather.name}, {weather.sys.country}</h2>
          <img
            className="weather-icon"
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt="weather icon"
          />
          <h1 style={{ fontSize: "3rem", margin: "0.5rem 0" }}>
            {Math.round(weather.main.temp)}{tempUnit}
          </h1>
          <p style={{ textTransform: "capitalize", fontSize: "1.2rem" }}>
            {weather.weather[0].description}
          </p>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "1fr 1fr", 
            gap: "1rem", 
            marginTop: "1.5rem",
            textAlign: "left"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontSize: "1.5rem" }}>🌡️</span>
              <div>
                <p style={{ margin: 0, fontSize: "0.85rem", opacity: 0.8 }}>Feels like</p>
                <p style={{ margin: 0, fontWeight: "bold", fontSize: "1.1rem" }}>
                  {Math.round(weather.main.feels_like)}{tempUnit}
                </p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontSize: "1.5rem" }}>💧</span>
              <div>
                <p style={{ margin: 0, fontSize: "0.85rem", opacity: 0.8 }}>Humidity</p>
                <p style={{ margin: 0, fontWeight: "bold", fontSize: "1.1rem" }}>
                  {weather.main.humidity}%
                </p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontSize: "1.5rem" }}>💨</span>
              <div>
                <p style={{ margin: 0, fontSize: "0.85rem", opacity: 0.8 }}>Wind</p>
                <p style={{ margin: 0, fontWeight: "bold", fontSize: "1.1rem" }}>
                  {weather.wind.speed} {speedUnit}
                </p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontSize: "1.5rem" }}>🔽</span>
              <div>
                <p style={{ margin: 0, fontSize: "0.85rem", opacity: 0.8 }}>Pressure</p>
                <p style={{ margin: 0, fontWeight: "bold", fontSize: "1.1rem" }}>
                  {weather.main.pressure} hPa
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {forecast.length > 0 && !loading && (
        <div className="forecast">
          <h3>5-Day Forecast</h3>
          <div className="forecast-grid">
            {forecast.map((day, idx) => (
              <div key={idx} className="forecast-card">
                <p style={{ fontWeight: "bold" }}>
                  {new Date(day.dt_txt).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <img
                  className="forecast-icon"
                  src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                  alt="forecast icon"
                />
                <p style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                  {Math.round(day.main.temp)}{tempUnit}
                </p>
                <p className="desc" style={{ textTransform: "capitalize" }}>
                  {day.weather[0].description}
                </p>
                <p style={{ fontSize: "0.75rem", marginTop: "0.5rem" }}>
                  💧 {day.main.humidity}%
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default WeatherApp;*/

import { useState, useEffect } from "react";
import "./WeatherApp.css";

function WeatherApp() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const [unit, setUnit] = useState("metric"); // metric or imperial

  // Check for saved theme preference
  useEffect(() => {
    const saved = window.savedTheme || "dark";
    setDarkMode(saved === "dark");
  }, []);

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    window.savedTheme = newMode ? "dark" : "light";
  };

  const toggleUnit = () => {
    setUnit(unit === "metric" ? "imperial" : "metric");
  };

  const fetchWeatherByCity = async (cityName) => {
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
    
    setLoading(true);
    setError("");
    
    try {
      // Current weather
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          cityName
        )}&appid=${apiKey}&units=${unit}`
      );
      const data = await res.json();

      if (data.cod !== 200) {
        setError(data.message || "City not found. Please try again.");
        setWeather(null);
        setForecast([]);
        setLoading(false);
        return;
      }
      setWeather(data);

      // 5-day forecast
      const res2 = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
          cityName
        )}&appid=${apiKey}&units=${unit}`
      );
      const data2 = await res2.json();

      // Get one forecast per day at noon
      const daily = [];
      const map = {};
      data2.list.forEach((item) => {
        const date = item.dt_txt.split(" ")[0];
        if (!map[date] && item.dt_txt.includes("12:00:00")) {
          map[date] = true;
          daily.push(item);
        }
      });

      setForecast(daily);
    } catch (err) {
      console.error(err);
      setError("Error fetching weather. Please check your connection.");
    }
    setLoading(false);
  };

  const fetchWeatherByLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setLoading(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

        try {
          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${unit}`
          );
          const data = await res.json();

          if (data.cod !== 200) {
            setError("Could not fetch weather for your location");
            setLoading(false);
            return;
          }

          setWeather(data);
          setCity(data.name);

          // Fetch forecast
          const res2 = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${unit}`
          );
          const data2 = await res2.json();

          const daily = [];
          const map = {};
          data2.list.forEach((item) => {
            const date = item.dt_txt.split(" ")[0];
            if (!map[date] && item.dt_txt.includes("12:00:00")) {
              map[date] = true;
              daily.push(item);
            }
          });

          setForecast(daily);
        } catch (err) {
          console.error(err);
          setError("Error fetching weather for your location");
        }
        setLoading(false);
      },
      (error) => {
        setError("Unable to retrieve your location");
        setLoading(false);
      }
    );
  };

  const handleSearch = () => {
    if (!city.trim()) {
      setError("Please enter a city name");
      return;
    }
    fetchWeatherByCity(city);
  };

  const tempUnit = unit === "metric" ? "°C" : "°F";
  const speedUnit = unit === "metric" ? "m/s" : "mph";

  return (
    <div className={`app ${darkMode ? "dark" : "light"}`}>
      <div style={{ 
        position: "absolute", 
        top: "0.5rem", 
        right: "0.5rem", 
        display: "flex", 
        gap: "0.3rem",
        zIndex: 10
      }}>
        <button
          onClick={toggleTheme}
          style={{
            padding: "6px 12px",
            borderRadius: "20px",
            border: "none",
            background: "rgba(255,255,255,0.2)",
            color: darkMode ? "#fff" : "#222",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "1.2rem",
          }}
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
        <button
          onClick={toggleUnit}
          style={{
            padding: "6px 12px",
            borderRadius: "20px",
            border: "none",
            background: "rgba(255,255,255,0.2)",
            color: darkMode ? "#fff" : "#222",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "0.9rem",
          }}
        >
          {unit === "metric" ? "°F" : "°C"}
        </button>
      </div>

      <h1 className="title">🌤 Weather App</h1>

      <div className="search-box">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city..."
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button onClick={handleSearch}>Search</button>
        <button
          onClick={fetchWeatherByLocation}
          style={{
            padding: "10px 20px",
            borderRadius: "20px",
            border: "none",
            background: "#4caf50",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
          }}
          title="Use my location"
        >
          📍
        </button>
      </div>

      {loading && <p className="loading">Loading weather data...</p>}
      {error && (
        <div style={{
          textAlign: "center",
          color: "#ff5252",
          background: "rgba(255,82,82,0.1)",
          padding: "1rem",
          borderRadius: "10px",
          maxWidth: "400px",
          margin: "1rem auto",
        }}>
          {error}
        </div>
      )}

      {weather && !loading && (
        <div className="weather-card">
          <h2>{weather.name}, {weather.sys.country}</h2>
          <img
            className="weather-icon"
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt="weather icon"
          />
          <h1 style={{ fontSize: "2.5rem", margin: "0.5rem 0" }}>
            {Math.round(weather.main.temp)}{tempUnit}
          </h1>
          <p style={{ textTransform: "capitalize", fontSize: "1rem", margin: "0.5rem 0" }}>
            {weather.weather[0].description}
          </p>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "1fr 1fr", 
            gap: "0.8rem", 
            marginTop: "1rem",
            textAlign: "left",
            fontSize: "0.9rem"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontSize: "1.3rem" }}>🌡️</span>
              <div>
                <p style={{ margin: 0, fontSize: "0.75rem", opacity: 0.8 }}>Feels like</p>
                <p style={{ margin: 0, fontWeight: "bold", fontSize: "1rem" }}>
                  {Math.round(weather.main.feels_like)}{tempUnit}
                </p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontSize: "1.3rem" }}>💧</span>
              <div>
                <p style={{ margin: 0, fontSize: "0.75rem", opacity: 0.8 }}>Humidity</p>
                <p style={{ margin: 0, fontWeight: "bold", fontSize: "1rem" }}>
                  {weather.main.humidity}%
                </p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontSize: "1.3rem" }}>💨</span>
              <div>
                <p style={{ margin: 0, fontSize: "0.75rem", opacity: 0.8 }}>Wind</p>
                <p style={{ margin: 0, fontWeight: "bold", fontSize: "1rem" }}>
                  {weather.wind.speed} {speedUnit}
                </p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontSize: "1.3rem" }}>🔽</span>
              <div>
                <p style={{ margin: 0, fontSize: "0.75rem", opacity: 0.8 }}>Pressure</p>
                <p style={{ margin: 0, fontWeight: "bold", fontSize: "1rem" }}>
                  {weather.main.pressure} hPa
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {forecast.length > 0 && !loading && (
        <div className="forecast">
          <h3>5-Day Forecast</h3>
          <div className="forecast-grid">
            {forecast.map((day, idx) => (
              <div key={idx} className="forecast-card">
                <p style={{ fontWeight: "bold" }}>
                  {new Date(day.dt_txt).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <img
                  className="forecast-icon"
                  src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                  alt="forecast icon"
                />
                <p style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                  {Math.round(day.main.temp)}{tempUnit}
                </p>
                <p className="desc" style={{ textTransform: "capitalize" }}>
                  {day.weather[0].description}
                </p>
                <p style={{ fontSize: "0.75rem", marginTop: "0.5rem" }}>
                  💧 {day.main.humidity}%
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default WeatherApp;