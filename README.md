# weather
# 🌤 Weather App

A beautiful, modern weather application built with React that provides real-time weather information and 5-day forecasts for any city worldwide.

![Weather App](https://img.shields.io/badge/React-18.x-blue)
![CSS3](https://img.shields.io/badge/CSS3-Animations-green)
![OpenWeatherMap](https://img.shields.io/badge/API-OpenWeatherMap-orange)

## ✨ Features

- 🔍 **City Search** - Search weather by city name
- 📍 **Geolocation** - Get weather for your current location with one click
- 🌡️ **Detailed Weather Info** - Temperature, feels like, humidity, wind speed, and pressure
- 📅 **5-Day Forecast** - Extended weather forecast with daily details
- 🌙 **Dark/Light Mode** - Toggle between beautiful gradient themes
- 🌡️ **Unit Toggle** - Switch between Celsius/Fahrenheit and m/s/mph
- 🎨 **Smooth Animations** - Beautiful fade-in and scale animations
- 💎 **Glassmorphism UI** - Modern frosted glass design effects
- 📱 **Responsive Design** - Works perfectly on all screen sizes

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- OpenWeatherMap API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/weather-app.git
cd weather-app
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your OpenWeatherMap API key:
```env
VITE_WEATHER_API_KEY=your_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

## 🔑 Getting an API Key

1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Generate an API key from your account dashboard
4. Add the API key to your `.env` file

## 📦 Project Structure

```
weather-app/
├── src/
│   ├── WeatherApp.jsx      # Main component
│   ├── WeatherApp.css       # Styles and animations
│   └── main.jsx             # Entry point
├── .env                     # Environment variables (API key)
├── package.json
└── README.md
```

## 🎨 Features Breakdown

### Weather Information Displayed
- Current temperature
- Weather description and icon
- "Feels like" temperature
- Humidity percentage
- Wind speed
- Atmospheric pressure

### Forecast Details
- 5-day forecast (noon data)
- Date display
- Weather icons
- Temperature
- Weather description
- Humidity levels

## 🛠️ Technologies Used

- **React** - UI library
- **Vite** - Build tool and dev server
- **OpenWeatherMap API** - Weather data provider
- **CSS3** - Styling with animations and gradients
- **Geolocation API** - Browser location access

## 🎯 Usage

1. **Search by City**: Type a city name in the search box and click "Search" or press Enter
2. **Use Current Location**: Click the 📍 button to get weather for your current location
3. **Toggle Theme**: Click the ☀️/🌙 button to switch between light and dark modes
4. **Change Units**: Click the °F/°C button to toggle between temperature units

## 🌈 Theme Options

- **Dark Mode**: Beautiful dark gradient (default)
- **Light Mode**: Fresh light blue gradient

## 📱 Responsive Design

The app is fully responsive and works seamlessly on:
- Desktop computers
- Tablets
- Mobile devices

## ⚡ Performance Features

- Smooth CSS animations
- Efficient API calls
- Loading states for better UX
- Error handling with user-friendly messages

## 🐛 Known Issues

- API rate limits apply (60 calls/minute for free tier)
- Geolocation requires HTTPS or localhost
- Some cities may have multiple matches (uses first result)

## 🔮 Future Enhancements

- [ ] Add weather alerts and warnings
- [ ] Hourly forecast display
- [ ] Save favorite cities
- [ ] Weather maps integration
- [ ] Air quality index
- [ ] Sunrise/sunset times
- [ ] Historical weather data
- [ ] Multiple language support

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 👨‍💻 Author

Your Name
- GitHub: [@yourusername](https://github.com/yourusername)

## 🙏 Acknowledgments

- Weather data provided by [OpenWeatherMap](https://openweathermap.org/)
- Icons from OpenWeatherMap
- Inspired by modern weather app designs

## 📞 Support

If you have any questions or need help, please open an issue or contact me directly.

---

Made with ❤️ and React