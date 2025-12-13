import { create } from 'zustand';

const API_URL = 'http://localhost:3000/api';

export const useAppStore = create((set, get) => ({
    sessionId: localStorage.getItem('stake_guide_session') || null,
    currentStep: 'SPLASH',
    userType: null,
    messages: [],
    account: null,
    dashboardData: null,

    // Actions
    initSession: async () => {
        const storedSession = localStorage.getItem('stake_guide_session');
        try {
            const res = await fetch(`${API_URL}/init`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId: storedSession })
            });
            const data = await res.json();

            if (!storedSession) {
                localStorage.setItem('stake_guide_session', data.sessionId);
            }

            set({
                sessionId: data.sessionId,
                currentStep: data.currentStep,
                userType: data.userType,
                account: data.walletAddress
            });

            return data;
        } catch (e) {
            console.error(e);
        }
    },

    sendMessage: async (text, action = null) => {
        const { sessionId, messages } = get();

        // Optimistic update for user message
        if (text) {
            set({ messages: [...messages, { id: Date.now(), text, sender: 'user' }] });
        }

        try {
            const res = await fetch(`${API_URL}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId, message: text || '', action })
            });
            const data = await res.json();

            if (data.text) {
                set(state => ({
                    messages: [...state.messages, { id: Date.now() + 1, text: data.text, sender: 'bot' }],
                    currentStep: data.currentStep,
                    userType: data.userType || state.userType
                }));
            } else {
                set({ currentStep: data.currentStep });
            }
        } catch (e) {
            console.error(e);
        }
    },

    connectWallet: async (address) => {
        const { sessionId } = get();
        set({ account: address });

        // Notify backend
        const res = await fetch(`${API_URL}/wallet/connect`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId, walletAddress: address })
        });
        const data = await res.json();
        set({ currentStep: data.currentStep });
    },

    fetchDashboard: async () => {
        const { account } = get();
        if (!account) return;

        const res = await fetch(`${API_URL}/dashboard/${account}`);
        const data = await res.json();
        set({ dashboardData: data });
    },

    recordStake: async (txDetails) => {
        const { sessionId } = get();
        await fetch(`${API_URL}/stake`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...txDetails, sessionId })
        });
        // Refresh dashboard
        get().fetchDashboard();
        get().sendMessage('', 'stake_success');
    }
}));
