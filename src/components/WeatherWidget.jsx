import { useState, useEffect } from 'react';
import { CloudRain, Wind, Droplets, Sun, Cloud, Snowflake, Loader2 } from 'lucide-react';

const WeatherWidget = ({ latitude = 51.4416, longitude = 5.4697 }) => {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const res = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&wind_speed_unit=ms`
                );
                const data = await res.json();
                setWeather(data.current);
                setLoading(false);
            } catch (error) {
                console.error("Weather fetch failed:", error);
                setLoading(false);
            }
        };

        fetchWeather();
        const interval = setInterval(fetchWeather, 600000); // 10 min update
        return () => clearInterval(interval);
    }, [latitude, longitude]);

    const getWeatherIcon = (code) => {
        if (code === 0) return <Sun size={48} color="var(--accent-color)" />;
        if (code >= 1 && code <= 3) return <Cloud size={48} color="var(--text-secondary)" />;
        if (code >= 51 && code <= 67) return <CloudRain size={48} color="var(--accent-color)" />;
        if (code >= 71) return <Snowflake size={48} color="white" />;
        return <Cloud size={48} color="var(--text-secondary)" />;
    };

    const getWeatherDescription = (code) => {
        if (code === 0) return "Clear Sky";
        if (code >= 1 && code <= 3) return "Partly Cloudy";
        if (code >= 51 && code <= 67) return "Rain";
        if (code >= 71) return "Snow";
        return "Overcast";
    };

    if (loading) return (
        <div style={{
            backgroundColor: 'transparent',
            border: '1px solid var(--border-color)',
            borderRadius: '4px',
            padding: '1.5rem',
            width: '100%',
            height: '180px', // Match main container height
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <Loader2 className="animate-spin text-secondary" />
        </div>
    );

    return (
        <div style={{
            backgroundColor: 'transparent',
            border: '1px solid var(--border-color)',
            borderRadius: '4px',
            padding: '1.5rem',
            width: '100%',
            height: '180px', // Fixed height to prevent layout shift
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative'
        }}>
            <div className="text-secondary text-xs" style={{ marginBottom: '1.5rem', letterSpacing: '0.1em' }}>
                weather
            </div>

            {weather && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {getWeatherIcon(weather.weather_code)}
                        <div>
                            <div style={{ fontSize: '2.5rem', fontWeight: 300, lineHeight: 1 }}>
                                {Math.round(weather.temperature_2m)}°
                            </div>
                            <div className="text-secondary" style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                                {getWeatherDescription(weather.weather_code)}
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginLeft: 'auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                            <Wind size={14} className="text-secondary" />
                            <span>{weather.wind_speed_10m} m/s</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                            <Droplets size={14} className="text-secondary" />
                            <span>{weather.relative_humidity_2m}%</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WeatherWidget;
