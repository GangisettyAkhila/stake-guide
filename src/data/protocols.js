export const protocols = [
  {
    id: 'lido',
    name: 'Lido',
    chain: 'Ethereum',
    apy: 3.8,
    lockup: 0,
    risk: 'Low',
    description: 'Liquid staking protocol. Stake ETH and receive stETH. High liquidity and established reputation.',
    contractAddress: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fF' // Mock/Real address for demo
  },
  {
    id: 'rocketpool',
    name: 'Rocket Pool',
    chain: 'Ethereum',
    apy: 3.5,
    lockup: 0,
    risk: 'Low',
    description: 'Decentralized liquid staking. Stake ETH and receive rETH. Permissionless node operators.',
    contractAddress: '0xae78736Cd615f374D3085123A210448E74Fc6393'
  },
  {
    id: 'binance-stake',
    name: 'Binance Staking',
    chain: 'Ethereum',
    apy: 4.2,
    lockup: 30,
    risk: 'Medium',
    description: 'Centralized exchange staking with higher yield but custodial risk (simulated as non-custodial wrapper for demo).',
    contractAddress: '0x0000000000000000000000000000000000000000'
  },
  {
    id: 'high-yield-farm',
    name: 'Degen Farm',
    chain: 'Ethereum',
    apy: 15.5,
    lockup: 90,
    risk: 'High',
    description: 'Experimental yield farming protocol. High risk of smart contract bugs or rug pulls.',
    contractAddress: '0x000000000000000000000000000000000000dead'
  }
];
