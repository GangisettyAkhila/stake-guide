import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const WalletConnect = ({ onConnect }) => {
    const [account, setAccount] = useState(null);
    const [balance, setBalance] = useState(null);
    const [error, setError] = useState('');

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const address = await signer.getAddress();
                const balance = await provider.getBalance(address);

                setAccount(address);
                setBalance(ethers.formatEther(balance));
                onConnect(signer);
                setError('');
            } catch (err) {
                console.error(err);
                setError('Connection failed');
            }
        } else {
            setError('Please install MetaMask');
        }
    };

    useEffect(() => {
        if (window.ethereum && window.ethereum.selectedAddress) {
            // Auto reconnect if already connected (optional, keeping simple for now)
        }
    }, []);

    return (
        <div className="wallet-connect">
            {account ? (
                <div className="glass-card" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ fontSize: '0.9rem' }}>
                        <span style={{ color: 'var(--secondary-color)' }}>Balance:</span> {parseFloat(balance).toFixed(4)} ETH
                    </div>
                    <div style={{ background: 'rgba(59, 130, 246, 0.2)', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.85rem', color: '#60a5fa' }}>
                        {account.slice(0, 6)}...{account.slice(-4)}
                    </div>
                </div>
            ) : (
                <button onClick={connectWallet} className="btn-primary">
                    Connect Wallet
                </button>
            )}
            {error && <div style={{ color: 'var(--high-risk)', fontSize: '0.8rem', marginTop: '0.5rem', position: 'absolute' }}>{error}</div>}
        </div>
    );
};

export default WalletConnect;
