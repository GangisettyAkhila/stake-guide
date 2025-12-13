import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    walletAddress: { type: String, required: true },
    txId: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    type: { type: String, default: 'Stake' },
    status: { type: String, default: 'Success' },
    timestamp: { type: Date, default: Date.now },
    platform: { type: String, required: true },
    apy: { type: String }
});

export const Transaction = mongoose.model('Transaction', transactionSchema);
