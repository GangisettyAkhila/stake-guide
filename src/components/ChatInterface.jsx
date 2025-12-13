import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { connectWallet, analyzeUserBehavior, sendStakeTransaction } from '../services/algorandService';
import './ChatInterface.css'; // We will create this

const ChatInterface = () => {
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello! I'm your AI Staking Assistant.", sender: 'bot' },
        { id: 2, text: "Are you a Beginner or an Expert in blockchain staking?", sender: 'bot', type: 'choice', options: ['Beginner', 'Expert'] }
    ]);
    const [input, setInput] = useState('');
    const [userLevel, setUserLevel] = useState(null); // 'Beginner' | 'Expert'
    const [account, setAccount] = useState(null); // Wallet address
    const [isTyping, setIsTyping] = useState(false);

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (!input.trim()) return;
        const userMsg = { id: Date.now(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');

        // Simple NLP / Command handling
        await processUserMessage(input);
    };

    const addBotMessage = (text, type = 'text', options = []) => {
        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
            setMessages(prev => [...prev, { id: Date.now(), text, sender: 'bot', type, options }]);
        }, 1000); // Simulate typing delay
    };

    const handleOptionClick = async (option) => {
        const userMsg = { id: Date.now(), text: option, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);

        if (option === 'Beginner' || option === 'Expert') {
            setUserLevel(option);
            addBotMessage(`Great! I've set your profile to ${option}. Now, let's connect your Algorand wallet to get started.`, 'action', [{ label: 'Connect Pera Wallet', action: 'connect_wallet' }]);
        } else if (option === 'Connect Pera Wallet') {
            // Trigger wallet connection
            handleWalletConnect();
        } else if (option === 'Stake Now') {
            handleStakeAction();
        } else {
            // Fallback
            await processUserMessage(option);
        }
    };

    const handleWalletConnect = async () => {
        try {
            const acc = await connectWallet();
            if (acc) {
                setAccount(acc);
                addBotMessage(`Wallet connected! Address: ${acc.slice(0, 6)}...${acc.slice(-4)}`);

                if (userLevel === 'Expert') {
                    startExpertFlow(acc);
                } else {
                    startBeginnerFlow();
                }
            } else {
                addBotMessage("Bonding failed. Please try again.", 'action', [{ label: 'Connect Pera Wallet', action: 'connect_wallet' }]);
            }
        } catch (e) {
            console.error(e);
            addBotMessage("Error connecting wallet.");
        }
    };

    const startExpertFlow = async (acc) => {
        addBotMessage("Analyzing your transaction history...");
        setTimeout(async () => {
            const analysis = await analyzeUserBehavior(acc);
            addBotMessage(`Analysis Complete:
- Risk Tolerance: ${analysis.riskTolerance}
- Preferred Assets: ${analysis.preferredAssets.join(', ')}
- Staking History: ${analysis.stakingHistory ? 'Active' : 'None'}

Based on this, I recommend the **Algorand Governance Liquidity Pool** (TestNet).
APY: ~12% | Risk: Low-Medium`, 'action', [{ label: 'Stake Now', action: 'stake' }]);
        }, 2000);
    };

    const startBeginnerFlow = () => {
        addBotMessage("Welcome to the Staking Tutorial! 🎓");
        setTimeout(() => {
            addBotMessage("Staking is like earning interest on a savings account, but for crypto. By locking your Algorand, you help secure the network and earn rewards.");
            setTimeout(() => {
                addBotMessage("I have found a safe, Beginner-friendly option on TestNet: **Algo Foundation Staking**.", 'action', [{ label: 'Stake Now', action: 'stake' }]);
            }, 3000);
        }, 2000);
    };

    const handleStakeAction = async () => {
        if (!account) {
            addBotMessage("Please connect wallet first.", 'action', [{ label: 'Connect Pera Wallet', action: 'connect_wallet' }]);
            return;
        }
        addBotMessage("Initiating Staking Transaction on TestNet... Please sign in Pera Wallet.");
        try {
            // Demo amount 1 Algo
            const txId = await sendStakeTransaction(account, 1);
            addBotMessage(`Success! Transaction Sent: ${txId}`, 'text');
            addBotMessage("You are now earning rewards! 🌟");
        } catch (e) {
            addBotMessage("Transaction failed or cancelled.");
        }
    };

    const processUserMessage = async (text) => {
        setIsTyping(true);

        // Simulate "AI Processing" time
        setTimeout(() => {
            setIsTyping(false);
            const lowerText = text.toLowerCase();
            let responseText = "";
            let responseType = "text";
            let responseOptions = [];

            // Dynamic Data Generation
            const currentApy = (Math.random() * (15 - 8) + 8).toFixed(2); // 8% - 15%
            const tvl = (Math.random() * (500 - 100) + 100).toFixed(1); // 100M - 500M

            if (lowerText.includes('apy') || lowerText.includes('return') || lowerText.includes('yield')) {
                responseText = `Current network staking APY is hovering around **${currentApy}%**. This fluctuates based on network participation.`;
            } else if (lowerText.includes('risk') || lowerText.includes('safe')) {
                responseText = "Staking on Algorand is generally low-risk because it is non-custodial. You never lose control of your keys. However, smart contract risk exists in DeFi protocols.";
            } else if (lowerText.includes('connect') || lowerText.includes('wallet')) {
                responseText = "Would you like to connect your wallet now?";
                responseType = "action";
                responseOptions = [{ label: 'Connect Pera Wallet', action: 'connect_wallet' }];
            } else if (lowerText.includes('recommend') || lowerText.includes('best')) {
                responseText = `Based on current metrics, **Algorand Governance** (TestNet) offers the best risk-adjusted return at ~${currentApy}% APY.`;
                responseType = "action";
                responseOptions = [{ label: 'Stake Now', action: 'stake' }];
            } else if (lowerText.includes('hello') || lowerText.includes('hi')) {
                responseText = "Hello! I am ready to help you grow your portfolio. Ask me about APY, Risk, or Staking.";
            } else {
                responseText = "I can help you with Staking, Wallet Connection, and Risk Analysis. Try asking: 'What is the current APY?'";
            }

            setMessages(prev => [...prev, {
                id: Date.now(),
                text: responseText,
                sender: 'bot',
                type: responseType,
                options: responseOptions
            }]);
        }, 1200);
    };

    // Action handler wrapper for chip clicks
    const handleAction = (actionType) => {
        if (actionType === 'connect_wallet') handleWalletConnect();
        if (actionType === 'stake') handleStakeAction();
    };

    return (
        <div className="chat-container">
            <div className="chat-window">
                {messages.map((msg) => (
                    <div key={msg.id} className={`message-row ${msg.sender}`}>
                        {msg.sender === 'bot' && <div className="avatar">🤖</div>}
                        <div className="message-bubble">
                            <div className="message-text" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br/>') }} />
                            {msg.type === 'choice' && (
                                <div className="chips-container">
                                    {msg.options.map(opt => (
                                        <button key={opt} className="chip" onClick={() => handleOptionClick(opt)}>{opt}</button>
                                    ))}
                                </div>
                            )}
                            {msg.type === 'action' && (
                                <div className="chips-container">
                                    {msg.options.map(opt => (
                                        <button key={opt.label} className="chip action" onClick={() => handleAction(opt.action)}>{opt.label}</button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {isTyping && <div className="message-row bot"><div className="avatar">🤖</div><div className="message-bubble typing">...</div></div>}
                <div ref={messagesEndRef} />
            </div>
            <div className="input-area">
                <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleSend()}
                    placeholder="Ask a question..."
                />
                <button onClick={handleSend}>Send</button>
            </div>
        </div>
    );
};

export default ChatInterface;
