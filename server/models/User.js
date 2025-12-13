import mongoose from 'mongoose';
import { STEPS } from '../stateMachine.js';

const userSchema = new mongoose.Schema({
    sessionId: { type: String, required: true, unique: true },
    userType: { type: String, enum: ['Beginner', 'Expert', null], default: null },
    currentStep: { type: String, enum: Object.values(STEPS), default: STEPS.SPLASH },
    walletAddress: { type: String, default: null },
    createdAt: { type: Date, default: Date.now },
    learningProgress: { type: Number, default: 0 } // For beginners
});

export const User = mongoose.model('User', userSchema);
