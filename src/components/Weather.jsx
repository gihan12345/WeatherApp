import React, { useEffect, useRef, useState } from 'react';
import Weather from 'react-animated-weather';
import './Weather.css';
import search_icon from '../assets/search.png';

const WeatherComponent = () => {
    const inputRef = useRef();
    const [weatherData, setWeatherData] = useState(null);
    const [currentDate, setCurrentDate] = useState('');

    const formatTime = (timestamp) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const convertToFahrenheit = (celsius) => {
        return Math.floor(celsius * 9 / 5 + 32);
    };

    const search = async (city) => {
        if (city === "") {
            alert("Enter City Name");
            return;
        }
        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
            const response = await fetch(url);
            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }

            setWeatherData({
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
                temperature: Math.floor(data.main.temp),
                temperatureF: convertToFahrenheit(data.main.temp),
                location: `${data.name}, ${data.sys.country}`, // City and country
                icon: data.weather[0].icon,
                weatherType: data.weather[0].description,
                sunrise: formatTime(data.sys.sunrise),
                sunset: formatTime(data.sys.sunset),
            });

        } catch (error) {
            setWeatherData(null);
            console.error("Error in fetching weather data");
        }
    };

    useEffect(() => {
        search("London");

        // Get current date and format it
        const date = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = date.toLocaleDateString(undefined, options);
        setCurrentDate(formattedDate);
    }, []);

    const getWeatherIcon = (iconCode) => {
        const icons = {
            "01d": "CLEAR_DAY",
            "01n": "CLEAR_NIGHT",
            "02d": "PARTLY_CLOUDY_DAY",
            "02n": "PARTLY_CLOUDY_NIGHT",
            "03d": "CLOUDY",
            "03n": "CLOUDY",
            "04d": "CLOUDY",
            "04n": "CLOUDY",
            "09d": "SHOWERS",
            "09n": "SHOWERS",
            "10d": "RAIN",
            "10n": "RAIN",
            "11d": "THUNDERSTORM",
            "11n": "THUNDERSTORM",
            "13d": "SNOW",
            "13n": "SNOW",
            "50d": "FOG",
            "50n": "FOG",
        };
        return icons[iconCode] || "CLEAR_DAY";
    };

    return (
        <div>
            <h1 className='headline'>Weather App</h1> {/* Headline centered */}
            <div className='search-bar-container'>
                <div className='search-bar'>
                    <input ref={inputRef} type="text" placeholder='Search' />
                    <img src={search_icon} alt='' onClick={() => search(inputRef.current.value)} />
                </div>
            </div>
            <div className='weather'>
                <p className='location'>{weatherData?.location}</p> {/* City and country at the top-left corner */}
                <p className='current-date'>{currentDate}</p> {/* Current date at the top-right corner */}
                {weatherData ? (
                    <>
                        <Weather
                            icon={getWeatherIcon(weatherData.icon)}
                            color='#FFFF00' // Set icon color to yellow
                            size={150}
                            animate={true}
                            className='weather-icon' // Add class to icon for additional styling if needed
                        />
                        <p className='temperature'>
                            <span className='temp'>{weatherData.temperature}°C / {weatherData.temperatureF}°F</span>
                            <span className='weather-type'>{weatherData.weatherType}</span>
                        </p>
                        <div className='weather-details'>
                            <div className='weather-data'>
                                <div className='col'>
                                    <p>{weatherData.humidity}%</p>
                                    <span>Humidity</span>
                                </div>
                                <div className='col'>
                                    <p>{weatherData.windSpeed} km/h</p>
                                    <span>Wind Speed</span>
                                </div>
                            </div>
                            <hr className='line-separator'/>
                            <div className='sunrise-sunset'>
                                <div className='col'>
                                    <p>{weatherData.sunrise}</p>
                                    <span>Sunrise</span>
                                </div>
                                <div className='col'>
                                    <p>{weatherData.sunset}</p>
                                    <span>Sunset</span>
                                </div>
                            </div>
                        </div>
                    </>
                ) : <p>Loading...</p>}
            </div>
        </div>
    );
};

export default WeatherComponent;
