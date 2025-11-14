// 项目配置常量
export const CONFIG = {
  // 链 ID
  CHAIN_IDS: {
    ETHEREUM: 1,
    POLYGON: 137,
    BSC: 56,
    ARBITRUM: 42161,
    OPTIMISM: 10,
    AVALANCHE: 43114,
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
} as const

// 根据环境变量动态生成 RPC URLs（主网 + 测试网）
export const getRpcUrls = () => {
  const infuraKey = import.meta.env.VITE_INFURA_KEY
  return {
    // 主网
    ETHEREUM: `https://eth-mainnet.g.alchemy.com/v2/${infuraKey}`,
    POLYGON: `https://polygon-mainnet.g.alchemy.com/v2/${infuraKey}`,
    BSC: `https://bnb-mainnet.g.alchemy.com/v2/${infuraKey}`,
    ARBITRUM: `https://arb-mainnet.g.alchemy.com/v2/${infuraKey}`,
    OPTIMISM: `https://opt-mainnet.g.alchemy.com/v2/${infuraKey}`,
    AVALANCHE: `https://avax-mainnet.g.alchemy.com/v2/${infuraKey}`,
    BASE: `https://base-mainnet.g.alchemy.com/v2/${infuraKey}`,
    // 测试网
    SEPOLIA: `https://eth-sepolia.g.alchemy.com/v2/${infuraKey}`,
    POLYGON_MUMBAI: `https://polygon-mumbai.g.alchemy.com/v2/${infuraKey}`,
    BSC_TESTNET: `https://bnb-testnet.g.alchemy.com/v2/${infuraKey}`,
    ARBITRUM_SEPOLIA: `https://arb-sepolia.g.alchemy.com/v2/${infuraKey}`,
    OPTIMISM_SEPOLIA: `https://opt-sepolia.g.alchemy.com/v2/${infuraKey}`,
    AVALANCHE_FUJI: `https://avax-fuji.g.alchemy.com/v2/${infuraKey}`,
    BASE_SEPOLIA: `https://base-sepolia.g.alchemy.com/v2/${infuraKey}`,
  }
}

// 获取 WalletConnect Project ID
export const getWalletConnectProjectId = () => {
  return import.meta.env.VITE_WC_PROJECT_ID
}

// 获取 Infura Key
export const getInfuraKey = () => {
  return import.meta.env.VITE_INFURA_KEY
}
