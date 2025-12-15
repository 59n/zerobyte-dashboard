import { useState, useEffect } from 'react';
import { X, Save, Settings } from 'lucide-react';

const SettingsModal = ({ isOpen, onClose, onSave, initialConfig }) => {
    const [config, setConfig] = useState(initialConfig);

    useEffect(() => {
        if (isOpen) {
            setConfig(initialConfig);
        }
    }, [isOpen, initialConfig]);

    if (!isOpen) return null;

    const handleChange = (section, key, value) => {
        setConfig(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [key]: value
            }
        }));
    };

    const handleTickerChange = (index, value) => {
        const newTickers = [...config.market.tickers];
        newTickers[index] = value.toUpperCase();
        handleChange('market', 'tickers', newTickers);
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        }}>
            <div style={{
                backgroundColor: '#0a0a0a',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                width: '100%',
                maxWidth: '400px',
                padding: '1.5rem',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Settings size={18} /> Settings
                    </h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                        <X size={20} />
                    </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Weather Section */}
                    <div>
                        <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Weather Coords
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '0.25rem', color: 'var(--text-secondary)' }}>Latitude</label>
                                <input
                                    type="text"
                                    value={config.weather.lat}
                                    onChange={(e) => handleChange('weather', 'lat', e.target.value)}
                                    style={{
                                        width: '100%',
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid var(--border-color)',
                                        padding: '0.5rem',
                                        borderRadius: '4px',
                                        color: 'var(--text-primary)',
                                        fontFamily: 'monospace'
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '0.25rem', color: 'var(--text-secondary)' }}>Longitude</label>
                                <input
                                    type="text"
                                    value={config.weather.long}
                                    onChange={(e) => handleChange('weather', 'long', e.target.value)}
                                    style={{
                                        width: '100%',
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid var(--border-color)',
                                        padding: '0.5rem',
                                        borderRadius: '4px',
                                        color: 'var(--text-primary)',
                                        fontFamily: 'monospace'
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Market Section */}
                    <div>
                        <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Market Data
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '0.25rem', color: 'var(--text-secondary)' }}>Finnhub API Key</label>
                                <input
                                    type="password"
                                    value={config.market.apiKey}
                                    onChange={(e) => handleChange('market', 'apiKey', e.target.value)}
                                    placeholder="Enter API Key"
                                    style={{
                                        width: '100%',
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid var(--border-color)',
                                        padding: '0.5rem',
                                        borderRadius: '4px',
                                        color: 'var(--text-primary)',
                                        fontFamily: 'monospace'
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '0.25rem', color: 'var(--text-secondary)' }}>Tickers (Max 3)</label>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                                    {[0, 1, 2].map((i) => (
                                        <input
                                            key={i}
                                            type="text"
                                            value={config.market.tickers[i] || ''}
                                            onChange={(e) => handleTickerChange(i, e.target.value)}
                                            placeholder={`SYM${i + 1}`}
                                            maxLength={20}
                                            style={{
                                                width: '100%',
                                                background: 'rgba(255,255,255,0.05)',
                                                border: '1px solid var(--border-color)',
                                                padding: '0.5rem',
                                                borderRadius: '4px',
                                                color: 'var(--text-primary)',
                                                fontFamily: 'monospace',
                                                textAlign: 'center',
                                                textTransform: 'uppercase'
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'transparent',
                            border: '1px solid var(--border-color)',
                            color: 'var(--text-secondary)',
                            padding: '0.5rem 1rem',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.85rem'
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onSave(config)}
                        style={{
                            background: 'var(--accent-color)',
                            border: 'none',
                            color: 'black',
                            padding: '0.5rem 1rem',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        <Save size={16} /> Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
