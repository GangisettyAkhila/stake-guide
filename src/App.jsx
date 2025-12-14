import { useEffect } from 'react';
import Splash from './components/Splash';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import PlatformComparison from './components/PlatformComparison';
import StakingModal from './components/StakingModal';
import { useAppStore } from './store/useAppStore';
import { sendStakeTransaction } from './services/algorandService';
import './App.css';

function App() {
  const { currentStep, initSession, account, recordStake } = useAppStore();

  useEffect(() => {
    initSession();
  }, []);

  const handleStake = async (amount, sender, fee) => {
    if (!account) return;
    try {
      // Use user-provided sender/fee or fallbacks
      const targetSender = sender || account;
      const txId = await sendStakeTransaction(targetSender, amount, fee);
      await recordStake({
        txId,
        amount: parseFloat(amount),
        walletAddress: account,
        platform: 'Algorand TestNet'
      });
      alert(`Algorand TestNet Transaction Successful! ID: ${txId}`);
    } catch (e) {
      alert("Transaction Failed");
    }
  };

  if (currentStep === 'SPLASH') {
    return <Splash onComplete={() => useAppStore.getState().sendMessage(null, 'next')} />;
  }

  return (
    <>
      <Layout>
        {['ONBOARDING', 'USER_TYPE_SELECTED'].includes(currentStep) && (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            <h1 className="fade-in" style={{ fontSize: '3rem', marginBottom: '1rem', background: 'linear-gradient(to right, #60a5fa, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Welcome to the Future of Staking
            </h1>
            <p className="fade-in" style={{ color: 'var(--text-muted)', maxWidth: '600px', fontSize: '1.2rem' }}>
              Connect your wallet via the AI Assistant on the right to start your personalized staking journey.
            </p>
          </div>
        )}

        {currentStep === 'DASHBOARD' && <Dashboard />}

        {currentStep === 'RECOMMENDATIONS' && <PlatformComparison />}
      </Layout>

      <StakingModal
        isOpen={currentStep === 'STAKING_INPUT'}
        onClose={() => useAppStore.setState({ currentStep: 'RECOMMENDATIONS' })}
        onStake={handleStake}
        account={account}
      />
    </>
  );
}

export default App;
