import { useState } from 'react';
import Splash from './components/Splash';
import ChatInterface from './components/ChatInterface';
import './App.css';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      {showSplash ? (
        <Splash onComplete={() => setShowSplash(false)} />
      ) : (
        <div style={{
          height: '100vh',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <ChatInterface />
        </div>
      )}
    </>
  );
}

export default App;
