import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Loader2 } from 'lucide-react';

const MarketTicker = ({ apiKey, symbols = [] }) => {
    const [marketData, setMarketData] = useState({});
    const [loading, setLoading] = useState(true);

    const fetchPrice = async (symbol) => {
        if (!apiKey) return null;
        try {
            const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`);
            const data = await response.json();
            return {
                symbol,
                price: data.c, // Current price
                change: data.dp // Percent change
            };
        } catch (error) {
            console.error('Error fetching market data:', error);
            return null;
        }
    };

    useEffect(() => {
        if (!apiKey) {
            setLoading(false);
            return;
        }

        const updateMarketData = async () => {
            // Only show loading on initial fetch if we have no data
            // or if we explicitly want to indicate a refresh (optional, usually subtle)
            // For now, trust the initial setLoading(true) from the dependency change

            const results = await Promise.all(symbols.map(sym => fetchPrice(sym)));
            const newData = {};
            results.forEach(res => {
                if (res && res.price !== undefined) {
                    newData[res.symbol] = res;
                }
            });

            setMarketData(prev => ({ ...prev, ...newData }));
            setLoading(false);
        };

        setLoading(true);
        updateMarketData();
        const interval = setInterval(updateMarketData, 60000); // 60s refresh
        return () => clearInterval(interval);
    }, [apiKey, JSON.stringify(symbols)]);

    if (loading && Object.keys(marketData).length === 0) return (
        <div style={{
            backgroundColor: 'transparent',
            border: '1px solid var(--border-color)',
            borderRadius: '4px',
            padding: '1rem',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '160px'
        }}>
            <Loader2 className="animate-spin text-secondary" />
        </div>
    );

    return (
        <div style={{
            backgroundColor: 'transparent',
            border: '1px solid var(--border-color)',
            borderRadius: '4px',
            padding: '1rem',
            width: '100%',
            height: '160px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative'
        }}>
            <div className="text-secondary text-xs" style={{ marginBottom: '1rem', letterSpacing: '0.1em' }}>
                markets
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {symbols.map((symbol) => {
                    const data = marketData[symbol] || { price: 0, change: 0 };
                    const label = symbol.includes(':') ? symbol.split(':')[1] : symbol;

                    return (
                        <div key={symbol} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize: '0.9rem',
                            fontFamily: 'var(--font-family)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '80px' }}>
                                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                                    {label}
                                </span>
                            </div>

                            <div style={{ flex: 1, textAlign: 'right', marginRight: '2rem', fontVariantNumeric: 'tabular-nums' }}>
                                {data.price ? data.price.toFixed(2) : '---'}
                            </div>

                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                color: data.change > 0 ? 'var(--success-color)' : (data.change < 0 ? 'var(--accent-color)' : 'var(--text-secondary)'),
                                width: '60px',
                                justifyContent: 'flex-end'
                            }}>
                                {data.change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                <span>{Math.abs(data.change).toFixed(1)}%</span>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default MarketTicker;
