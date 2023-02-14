import Web3 from 'web3';

export const networks = {
    1: "Ethereum Mainnet",
    97: "BNB Smart Chain Testnet",
    80001: "Mumbai",
    5: "Goerli",
    56: "Binance Smart Chain Mainnet",
    137: "Matic(Polygon) Mainnet"
};

export const addChain = {
    1: {
        chainId: '0x1',
        chainName: 'Ethereum Mainnet',
        nativeCurrency: {
            name: 'Ether',
            symbol: 'ETH',
            decimals: 18
        },
        rpcUrls: ['https://eth.llamarpc.com'],
        blockExplorerUrls: ['https://etherscan.io/']
    },
    56: {
        chainId: '0x38',
        chainName: 'Binance Smart Chain Mainnet',
        nativeCurrency: {
            name: 'Binance Coin',
            symbol: 'BNB',
            decimals: 18
        },
        rpcUrls: ['https://bsc.rpc.blxrbdn.com'],
        blockExplorerUrls: ['https://bscscan.com']
    },
    97: {
        chainId: '0x61',
        chainName: 'Binance Smart Chain TestNet',
        nativeCurrency: {
            name: 'Binance Coin',
            symbol: 'tBNB',
            decimals: 18
        },
        rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
        blockExplorerUrls: ['https://testnet.bscscan.com/']
    },
    137: {
        chainId: '0x89',
        chainName: 'Polygon Mainnet',
        nativeCurrency: { 
            name: 'MATIC',
            symbol: 'MATIC',
            decimals: 18
        },
        rpcUrls: ['https://polygon-rpc.com'],
        blockExplorerUrls: ['https://www.polygonscan.com/'],
    },
    80001: {
        chainId: "0x13881",
        rpcUrls: ["https://rpc-mumbai.maticvigil.com"],
        chainName: "Polygon Testnet Mumbai",
        nativeCurrency: {
            name: "tMATIC",
            symbol: "tMATIC",
            decimals: 18,
        },
        blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
    }
} 