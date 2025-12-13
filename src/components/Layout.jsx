import { useState } from 'react';
import ChatInterface from './ChatInterface';
import { motion, AnimatePresence } from 'framer-motion';

const Layout = ({ children, chatProps }) => {
    const [isChatCollapsed, setIsChatCollapsed] = useState(false);

    return (
        <div className="app-layout">
            <main className="main-content">
                <AnimatePresence mode="wait">
                    {children}
                </AnimatePresence>
            </main>

            <aside className={`chat-sidebar ${isChatCollapsed ? 'collapsed' : ''}`}>
                <button
                    className="collapse-btn"
                    onClick={() => setIsChatCollapsed(!isChatCollapsed)}
                >
                    {isChatCollapsed ? '💬' : '→'}
                </button>

                <div className="chat-control-bar" style={{ padding: '0.5rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                        onClick={() => {
                            if (confirm('Start over?')) {
                                localStorage.removeItem('stake_guide_session');
                                window.location.reload();
                            }
                        }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem', color: 'var(--text-muted)' }}
                        title="Reset Session"
                    >
                        🔄 Reset
                    </button>
                </div>

                <div className="chat-wrapper">
                    <ChatInterface {...chatProps} />
                </div>
            </aside>
        </div>
    );
};

export default Layout;
