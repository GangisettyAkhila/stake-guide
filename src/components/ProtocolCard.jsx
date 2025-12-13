import React, { useState } from 'react';
import { ethers } from 'ethers';

const ProtocolCard = ({ protocol, signer }) => {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');

    const handleStake = async () => {
        if (!signer) {
            alert('Please connect your wallet first!');
            return;
        }

        try {
            setLoading(true);
            setStatus('Initiating Transaction...');

            // DEMO: Send 0 ETH to the contract address to simulate interaction
            // In a real app, this would call a deposit() function on the contract
            const tx = await signer.sendTransaction({
                to: protocol.contractAddress,
                value: ethers.parseEther("0.0")
            });

            setStatus('Transaction Sent! Waiting for confirmation...');
            await tx.wait();
            setStatus('Success! Staked (Demo).');
        } catch (err) {
            console.error(err);
            setStatus('Transaction Failed or Rejected.');
        } finally {
            setLoading(false);
            setTimeout(() => setStatus(''), 5000);
        }
    };

    const getRiskClass = (risk) => {
        switch (risk) {
            case 'Low': return 'risk-low';
            case 'Medium': return 'risk-med';
            case 'High': return 'risk-high';
            default: return '';
        }
    };

    return (
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>{protocol.name}</h3>
                <span className={`risk-badge ${getRiskClass(protocol.risk)}`}>{protocol.risk} Risk</span>
            </div>

            <p style={{ color: 'var(--secondary-color)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                {protocol.description}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', margin: '0.5rem 0' }}>
                <div>
                    <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--secondary-color)' }}>APY</span>
                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--low-risk)' }}>{protocol.apy}%</span>
                </div>
                <div>
                    <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--secondary-color)' }}>Lock-up</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{protocol.lockup === 0 ? 'None' : `${protocol.lockup} Days`}</span>
                </div>
            </div>

            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button
                    onClick={handleStake}
                    disabled={loading}
                    className="btn-primary"
                    style={{ width: '100%', opacity: loading ? 0.7 : 1 }}
                >
                    {loading ? 'Processing...' : 'Stake Now'}
                </button>
                {status && <span style={{ fontSize: '0.8rem', textAlign: 'center', color: status.includes('Success') ? 'var(--low-risk)' : 'var(--text-color)' }}>{status}</span>}
            </div>
        </div>
    );
};

export default ProtocolCard;
