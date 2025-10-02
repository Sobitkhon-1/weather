export default function WeatherCard({ data }) {
  return (
    <div className="bg-white/20 backdrop-blur-md p-6 rounded-2xl shadow-xl text-center border border-white/30">
      <h2 className="text-3xl font-semibold">{data.name}</h2>
      <p className="text-lg capitalize">{data.weather[0].description}</p>

      <div className="flex justify-center items-center mt-4 gap-6">
        <img 
          src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`} 
          alt="weather-icon"
          className="w-24 h-24"
        />
        <p className="text-6xl font-bold">{Math.round(data.main.temp)}°C</p>
      </div>

      <div className="flex justify-between mt-4 text-sm">
        <p>💧 Humidity: {data.main.humidity}%</p>
        <p>💨 Wind: {data.wind.speed} m/s</p>
      </div>
    </div>
  );
}
