import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { connectWallet } from '../services/algorandService';
import './ChatInterface.css';

const ChatInterface = () => {
    const { messages, sendMessage, connectWallet: storeConnect, currentStep, userType } = useAppStore();
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    // Initial Greeting - Handled once
    useEffect(() => {
        const hasStarted = sessionStorage.getItem('has_started_chat');
        if (messages.length === 0 && !hasStarted) {
            sendMessage('', 'start');
            sessionStorage.setItem('has_started_chat', 'true');
        }
    }, [messages.length]); // Dependency on length safe here as we check 0

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;
        sendMessage(input);
        setInput('');
    };

    const handleAction = async (action, label) => {
        if (action === 'connect_wallet') {
            try {
                const acc = await connectWallet(); // Pera Wallet Logic
                if (acc) {
                    storeConnect(acc);
                    sendMessage(`Wallet connected: ${acc.slice(0, 4)}...${acc.slice(-4)}`);
                }
            } catch (e) {
                console.error(e);
            }
        } else {
            sendMessage(label, action);
        }
    };

    // Helper to render suggestions based on Step
    const renderSuggestions = () => {
        if (currentStep === 'ONBOARDING' && !userType) {
            return (
                <>
                    <button className="chip" onClick={() => handleAction('select_beginner', 'Beginner')}>Beginner</button>
                    <button className="chip" onClick={() => handleAction('select_expert', 'Expert')}>Expert</button>
                </>
            );
        }
        if (currentStep === 'USER_TYPE_SELECTED') {
            return <button className="chip action" onClick={() => handleAction('connect_wallet', 'Connect Wallet')}>Connect Wallet</button>;
        }
        if (currentStep === 'RECOMMENDATIONS') {
            return <button className="chip action" onClick={() => sendMessage('I want to stake', 'stake_intent')}>Stake Now</button>;
        }
        return null;
    };

    return (
        <div className="chat-container">
            <div className="chat-window">
                {messages.map((msg) => (
                    <div key={msg.id} className={`message-row ${msg.sender}`}>
                        {msg.sender === 'bot' && <div className="avatar">🧬</div>}
                        <div className="message-bubble">
                            <div className="message-text" dangerouslySetInnerHTML={{ __html: msg.text }} />
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Contextual Chips Area */}
            <div style={{ padding: '0 1rem 0.5rem 1rem', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {renderSuggestions()}
            </div>

            <div className="input-area">
                <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleSend()}
                    placeholder="Ask AI assistant..."
                />
                <button onClick={handleSend}>Send</button>
            </div>
        </div>
    );
};

export default ChatInterface;
