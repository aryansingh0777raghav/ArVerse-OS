import React, { useState, useEffect } from 'react';

export default function WeatherApp() {
  const [city, setCity] = useState('Gorakhpur');
  const [unit, setUnit] = useState('C'); // C or F
  const [searchVal, setSearchVal] = useState('');
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState({
    city: 'Gorakhpur',
    temp: 32,
    condition: 'Partly Cloudy',
    high: 35,
    low: 26,
    humidity: 78,
    wind: 12,
    uv: 9,
    visibility: 10,
    forecast: [
      { day: 'Mon', temp: 31, icon: '⛅' },
      { day: 'Tue', temp: 34, icon: '☀️' },
      { day: 'Wed', temp: 33, icon: '☀️' },
      { day: 'Thu', temp: 29, icon: '🌧️' },
      { day: 'Fri', temp: 30, icon: '🌦️' }
    ]
  });

  const generateMockWeather = (cityName) => {
    setLoading(true);
    setTimeout(() => {
      const name = cityName.charAt(0).toUpperCase() + cityName.slice(1).toLowerCase();
      
      let temp = 22;
      let condition = 'Clear Sunny';
      let humidity = 45;
      let wind = 8;
      let uv = 5;
      let forecast = [];

      // Determine climate profile based on city name matching
      if (['delhi', 'mumbai', 'gorakhpur', 'lucknow', 'chennai', 'dubai', 'cairo'].some(c => name.toLowerCase().includes(c))) {
        temp = 34 + Math.floor(Math.random() * 8);
        condition = Math.random() > 0.4 ? 'Clear Sunny' : 'Hazy Hot';
        humidity = 60 + Math.floor(Math.random() * 20);
        wind = 10 + Math.floor(Math.random() * 12);
        uv = 8 + Math.floor(Math.random() * 4);
      } else if (['london', 'paris', 'seattle', 'vancouver', 'tokyo'].some(c => name.toLowerCase().includes(c))) {
        temp = 12 + Math.floor(Math.random() * 8);
        condition = Math.random() > 0.5 ? 'Light Rain Drizzle' : 'Overcast Cloudy';
        humidity = 80 + Math.floor(Math.random() * 15);
        wind = 15 + Math.floor(Math.random() * 15);
        uv = 2 + Math.floor(Math.random() * 3);
      } else if (['moscow', 'reykjavik', 'toronto', 'oslo'].some(c => name.toLowerCase().includes(c))) {
        temp = -5 + Math.floor(Math.random() * 12);
        condition = 'Snow Blizzard';
        humidity = 85 + Math.floor(Math.random() * 10);
        wind = 20 + Math.floor(Math.random() * 20);
        uv = 0 + Math.floor(Math.random() * 2);
      } else {
        // Fallback default random weather
        temp = 18 + Math.floor(Math.random() * 10);
        condition = Math.random() > 0.5 ? 'Partly Cloudy' : 'Clear Sky';
        humidity = 50 + Math.floor(Math.random() * 20);
        wind = 5 + Math.floor(Math.random() * 10);
        uv = 4 + Math.floor(Math.random() * 3);
      }

      // Generate forecast days
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const currentDayIdx = new Date().getDay();
      
      for (let i = 1; i <= 5; i++) {
        const dName = days[(currentDayIdx + i) % 7];
        const fTemp = temp + Math.floor(Math.random() * 6 - 3);
        let fIcon = '☀️';
        if (condition.includes('Cloud')) fIcon = '⛅';
        else if (condition.includes('Rain')) fIcon = '🌧️';
        else if (condition.includes('Snow')) fIcon = '❄️';
        else if (condition.includes('Hot')) fIcon = '☀️';

        forecast.push({ day: dName, temp: fTemp, icon: fIcon });
      }

      setWeatherData({
        city: name,
        temp,
        condition,
        high: temp + Math.floor(Math.random() * 4 + 1),
        low: temp - Math.floor(Math.random() * 5 + 1),
        humidity,
        wind,
        uv,
        visibility: 10 - Math.floor(Math.random() * 4),
        forecast
      });
      setCity(name);
      setLoading(false);
    }, 800);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchVal.trim()) return;
    generateMockWeather(searchVal.trim());
    setSearchVal('');
  };

  const getTemperature = (t) => {
    if (unit === 'F') {
      return Math.round((t * 9) / 5 + 32);
    }
    return t;
  };

  // Weather theme colors
  const getThemeStyle = () => {
    const cond = weatherData.condition.toLowerCase();
    if (cond.includes('sunny') || cond.includes('hot')) {
      return {
        bg: 'linear-gradient(135deg, rgba(255, 149, 0, 0.15), rgba(255, 204, 0, 0.05))',
        border: 'rgba(255, 149, 0, 0.25)',
        accent: '#ff9500',
        weatherEmoji: '☀️'
      };
    } else if (cond.includes('rain') || cond.includes('drizzle')) {
      return {
        bg: 'linear-gradient(135deg, rgba(0, 113, 227, 0.15), rgba(48, 176, 199, 0.05))',
        border: 'rgba(0, 113, 227, 0.25)',
        accent: '#0071e7',
        weatherEmoji: '🌧️'
      };
    } else if (cond.includes('snow') || cond.includes('blizzard')) {
      return {
        bg: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(100, 210, 255, 0.05))',
        border: 'rgba(255, 255, 255, 0.25)',
        accent: '#64d2ff',
        weatherEmoji: '❄️'
      };
    }
    return {
      bg: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
      border: 'var(--panel-border)',
      accent: 'var(--accent-color)',
      weatherEmoji: '⛅'
    };
  };

  const currentTheme = getThemeStyle();

  return (
    <div className="window-content" style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--panel-bg-solid)', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', overflowY: 'auto', padding: '24px', gap: '20px' }}>
      
      {/* Search Header toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', flex: 1, maxWidth: '300px' }}>
          <input 
            type="text" 
            placeholder="Search city (e.g. London, Delhi)..." 
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            style={{
              flex: 1,
              padding: '6px 12px',
              borderRadius: '20px',
              border: '1px solid var(--panel-border)',
              background: 'rgba(0,0,0,0.15)',
              color: 'var(--text-primary)',
              fontSize: '12px',
              outline: 'none'
            }}
          />
          <button 
            type="submit" 
            style={{
              padding: '6px 12px',
              borderRadius: '20px',
              border: 'none',
              background: 'var(--accent-color)',
              color: '#fff',
              fontSize: '11px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Search
          </button>
        </form>

        <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.03)', padding: '2px', borderRadius: '20px', border: '1px solid var(--panel-border)' }}>
          <button 
            onClick={() => setUnit('C')}
            style={{ ...toggleUnitBtnStyle, background: unit === 'C' ? 'var(--accent-color)' : 'transparent', color: unit === 'C' ? '#fff' : 'var(--text-secondary)' }}
          >
            °C
          </button>
          <button 
            onClick={() => setUnit('F')}
            style={{ ...toggleUnitBtnStyle, background: unit === 'F' ? 'var(--accent-color)' : 'transparent', color: unit === 'F' ? '#fff' : 'var(--text-secondary)' }}
          >
            °F
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
          <div style={spinnerStyle} />
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Syncing microclimatic pressure data...</span>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Main Weather Card Summary */}
          <div className="glass" style={{
            padding: '24px',
            borderRadius: '16px',
            background: currentTheme.bg,
            border: `1px solid ${currentTheme.border}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h2 style={{ fontSize: '26px', fontWeight: '800', margin: '0 0 4px 0' }}>{weatherData.city}</h2>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{weatherData.condition}</span>
              <div style={{ fontSize: '48px', fontWeight: '200', color: currentTheme.accent, margin: '8px 0' }}>
                {getTemperature(weatherData.temp)}°{unit}
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                H: {getTemperature(weatherData.high)}° • L: {getTemperature(weatherData.low)}°
              </span>
            </div>
            
            <div style={{ fontSize: '64px', opacity: 0.9 }}>
              {currentTheme.weatherEmoji}
            </div>
          </div>

          {/* Core Metrics Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            <div className="glass" style={metricCardStyle}>
              <span style={metricLabelStyle}>Humidity</span>
              <span style={metricValStyle}>{weatherData.humidity}%</span>
              <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Sticky index dewpoint</span>
            </div>
            <div className="glass" style={metricCardStyle}>
              <span style={metricLabelStyle}>Wind Speed</span>
              <span style={metricValStyle}>{weatherData.wind} km/h</span>
              <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>North-Westerly breeze</span>
            </div>
            <div className="glass" style={metricCardStyle}>
              <span style={metricLabelStyle}>UV Index</span>
              <span style={metricValStyle}>{weatherData.uv}</span>
              <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>{weatherData.uv > 6 ? 'Very High UV exposure' : 'Moderate UV level'}</span>
            </div>
            <div className="glass" style={metricCardStyle}>
              <span style={metricLabelStyle}>Visibility</span>
              <span style={metricValStyle}>{weatherData.visibility} km</span>
              <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Clear atmospheric views</span>
            </div>
          </div>

          {/* 5-Day Outlook forecast panel */}
          <div className="glass" style={{ padding: '16px', borderRadius: '12px', background: 'rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>5-Day Weather Outlook</span>
            
            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
              {weatherData.forecast.map((f, idx) => (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>{f.day}</span>
                  <span style={{ fontSize: '24px' }}>{f.icon}</span>
                  <span style={{ fontSize: '13px', fontWeight: '700' }}>{getTemperature(f.temp)}°</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}

const toggleUnitBtnStyle = {
  padding: '4px 10px',
  borderRadius: '20px',
  border: 'none',
  fontSize: '11px',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.15s'
};

const metricCardStyle = {
  padding: '16px',
  borderRadius: '12px',
  background: 'rgba(0,0,0,0.05)',
  border: '1px solid var(--panel-border)',
  display: 'flex',
  flexDirection: 'column',
  gap: '4px'
};

const metricLabelStyle = {
  fontSize: '10px',
  textTransform: 'uppercase',
  color: 'var(--text-secondary)',
  fontWeight: '700'
};

const metricValStyle = {
  fontSize: '20px',
  fontWeight: '300'
};

const spinnerStyle = {
  width: '32px',
  height: '32px',
  border: '3px solid rgba(255, 255, 255, 0.1)',
  borderTop: '3px solid var(--accent-color)',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite'
};
// Add keyframes directly in document style
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`;
  document.head.appendChild(style);
}
