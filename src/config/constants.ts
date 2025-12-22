// 项目配置常量
export const CONFIG = {
  // 链 ID
  CHAIN_IDS: {
    ETHEREUM: 1,
    POLYGON: 137,
    BSC: 56,
    // ARBITRUM: 42161,
    // OPTIMISM: 10,
    // AVALANCHE: 43114,
  },

  // API 配置
  API: {
    BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api',
  },

  // 应用配置
  APP: {
    TITLE: import.meta.env.VITE_APP_TITLE || 'Web3',
    ENV: import.meta.env.VITE_APP_ENV || 'development',
  },

  // 代币合约地址配置（按链ID）
  TOKEN_CONTRACTS: {
    [1]: import.meta.env.VITE_TOKEN_CONTRACT_ADDRESS_1 || '', // Ethereum
    [137]: import.meta.env.VITE_TOKEN_CONTRACT_ADDRESS_137 || '', // Polygon
    [56]: import.meta.env.VITE_TOKEN_CONTRACT_ADDRESS_56 || '', // BSC
    [8453]: import.meta.env.VITE_TOKEN_CONTRACT_ADDRESS_8453 || '', // Base
    // 测试网
    [11155111]: import.meta.env.VITE_TOKEN_CONTRACT_ADDRESS_11155111 || '', // Sepolia
    [80002]: import.meta.env.VITE_TOKEN_CONTRACT_ADDRESS_80002 || '', // Polygon Amoy
    [97]: import.meta.env.VITE_TOKEN_CONTRACT_ADDRESS_97 || '', // BSC Testnet
    [84532]: import.meta.env.VITE_TOKEN_CONTRACT_ADDRESS_84532 || '', // Base Sepolia
  },

  // NFT 市场合约地址配置（按链ID）
  NFT_MARKETPLACE_CONTRACTS: {
    // 主网
    [1]: import.meta.env.VITE_NFT_MARKETPLACE_ADDRESS_1 || '', // Ethereum
    [137]: import.meta.env.VITE_NFT_MARKETPLACE_ADDRESS_137 || '', // Polygon
    [56]: import.meta.env.VITE_NFT_MARKETPLACE_ADDRESS_56 || '', // BSC
    [8453]: import.meta.env.VITE_NFT_MARKETPLACE_ADDRESS_8453 || '', // Base
    // 测试网
    [11155111]: import.meta.env.VITE_NFT_MARKETPLACE_ADDRESS_11155111 || '', // Sepolia
    [80002]: import.meta.env.VITE_NFT_MARKETPLACE_ADDRESS_80002 || '', // Polygon Amoy
    [97]: import.meta.env.VITE_NFT_MARKETPLACE_ADDRESS_97 || '', // BSC Testnet
    [84532]: import.meta.env.VITE_NFT_MARKETPLACE_ADDRESS_84532 || '', // Base Sepolia
  },

  // 白名单管理器合约地址配置（按链ID）
  WHITELIST_MANAGER_CONTRACTS: {
    // 主网
    [1]: import.meta.env.VITE_WHITELIST_MANAGER_ADDRESS_1 || '', // Ethereum
    [137]: import.meta.env.VITE_WHITELIST_MANAGER_ADDRESS_137 || '', // Polygon
    [56]: import.meta.env.VITE_WHITELIST_MANAGER_ADDRESS_56 || '', // BSC
    [8453]: import.meta.env.VITE_WHITELIST_MANAGER_ADDRESS_8453 || '', // Base
    // 测试网
    [11155111]: import.meta.env.VITE_WHITELIST_MANAGER_ADDRESS_11155111 || '', // Sepolia
    [80002]: import.meta.env.VITE_WHITELIST_MANAGER_ADDRESS_80002 || '', // Polygon Amoy
    [97]: import.meta.env.VITE_WHITELIST_MANAGER_ADDRESS_97 || '', // BSC Testnet
    [84532]: import.meta.env.VITE_WHITELIST_MANAGER_ADDRESS_84532 || '', // Base Sepolia
  },

  // Mint配置
  MINT: {
    MAX_BALANCE: 1000, // 最大余额限制（超过此值不允许mint）
    COST: '0.001', // 每次mint需要的主网币数量
  },
} as const

// 根据环境变量动态生成 RPC URLs（主网 + 测试网）
export const getRpcUrls = () => {
  const infuraKey = getInfuraKey()
  return {
    // 主网
    ETHEREUM: `https://eth-mainnet.g.alchemy.com/v2/${infuraKey}`,
    POLYGON: `https://polygon-mainnet.g.alchemy.com/v2/${infuraKey}`,
    BSC: `https://bnb-mainnet.g.alchemy.com/v2/${infuraKey}`,
    BASE: `https://base-mainnet.g.alchemy.com/v2/${infuraKey}`,
    // 测试网
    SEPOLIA: `https://eth-sepolia.g.alchemy.com/v2/${infuraKey}`,
    POLYGON_AMOY: `https://polygon-amoy.g.alchemy.com/v2/${infuraKey}`,
    BSC_TESTNET: `https://bnb-testnet.g.alchemy.com/v2/${infuraKey}`,
    BASE_SEPOLIA: `https://base-sepolia.g.alchemy.com/v2/${infuraKey}`,
  }
}

// 获取 WalletConnect Project ID
export const getWalletConnectProjectId = () => {
  return import.meta.env.VITE_WC_PROJECT_ID || ''
}

// 获取 Infura Key
export const getInfuraKey = () => {
  return import.meta.env.VITE_ALCHEMY_KEY || ''
}

// 获取 NFT 市场合约地址
export const getNFTMarketplaceAddress = (chainId: number): string => {
  return CONFIG.NFT_MARKETPLACE_CONTRACTS[chainId as keyof typeof CONFIG.NFT_MARKETPLACE_CONTRACTS] || ''
}

// 获取白名单管理器合约地址
export const getWhitelistManagerAddress = (chainId: number): string => {
  return CONFIG.WHITELIST_MANAGER_CONTRACTS[chainId as keyof typeof CONFIG.WHITELIST_MANAGER_CONTRACTS] || ''
}
