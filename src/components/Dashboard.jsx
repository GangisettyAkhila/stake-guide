import { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const { dashboardData, fetchDashboard, account } = useAppStore();

    useEffect(() => {
        if (account) {
            fetchDashboard();
        }
    }, [account]);

    if (!dashboardData) return <div className="fade-in" style={{ padding: '2rem', textAlign: 'center' }}>Loading Dashboard...</div>;

    const { totalStaked, rewardsEarned, apy, transactions } = dashboardData;

    return (
        <div className="dashboard-container fade-in">
            <header style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem' }}>Staking Dashboard</h1>
                <p style={{ color: 'var(--text-muted)' }}>Welcome back, {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Guest'}</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <StatsCard label="Total Staked" value={`${totalStaked} ALGO`} icon="🔒" />
                <StatsCard label="Rewards Earned" value={`${rewardsEarned} ALGO`} icon="🌟" highlight />
                <StatsCard label="Average APY" value={`${apy}%`} icon="📈" />
            </div>

            <div className="glass-panel">
                <h3 style={{ marginBottom: '1rem' }}>Transaction History</h3>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)', textAlign: 'left' }}>
                                <th style={{ padding: '1rem' }}>Type</th>
                                <th style={{ padding: '1rem' }}>Amount</th>
                                <th style={{ padding: '1rem' }}>Date</th>
                                <th style={{ padding: '1rem' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.length === 0 ? (
                                <tr><td colSpan="4" style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>No transactions found.</td></tr>
                            ) : transactions.map(tx => (
                                <tr key={tx.txId} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                    <td style={{ padding: '1rem' }}>{tx.type}</td>
                                    <td style={{ padding: '1rem' }}>{tx.amount} ALGO</td>
                                    <td style={{ padding: '1rem' }}>{new Date(tx.timestamp).toLocaleDateString()}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '20px',
                                            fontSize: '0.85rem',
                                            background: 'rgba(16, 185, 129, 0.2)',
                                            color: 'var(--success)'
                                        }}>
                                            {tx.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const StatsCard = ({ label, value, icon, highlight }) => (
    <motion.div
        className="glass-panel"
        whileHover={{ y: -5 }}
        style={{ border: highlight ? '1px solid var(--primary-glow)' : undefined }}
    >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{label}</span>
            <span style={{ fontSize: '1.5rem' }}>{icon}</span>
        </div>
        <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: highlight ? 'var(--primary)' : 'white' }}>
            {value}
        </div>
    </motion.div>
);

export default Dashboard;
