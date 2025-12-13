import algosdk from 'algosdk';
import { PeraWalletConnect } from '@perawallet/connect';

const peraWallet = new PeraWalletConnect({
    shouldShowSignTxnToast: true
});

const algodClient = new algosdk.Algodv2('', 'https://testnet-api.algonode.cloud', '');
const indexerClient = new algosdk.Indexer('', 'https://testnet-idx.algonode.cloud', '');

export const connectWallet = async () => {
    try {
        const newAccounts = await peraWallet.connect();
        peraWallet.connector?.on("disconnect", () => {
            console.log("Disconnected");
            // handle disconnect
        });
        return newAccounts[0];
    } catch (error) {
        if (error?.data?.type !== "CONNECT_MODAL_CLOSED") {
            console.error(error);
        }
        return null;
    }
};

export const reconnectSession = async () => {
    try {
        const accounts = await peraWallet.reconnectSession();
        if (accounts.length) {
            peraWallet.connector?.on("disconnect", () => {
                console.log("Disconnected");
            });
            return accounts[0];
        }
    } catch (error) {
        console.error(error);
    }
    return null;
};

export const disconnectWallet = async () => {
    try {
        await peraWallet.disconnect();
    } catch (error) {
        console.error(error);
    }
};


// Mock Analysis used if history is empty or for demo
export const analyzeUserBehavior = async (address) => {
    // In a real app, we would query the Indexer for tx history:
    // const accountInfo = await indexerClient.lookupAccountTransactions(address).do();

    // For specific demo requirements (mocking "Expert" identification):
    return {
        isExpert: Math.random() > 0.5, // Mock logic
        preferredAssets: ['ALGO', 'USDC'],
        riskTolerance: 'High', // inferred
        transactionCount: 42,
        stakingHistory: true
    };
};

export const sendStakeTransaction = async (senderAddress, amountAlgo) => {
    try {
        if (!senderAddress || !amountAlgo) throw new Error("Missing transaction parameters");

        const params = await algodClient.getTransactionParams().do();
        const suggestedParams = { ...params };

        // Ensure amount is valid number
        const amountMicroAlgo = algosdk.algosToMicroalgos(parseFloat(amountAlgo));
        if (isNaN(amountMicroAlgo) || amountMicroAlgo <= 0) throw new Error("Invalid amount");

        // Construct Payment Transaction (Staking simulated as a transfer to self or a dummy app)
        const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
            from: senderAddress,
            to: senderAddress, // Self-transfer as "Staking" placeholder
            amount: amountMicroAlgo,
            suggestedParams,
            note: new Uint8Array(Buffer.from("StakeGuide Demo Stake"))
        });

        const singleTxnGroups = [{ txn, signers: [senderAddress] }];
        const signedTxn = await peraWallet.signTransaction([singleTxnGroups]);

        const { txId } = await algodClient.sendRawTransaction(signedTxn).do();

        // Wait for confirmation - Critical for "success" feedback
        await algosdk.waitForConfirmation(algodClient, txId, 4);

        return txId;
    } catch (error) {
        console.error("Stake failed", error);
        throw error;
    }
};

export { peraWallet };
