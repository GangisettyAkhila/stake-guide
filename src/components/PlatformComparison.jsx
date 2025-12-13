import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';

const PlatformComparison = () => {
    const [platforms, setPlatforms] = useState([]);
    const { sendMessage } = useAppStore();

    useEffect(() => {
        fetch('http://localhost:3000/api/recommendations')
            .then(res => res.json())
            .then(data => setPlatforms(data))
            .catch(err => console.error("Failed to load platforms", err));
    }, []);

    const handleStakeClick = (platformName) => {
        // Trigger the staking flow via the store/chat
        // We set the step directly or ask the chat to do it
        useAppStore.setState({ currentStep: 'STAKING_INPUT' });
        // Optionally notify chat context
        sendMessage(`I selected ${platformName}`, 'stake_intent');
    };

    return (
        <div className="fade-in">
            <header style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem' }}>Top Recommendations</h1>
                <p style={{ color: 'var(--text-muted)' }}>Real-time opportunities based on your profile.</p>
            </header>

            <div className="glass-panel">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)', textAlign: 'left' }}>
                            <th style={{ padding: '1rem' }}>Platform</th>
                            <th style={{ padding: '1rem' }}>Type</th>
                            <th style={{ padding: '1rem' }}>APY</th>
                            <th style={{ padding: '1rem' }}>Risk Level</th>
                            <th style={{ padding: '1rem' }}>Lock Period</th>
                            <th style={{ padding: '1rem' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {platforms.map(p => (
                            <tr key={p.id} style={{ borderBottom: '1px solid var(--glass-border)', background: p.recommend ? 'rgba(59, 130, 246, 0.05)' : 'transparent' }}>
                                <td style={{ padding: '1rem' }}>
                                    {p.name}
                                    <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>{p.description}</div>
                                    <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                                        {p.recommend && <span style={{ fontSize: '0.7rem', background: 'var(--primary)', padding: '2px 6px', borderRadius: '4px' }}>AI PICK</span>}
                                        {p.isHighYield && <span style={{ fontSize: '0.7rem', background: '#22c55e', color: 'white', padding: '2px 6px', borderRadius: '4px' }}>🔥 HIGH YIELD</span>}
                                    </div>
                                </td>
                                <td style={{ padding: '1rem' }}>{p.type}</td>
                                <td style={{ padding: '1rem', color: 'var(--success)', fontWeight: 'bold' }}>{p.apy}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        color: p.risk === 'High' ? 'var(--danger)' : p.risk === 'Medium' ? 'var(--warning)' : 'var(--success)'
                                    }}>
                                        {p.risk}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem' }}>{p.lock}</td>
                                <td style={{ padding: '1rem' }}>
                                    <button
                                        onClick={() => handleStakeClick(p.name)}
                                        style={{
                                            background: 'linear-gradient(to right, #60a5fa, #a855f7)',
                                            border: 'none',
                                            padding: '0.5rem 1rem',
                                            color: 'white',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            fontWeight: 'bold'
                                        }}>
                                        Stake Now
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PlatformComparison;
