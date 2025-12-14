import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { User } from './models/User.js';
import { Transaction } from './models/Transaction.js';
import { STEPS, canTransition } from './stateMachine.js';

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/stake_guide')
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// --- DYNAMIC DATA SOURCE ---
const PLATFORMS = [
    { id: 1, name: 'Algorand Governance', type: 'Official', apy: '12%', risk: 'Low', lock: '3 Months', recommend: true, description: 'Best for long-term holders. Participate in voting and earn rewards directly from the foundation.' },
    { id: 2, name: 'Folks Finance', type: 'Liquid Staking', apy: '14.5%', risk: 'Medium', lock: 'None', recommend: false, description: 'Deposit Algo -> receive gAlgo. Use gAlgo in DeFi while earning staking rewards.' },
    { id: 3, name: 'Tinyman Pool', type: 'DeFi LP', apy: '28%', risk: 'High', lock: 'None', recommend: false, description: 'Provide liquidity to trading pools. Higher risk of impermanent loss but higher potential rewards.' },
];

// Helper to find High Yield
const getAnalysis = () => {
    const sorted = [...PLATFORMS].sort((a, b) => parseFloat(b.apy) - parseFloat(a.apy));
    const highYield = sorted[0];
    const safeBet = PLATFORMS.find(p => p.risk === 'Low');
    return { highYield, safeBet };
};

// --- API ROUTES ---

// 1. Initialize Session
app.post('/api/init', async (req, res) => {
    // For simplicity, we just create a new session or reset
    // In production, we'd use cookies/tokens
    const sessionId = req.body.sessionId || `sess_${Date.now()}`;

    let user = await User.findOne({ sessionId });
    if (!user) {
        user = new User({ sessionId, currentStep: STEPS.SPLASH });
        await user.save();
    }

    res.json({
        sessionId: user.sessionId,
        currentStep: user.currentStep,
        userType: user.userType,
        walletAddress: user.walletAddress
    });
});

// 1.5 Get Recommendations
app.get('/api/recommendations', (req, res) => {
    const { highYield } = getAnalysis();
    // Inject dynamic flags
    const data = PLATFORMS.map(p => ({
        ...p,
        isHighYield: p.id === highYield.id
    }));
    res.json(data);
});

// 2. Chat / Action Processor
app.post('/api/chat', async (req, res) => {
    const { sessionId, message, action } = req.body;
    const user = await User.findOne({ sessionId });

    if (!user) return res.status(404).json({ error: 'Session not found' });

    let aiResponse = "";
    let nextStep = user.currentStep;

    // --- STATE MACHINE & AI LOGIC ---

    // Global Commands
    if (action === 'reset') {
        user.currentStep = STEPS.ONBOARDING;
        user.userType = null;
        await user.save();
        return res.json({ text: "Session reset. Returning to start.", currentStep: STEPS.ONBOARDING });
    }

    // Global Start/Resume Handler
    if (action === 'start' && user.currentStep !== STEPS.ONBOARDING) {
        let resumeMsg = "Welcome back.";
        if (user.currentStep === STEPS.RECOMMENDATIONS) {
            resumeMsg = "Welcome back! I have your recommendations ready. Check the buttons below.";
        } else if (user.currentStep === STEPS.STAKING_INPUT) {
            resumeMsg = "Resuming staking session. Please complete the transaction in the modal.";
        }
        return res.json({ text: resumeMsg, currentStep: user.currentStep, userType: user.userType });
    }

    if (user.currentStep === STEPS.SPLASH) {
        if (action === 'next') {
            nextStep = STEPS.ONBOARDING;
        }
    }
    else if (user.currentStep === STEPS.ONBOARDING) {
        // Skip Manual Selection -> Direct to Connect
        if (action === 'start') {
            aiResponse = `
                <strong>Welcome to StakeGuide! 🚀</strong><br/><br/>
                We analyze your wallet history to provide personalized staking recommendations.<br/><br/>
                Please <strong>Connect your Wallet</strong> to get started.
            `;
        } else if (action === 'connect_wallet_intent') {
            aiResponse = "Click the button below to connect.";
        } else {
            // If unrelated message, just nudge gently
            aiResponse = "To proceed, please connect your wallet using the button below.";
        }
    }
    // Removed USER_TYPE_SELECTED as it's no longer a distinct interactive step
    else if (user.currentStep === STEPS.RECOMMENDATIONS) {
        const { highYield, safeBet } = getAnalysis();

        if (user.userType === 'Beginner') {
            aiResponse = `
                I've analyzed the market for you.<br/><br/>
                💰 <strong>Highest Return:</strong> <span style="color: #22c55e">${highYield.name}</span> with <strong>${highYield.apy}</strong>.<br/>
                🛡️ <strong>Safest Bet:</strong> ${safeBet.name} (${safeBet.apy}).<br/><br/>
                For a beginner, I recommend balancing safety and returns. Check the "AI Pick" below.
            `;
        } else {
            aiResponse = `
                Analysis complete. 📊<br/><br/>
                <strong>${highYield.name}</strong> is currently leading with <strong>${highYield.apy} APY</strong> (High Yield).<br/>
                If you prefer stability, stick with <strong>${safeBet.name}</strong>.<br/><br/>
                Select a platform below to deploy capital.
            `;
        }

        if (message.toLowerCase().includes('stake')) {
            nextStep = STEPS.STAKING_INPUT;
            aiResponse = "Opening Staking Interface. Please enter the amount to stake.";
        }
    }
    else if (user.currentStep === STEPS.STAKING_INPUT) {
        aiResponse = "Please Confirm the transaction in the modal.";
    }

    // Save State
    user.currentStep = nextStep;
    await user.save();

    res.json({
        text: aiResponse,
        currentStep: nextStep,
        userType: user.userType
    });
});

// 3. Wallet Connection
app.post('/api/wallet/connect', async (req, res) => {
    const { sessionId, walletAddress, analysis } = req.body; // Accept analysis
    const user = await User.findOne({ sessionId });

    if (!user) return res.status(404).json({ error: 'Session not found' });

    user.walletAddress = walletAddress;

    // Automated Profiling Logic
    if (analysis) {
        user.userType = analysis.isExpert ? 'Expert' : 'Beginner';
    } else {
        user.userType = 'Beginner'; // Default
    }

    user.currentStep = STEPS.RECOMMENDATIONS; // Transition
    await user.save();

    res.json({ success: true, currentStep: user.currentStep });
});

// 4. Staking Execution
app.post('/api/stake', async (req, res) => {
    const { sessionId, amount, txId, platform } = req.body;
    const user = await User.findOne({ sessionId });

    if (!user || user.currentStep !== STEPS.STAKING_INPUT) {
        return res.status(400).json({ error: 'Invalid state for staking' });
    }

    const newTx = new Transaction({
        walletAddress: user.walletAddress,
        txId,
        amount,
        platform: platform || 'Algorand TestNet',
        apy: '12%'
    });
    await newTx.save();

    user.currentStep = STEPS.DASHBOARD;
    await user.save();

    res.json({ success: true, currentStep: STEPS.DASHBOARD });
});

// 5. Dashboard Data
app.get('/api/dashboard/:address', async (req, res) => {
    const { address } = req.params;
    const transactions = await Transaction.find({ walletAddress: address }).sort({ timestamp: -1 });

    // Aggregation
    const totalStaked = transactions.reduce((acc, curr) => acc + curr.amount, 0);
    const rewards = totalStaked * 0.12; // Mock calculation based on APY

    res.json({
        totalStaked,
        rewardsEarned: rewards.toFixed(2),
        apy: 12,
        transactions
    });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
