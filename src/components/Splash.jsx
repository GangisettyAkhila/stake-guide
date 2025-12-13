import { useEffect } from 'react';
import { motion } from 'framer-motion';

const Splash = ({ onComplete }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onComplete();
        }, 4000);
        return () => clearTimeout(timer);
    }, [onComplete]);

    const letterContainer = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.5
            }
        }
    };

    const letter = {
        hidden: { opacity: 0, y: 50 },
        show: { opacity: 1, y: 0, transition: { type: "spring", damping: 10 } }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            background: 'radial-gradient(circle at center, #1e2a4a 0%, #000 100%)',
            color: '#fff',
            flexDirection: 'column',
            overflow: 'hidden',
            position: 'relative'
        }}>
            {/* Background "Grid" Effect */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundImage: 'linear-gradient(rgba(0, 210, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 210, 255, 0.03) 1px, transparent 1px)',
                backgroundSize: '50px 50px',
                zIndex: 0
            }} />

            <motion.div
                variants={letterContainer}
                initial="hidden"
                animate="show"
                style={{ fontSize: '4rem', fontWeight: '900', zIndex: 1, textShadow: '0 0 20px rgba(0,210,255,0.5)', letterSpacing: '2px' }}
            >
                {Array.from("StakeGuide").map((char, index) => (
                    <motion.span key={index} variants={letter}>{char}</motion.span>
                ))}
            </motion.div>

            <motion.p
                initial={{ opacity: 0, letterSpacing: '0px' }}
                animate={{ opacity: 1, letterSpacing: '5px' }}
                transition={{ delay: 1.5, duration: 1.5, ease: "easeInOut" }}
                style={{
                    fontSize: '1.2rem',
                    color: '#00d2ff',
                    textTransform: 'uppercase',
                    marginTop: '1rem',
                    zIndex: 1
                }}
            >
                AI Assisted Wealth
            </motion.p>

            <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 2.0, duration: 0.8 }}
                style={{
                    height: '2px',
                    width: '300px',
                    background: 'linear-gradient(90deg, transparent, #00d2ff, transparent)',
                    marginTop: '2rem',
                    zIndex: 1
                }}
            />

            <motion.div
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 2, delay: 2.5 }}
                style={{ marginTop: '3rem', fontSize: '0.9rem', color: '#555', zIndex: 1 }}
            >
                INITIALIZING SECURE PROTOCOLS...
            </motion.div>
        </div>
    );
};

export default Splash;
