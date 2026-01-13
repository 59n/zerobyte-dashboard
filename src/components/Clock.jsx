import { useState, useEffect } from 'react';

const Clock = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }).toLowerCase();
    };

    return (
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div className="text-secondary text-xs" style={{ marginBottom: '0.5rem', letterSpacing: '0.1em' }}>
                datetime
            </div>
            <h1 style={{
                fontSize: '5rem',
                fontWeight: 300,
                lineHeight: 1,
                letterSpacing: '-0.04em',
                fontVariantNumeric: 'tabular-nums',
                color: 'var(--text-primary)'
            }}>
                {formatTime(time)}
            </h1>
            <div className="text-secondary" style={{ marginTop: '0.5rem', fontSize: '1rem' }}>
                <span style={{ color: 'var(--clock-accent)' }}>{formatDate(time).split(',')[0]}</span>
                <span>, {formatDate(time).split(',').slice(1).join(',')}</span>
            </div>
        </div>
    );
};

export default Clock;
