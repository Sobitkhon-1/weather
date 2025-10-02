import { useState } from "react";

export default function SearchBar({ setWeather }) {
  const [city, setCity] = useState("");

  const fetchWeather = async () => {
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    const res = await fetch(url);
    const data = await res.json();
    setWeather(data);
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter city..."
        className="flex-grow p-3 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 placeholder-gray-200 text-white focus:outline-none"
      />
      <button
        onClick={fetchWeather}
        className="px-5 py-3 bg-white/30 rounded-xl backdrop-blur-md border border-white/40 hover:bg-white/40 transition"
      >
        Search
      </button>
    </div>
  );
}
