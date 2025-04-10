import { useState, useEffect } from "react";
import axios from "axios";
import {
  WiDaySunny,
  WiRain,
  WiCloudy,
  WiStrongWind,
  WiHumidity,
} from "react-icons/wi";
import { FiSearch, FiMapPin } from "react-icons/fi";

function App() {
  const [city, setCity] = useState("İstanbul");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);

  const API_KEY = import.meta.env.VITE_API_KEY; // .env dosyasından API anahtarını al (weatherapi)
  const API_URL = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=3&lang=tr`; // 3 günlük veri

  const fetchWeather = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      setWeather(response.data);
      setSearchHistory((prev) =>
        Array.from(new Set([city, ...prev].slice(0, 5)))
      );
    } catch (error) {
      console.error("Hata:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCity(`${position.coords.latitude},${position.coords.longitude}`);
      },
      (error) => {
        alert("Konum izni reddedildi. Varsayılan: İstanbul");
        setCity("İstanbul");
      }
    );
  };

  // useEffect(() => {
  //   fetchWeather();
  // }, [city]);

  return (
    <div className="container mx-auto min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500 p-4">
      {/* Başlık ve Arama cubuğu */}
      <div className="w-full text-center mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Hava Durumu</h1>
        <div className="flex justify-center gap-2">
          <div className="relative flex-grow">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Şehir ara..."
              className="w-full p-2 pl-10 rounded-lg focus:outline-none"
            />
            <FiSearch className="absolute left-3 top-3 text-gray-500" />
          </div>
          <button
            onClick={fetchWeather}
            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
          >
            Ara
          </button>
          <button
            onClick={handleLocation}
            className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 flex items-center"
            title="Konumumu kullan"
          >
            <FiMapPin />
          </button>
        </div>
      </div>

      {/* Ana Hava Durumu Kartı */}
      {weather && (
        <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-xl p-6 w-full text-center shadow-2xl">
          <div className="mb-4">
            <h2 className="text-2xl font-semibold text-white">
              {weather.location.region}, {weather.location.country}
            </h2>
            <p className="text-white opacity-80">
              {new Date(weather.current.last_updated).toLocaleDateString(
                "tr-TR",
                { weekday: "long", hour: "2-digit", minute: "2-digit" }
              )}
            </p>
          </div>

          <div className="flex justify-center items-center gap-6 my-4">
            <div>
              {weather.current.condition.text.includes("Güneşli") && (
                <WiDaySunny className="text-7xl text-yellow-300" />
              )}
              {weather.current.condition.text.includes("Yağmur") && (
                <WiRain className="text-7xl text-blue-200" />
              )}
              {weather.current.condition.text.includes("Bulutlu") && (
                <WiCloudy className="text-7xl text-gray-300" />
              )}
            </div>
            <div>
              <p className="text-5xl font-bold text-white">
                {weather.current.temp_c}°C
              </p>
              <p className="text-white capitalize">
                {weather.current.condition.text}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-white bg-opacity-20 p-3 rounded-lg flex items-center justify-center gap-2">
              <WiHumidity className="text-xl" />
              <span>Nem: {weather.current.humidity}%</span>
            </div>
            <div className="bg-white bg-opacity-20 p-3 rounded-lg flex items-center justify-center gap-2">
              <WiStrongWind className="text-xl" />
              <span>Rüzgar: {weather.current.wind_kph} km/s</span>
            </div>
          </div>
        </div>
      )}

      {/* Arama Geçmişi */}
      {searchHistory.length > 0 && (
        <div className="mt-6 w-full text-center">
          <h3 className="text-white font-medium mb-2">Son Aramalar</h3>
          <div className="flex flex-wrap justify-center gap-2">
            {searchHistory.map((item, index) => (
              <button
                key={index}
                onClick={() => setCity(item)}
                className="bg-white bg-opacity-20 text-white px-3 py-1 rounded-full text-sm hover:bg-opacity-30 transition"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
