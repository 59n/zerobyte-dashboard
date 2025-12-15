import { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import Clock from './components/Clock';
import LinkGrid from './components/LinkGrid';
import MarketTicker from './components/MarketTicker';
import WeatherWidget from './components/WeatherWidget';
import QuickNotes from './components/QuickNotes';
import SettingsModal from './components/SettingsModal';

function App() {
  // Default config
  const DEFAULT_CONFIG = {
    weather: { lat: '51.4416', long: '5.4697' }, // Eindhoven
    market: {
      apiKey: 'd4vmt1hr01qs25f140p0d4vmt1hr01qs25f140pg', // Default demo key
      tickers: ['AAPL', 'TSLA', 'BINANCE:EURUSDT']
    }
  };

  const [config, setConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('homepage_config');
      return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
    } catch (e) {
      console.error('Failed to parse config', e);
      return DEFAULT_CONFIG;
    }
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const updateConfig = (newConfig) => {
    setConfig(newConfig);
    localStorage.setItem('homepage_config', JSON.stringify(newConfig));
    setIsSettingsOpen(false);
  };

  return (
    <>
      <div style={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: 50 }}>
        <button
          onClick={() => setIsSettingsOpen(true)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            opacity: 0.5,
            transition: 'opacity 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.opacity = 1}
          onMouseLeave={(e) => e.target.style.opacity = 0.5}
        >
          <Settings size={20} />
        </button>
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={updateConfig}
        initialConfig={config}
      />

      <Clock />

      <LinkGrid />

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1rem',
        width: '100%',
        marginBottom: '0',
        marginTop: '1rem'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <MarketTicker
            apiKey={config.market.apiKey}
            symbols={config.market.tickers}
          />
          <WeatherWidget
            latitude={config.weather.lat}
            longitude={config.weather.long}
          />
        </div>
        <QuickNotes />
      </div>
    </>
  )
}

export default App
