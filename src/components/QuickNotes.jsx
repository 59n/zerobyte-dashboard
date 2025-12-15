import { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';

const QuickNotes = () => {
    const [note, setNote] = useState(() => {
        return localStorage.getItem('homepage_notes') || 'Start typing notes here...';
    });

    useEffect(() => {
        localStorage.setItem('homepage_notes', note);
    }, [note]);

    return (
        <div style={{
            backgroundColor: 'transparent',
            border: '1px solid var(--border-color)',
            borderRadius: '4px',
            padding: '1.5rem',
            width: '100%',
            height: '100%',
            minHeight: '150px',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem'
            }}>
                <div className="text-secondary text-xs" style={{ letterSpacing: '0.1em' }}>
                    notes
                </div>
                <button
                    onClick={() => setNote('')}
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                        color: 'var(--text-secondary)',
                        transition: 'color 0.2s',
                        display: 'flex',
                        alignItems: 'center'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-color)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                    title="Clear notes"
                >
                    <Trash2 size={14} />
                </button>
            </div>

            <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                spellCheck="false"
                style={{
                    flex: 1,
                    backgroundColor: 'transparent',
                    border: 'none',
                    resize: 'none',
                    outline: 'none',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-family)',
                    fontSize: '0.9rem',
                    lineHeight: '1.6',
                    width: '100%'
                }}
            />
        </div>
    );
};

export default QuickNotes;
