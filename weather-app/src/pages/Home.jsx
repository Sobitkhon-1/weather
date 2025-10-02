import { useState } from "react";
import SearchBar from "../components/SearchBar";
import WeatherCard from "../components/WeatherCard";

export default function Home() {
  const [weather, setWeather] = useState(null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 text-white">
      <div className="w-full max-w-xl p-6">
        <h1 className="text-4xl font-bold text-center mb-6 drop-shadow-lg">🌤 Weather App</h1>
        
        <SearchBar setWeather={setWeather} />
        
        {weather && (
          <div className="mt-6">
            <WeatherCard data={weather} />
          </div>
        )}
      </div>
    </div>
  );
}
