import React from 'react';

const RiskSelector = ({ currentRisk, setRisk }) => {
    const risks = ['Low', 'Medium', 'High'];

    return (
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--secondary-color)', marginBottom: '1rem' }}>Select your risk tolerance:</p>
            <div style={{ display: 'inline-flex', gap: '0.5rem', background: 'var(--glass-bg)', padding: '0.5rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                {risks.map((level) => (
                    <button
                        key={level}
                        onClick={() => setRisk(level)}
                        style={{
                            padding: '0.5rem 1.5rem',
                            borderRadius: '8px',
                            background: currentRisk === level ? 'var(--primary-color)' : 'transparent',
                            color: currentRisk === level ? 'white' : 'var(--secondary-color)',
                            fontWeight: 600
                        }}
                    >
                        {level}
                    </button>
                ))}
                <button
                    onClick={() => setRisk('All')}
                    style={{
                        padding: '0.5rem 1.5rem',
                        borderRadius: '8px',
                        background: currentRisk === 'All' ? 'var(--primary-color)' : 'transparent',
                        color: currentRisk === 'All' ? 'white' : 'var(--secondary-color)',
                        fontWeight: 600
                    }}
                >
                    All
                </button>
            </div>
        </div>
    );
};

export default RiskSelector;
