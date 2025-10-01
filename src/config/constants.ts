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

// 根据环境变量动态生成 RPC URLs
export const getRpcUrls = () => {
  const infuraKey = import.meta.env.VITE_INFURA_KEY
  return {
    ETHEREUM: `https://mainnet.infura.io/v3/${infuraKey}`,
    POLYGON: `https://polygon-mainnet.infura.io/v3/${infuraKey}`,
    BSC: 'https://bsc-dataseed.binance.org',
    ARBITRUM: 'https://arb1.arbitrum.io/rpc',
    OPTIMISM: 'https://mainnet.optimism.io',
    AVALANCHE: 'https://api.avax.network/ext/bc/C/rpc',
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
