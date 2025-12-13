import { useState, useMemo } from 'react';
import './App.css';
import { protocols } from './data/protocols';
import WalletConnect from './components/WalletConnect';
import RiskSelector from './components/RiskSelector';
import ProtocolCard from './components/ProtocolCard';

function App() {
  const [riskFilter, setRiskFilter] = useState('All');
  const [signer, setSigner] = useState(null);

  const filteredProtocols = useMemo(() => {
    let data = protocols;
    if (riskFilter !== 'All') {
      data = data.filter(p => p.risk === riskFilter);
    }
    // Simple ranking logic: Sort by APY descending for now
    // Or we could do a mix of APY and Risk if this was more complex.
    return data.sort((a, b) => b.apy - a.apy);
  }, [riskFilter]);

  return (
    <div className="container">
      <header className="app-header">
        <div className="logo">StakeGuide</div>
        <WalletConnect onConnect={setSigner} />
      </header>

      <main>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Maximize Your Staking Yields</h1>
          <p style={{ color: 'var(--secondary-color)', fontSize: '1.1rem' }}>
            Discover and stake with the best protocols across the ecosystem.
            <br />Safe, Transparent, and Non-Custodial.
          </p>
        </div>

        <RiskSelector currentRisk={riskFilter} setRisk={setRiskFilter} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {filteredProtocols.map(protocol => (
            <ProtocolCard key={protocol.id} protocol={protocol} signer={signer} />
          ))}
        </div>

        {filteredProtocols.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--secondary-color)' }}>
            No protocols found for this risk level.
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
