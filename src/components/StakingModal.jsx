import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const StakingModal = ({ isOpen, onClose, onStake, account }) => {
    const [amount, setAmount] = useState('');
    const [sender, setSender] = useState('');
    const [fee, setFee] = useState('0.001');
    const [rewards, setRewards] = useState('0.00');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen && account) {
            setSender(account);
        }
    }, [isOpen, account]);

    const handleAmountChange = (e) => {
        const val = e.target.value;
        setAmount(val);
        // Estimate: 12% APY
        if (val && !isNaN(val)) {
            setRewards((parseFloat(val) * 0.12).toFixed(2));
        } else {
            setRewards('0.00');
        }
    };

    const handleStake = async () => {
        setIsLoading(true);
        try {
            // Pass all user-defined parameters to the service
            await onStake(amount, sender, fee);
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
                style={{ width: '450px', maxWidth: '90%' }}
            >
                <h2 style={{ marginBottom: '1.5rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    Stake ALGO
                    <span style={{ fontSize: '0.7rem', background: 'var(--warning)', color: 'black', padding: '2px 6px', borderRadius: '4px', verticalAlign: 'middle' }}>TESTNET</span>
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>

                    {/* Sender Address */}
                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Sender Wallet Address</label>
                        <input
                            type="text"
                            value={sender}
                            readOnly
                            style={{
                                width: '100%',
                                padding: '0.6rem',
                                background: 'rgba(0,0,0,0.1)', // Dimmed
                                border: '1px solid var(--glass-border)',
                                borderRadius: '6px',
                                color: 'var(--text-muted)', // Muted text
                                fontSize: '0.9rem',
                                fontFamily: 'monospace',
                                cursor: 'not-allowed'
                            }}
                        />
                    </div>

                    {/* Amount */}
                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Amount to Stake (ALGO)</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={handleAmountChange}
                            style={{ width: '100%', padding: '0.6rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--primary)', borderRadius: '6px', color: 'white', fontSize: '1.1rem', fontWeight: 'bold' }}
                            placeholder="0.00"
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        {/* Gas Fee */}
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Gas Fee (ALGO)</label>
                            <input
                                type="text"
                                value={fee}
                                onChange={(e) => setFee(e.target.value)}
                                style={{ width: '100%', padding: '0.6rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', borderRadius: '6px', color: 'var(--warning)', fontSize: '0.9rem' }}
                            />
                        </div>

                        {/* Rewards */}
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Est. Annual Rewards</label>
                            <div style={{ width: '100%', padding: '0.6rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', borderRadius: '6px', color: 'var(--success)', fontSize: '0.9rem', fontWeight: 'bold' }}>
                                {rewards} ALGO
                            </div>
                        </div>
                    </div>

                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={onClose}
                        style={{ flex: 1, background: 'transparent', border: '1px solid var(--secondary)', color: 'var(--text-muted)', borderRadius: '8px', padding: '0.8rem' }}
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
                            opacity: (!amount || isLoading) ? 0.5 : 1,
                            borderRadius: '8px',
                            fontWeight: 'bold',
                            padding: '0.8rem'
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
