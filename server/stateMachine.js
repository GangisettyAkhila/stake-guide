export const STEPS = {
    SPLASH: 'SPLASH',
    ONBOARDING: 'ONBOARDING',
    USER_TYPE_SELECTED: 'USER_TYPE_SELECTED',
    WALLET_CONNECTED: 'WALLET_CONNECTED',
    RECOMMENDATIONS: 'RECOMMENDATIONS',
    STAKING_INPUT: 'STAKING_INPUT',
    STAKING_CONFIRM: 'STAKING_CONFIRM',
    DASHBOARD: 'DASHBOARD'
};

export const TRANSITIONS = {
    [STEPS.SPLASH]: {
        next: STEPS.ONBOARDING
    },
    [STEPS.ONBOARDING]: {
        select_beginner: STEPS.USER_TYPE_SELECTED,
        select_expert: STEPS.USER_TYPE_SELECTED
    },
    [STEPS.USER_TYPE_SELECTED]: {
        connect_wallet: STEPS.WALLET_CONNECTED
    },
    [STEPS.WALLET_CONNECTED]: {
        view_recommendations: STEPS.RECOMMENDATIONS,
        view_dashboard: STEPS.DASHBOARD
    },
    [STEPS.RECOMMENDATIONS]: {
        stake_intent: STEPS.STAKING_INPUT,
        back: STEPS.DASHBOARD
    },
    [STEPS.STAKING_INPUT]: {
        confirm_stake: STEPS.STAKING_CONFIRM,
        cancel: STEPS.RECOMMENDATIONS
    },
    [STEPS.STAKING_CONFIRM]: {
        success: STEPS.DASHBOARD
    },
    [STEPS.DASHBOARD]: {
        stake_more: STEPS.RECOMMENDATIONS
    }
};

export const canTransition = (currentStep, action) => {
    return TRANSITIONS[currentStep]?.[action] || null;
};
