import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const StakingModal = ({ isOpen, onClose, onStake, account }) => {
    const [amount, setAmount] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleStake = async () => {
        setIsLoading(true);
        try {
            await onStake(amount); // Call service
            onClose();
        } catch (e) {
            console.error("Staking failed", e);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100
        }}>
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="glass-panel"
                style={{ width: '400px', maxWidth: '90%' }}
            >
                <h2 style={{ marginBottom: '1rem' }}>Stake ALGO</h2>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Amount (ALGO)</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.8rem',
                            background: 'rgba(0,0,0,0.3)',
                            border: '1px solid var(--glass-border)',
                            color: 'white',
                            borderRadius: '8px',
                            fontSize: '1.1rem'
                        }}
                        placeholder="0.00"
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginTop: '0.5rem', color: 'var(--text-muted)' }}>
                        <span>Available: 2450.00 ALGO</span>
                        <span>Fee: 0.001 ALGO</span>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={onClose}
                        style={{ flex: 1, background: 'transparent', border: '1px solid var(--secondary)', color: 'var(--text-muted)' }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleStake}
                        disabled={!amount || isLoading}
                        style={{
                            flex: 1,
                            background: 'var(--primary)',
                            border: 'none',
                            color: 'white',
                            opacity: (!amount || isLoading) ? 0.5 : 1
                        }}
                    >
                        {isLoading ? 'Signing...' : 'Confirm Stake'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default StakingModal;
