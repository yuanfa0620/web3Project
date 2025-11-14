import {
  mainnet,
  polygon,
  bsc,
  arbitrum,
  optimism,
  avalanche,
  base,
  sepolia,
  polygonMumbai,
  bscTestnet,
  arbitrumSepolia,
  optimismSepolia,
  avalancheFuji,
  baseSepolia,
} from 'wagmi/chains'
import { CONFIG, getRpcUrls } from '@/config/constants'
import { getChainIconUrl } from '@/utils/chainIcons'

// 支持的链配置（主网 + 测试网 + Base）
export const supportedChains = [
  mainnet,
  polygon,
  bsc,
  arbitrum,
  optimism,
  avalanche,
  base,
  sepolia,
  polygonMumbai,
  bscTestnet,
  arbitrumSepolia,
  optimismSepolia,
  avalancheFuji,
  baseSepolia,
]

// 链 ID 映射
export const CHAIN_IDS = {
  ETHEREUM: 1,
  POLYGON: 137,
  BSC: 56,
  ARBITRUM: 42161,
  OPTIMISM: 10,
  AVALANCHE: 43114,
  BASE: 8453,
  // 测试网
  SEPOLIA: 5,
  POLYGON_MUMBAI: 80001,
  BSC_TESTNET: 97,
  ARBITRUM_SEPOLIA: 421613,
  OPTIMISM_SEPOLIA: 420,
  AVALANCHE_FUJI: 43113,
  BASE_SEPOLIA: 84532,
} as const

// RPC URLs（主网 + 测试网统一管理）
const rpcUrls = getRpcUrls()
export const RPC_URLS = {
  // 主网
  [CHAIN_IDS.ETHEREUM]: rpcUrls.ETHEREUM,
  [CHAIN_IDS.POLYGON]: rpcUrls.POLYGON,
  [CHAIN_IDS.BSC]: rpcUrls.BSC,
  [CHAIN_IDS.ARBITRUM]: rpcUrls.ARBITRUM,
  [CHAIN_IDS.OPTIMISM]: rpcUrls.OPTIMISM,
  [CHAIN_IDS.AVALANCHE]: rpcUrls.AVALANCHE,
  [CHAIN_IDS.BASE]: rpcUrls.BASE,
  // 测试网
  [CHAIN_IDS.SEPOLIA]: rpcUrls.SEPOLIA,
  [CHAIN_IDS.POLYGON_MUMBAI]: rpcUrls.POLYGON_MUMBAI,
  [CHAIN_IDS.BSC_TESTNET]: rpcUrls.BSC_TESTNET,
  [CHAIN_IDS.ARBITRUM_SEPOLIA]: rpcUrls.ARBITRUM_SEPOLIA,
  [CHAIN_IDS.OPTIMISM_SEPOLIA]: rpcUrls.OPTIMISM_SEPOLIA,
  [CHAIN_IDS.AVALANCHE_FUJI]: rpcUrls.AVALANCHE_FUJI,
  [CHAIN_IDS.BASE_SEPOLIA]: rpcUrls.BASE_SEPOLIA,
} as const

// 链信息（使用 chainlist.org 的图标）
export const CHAIN_INFO = {
  [CHAIN_IDS.ETHEREUM]: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
    logoURI: getChainIconUrl(CHAIN_IDS.ETHEREUM) || 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
  },
  [CHAIN_IDS.POLYGON]: {
    name: 'Polygon',
    symbol: 'MATIC',
    decimals: 18,
    logoURI: getChainIconUrl(CHAIN_IDS.POLYGON) || 'https://cryptologos.cc/logos/polygon-matic-logo.png',
  },
  [CHAIN_IDS.BSC]: {
    name: 'BNB Smart Chain',
    symbol: 'BNB',
    decimals: 18,
    logoURI: getChainIconUrl(CHAIN_IDS.BSC) || 'https://cryptologos.cc/logos/bnb-bnb-logo.png',
  },
  [CHAIN_IDS.ARBITRUM]: {
    name: 'Arbitrum One',
    symbol: 'ETH',
    decimals: 18,
    logoURI: getChainIconUrl(CHAIN_IDS.ARBITRUM) || 'https://cryptologos.cc/logos/arbitrum-arb-logo.png',
  },
  [CHAIN_IDS.OPTIMISM]: {
    name: 'Optimism',
    symbol: 'ETH',
    decimals: 18,
    logoURI: getChainIconUrl(CHAIN_IDS.OPTIMISM) || 'https://cryptologos.cc/logos/optimism-ethereum-op-logo.png',
  },
  [CHAIN_IDS.AVALANCHE]: {
    name: 'Avalanche',
    symbol: 'AVAX',
    decimals: 18,
    logoURI: getChainIconUrl(CHAIN_IDS.AVALANCHE) || 'https://cryptologos.cc/logos/avalanche-avax-logo.png',
  },
  [CHAIN_IDS.BASE]: {
    name: 'Base',
    symbol: 'ETH',
    decimals: 18,
    logoURI: getChainIconUrl(CHAIN_IDS.BASE) || 'https://cryptologos.cc/logos/base-base-logo.png',
  },
  // 测试网
  [CHAIN_IDS.SEPOLIA]: {
    name: 'Sepolia',
    symbol: 'ETH',
    decimals: 18,
    logoURI: getChainIconUrl(CHAIN_IDS.SEPOLIA) || 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
  },
  [CHAIN_IDS.POLYGON_MUMBAI]: {
    name: 'Polygon Mumbai',
    symbol: 'MATIC',
    decimals: 18,
    logoURI: getChainIconUrl(CHAIN_IDS.POLYGON_MUMBAI) || 'https://cryptologos.cc/logos/polygon-matic-logo.png',
  },
  [CHAIN_IDS.BSC_TESTNET]: {
    name: 'BSC Testnet',
    symbol: 'BNB',
    decimals: 18,
    logoURI: getChainIconUrl(CHAIN_IDS.BSC_TESTNET) || 'https://cryptologos.cc/logos/bnb-bnb-logo.png',
  },
  [CHAIN_IDS.ARBITRUM_SEPOLIA]: {
    name: 'Arbitrum Sepolia',
    symbol: 'ETH',
    decimals: 18,
    logoURI: getChainIconUrl(CHAIN_IDS.ARBITRUM_SEPOLIA) || 'https://cryptologos.cc/logos/arbitrum-arb-logo.png',
  },
  [CHAIN_IDS.OPTIMISM_SEPOLIA]: {
    name: 'Optimism Sepolia',
    symbol: 'ETH',
    decimals: 18,
    logoURI: getChainIconUrl(CHAIN_IDS.OPTIMISM_SEPOLIA) || 'https://cryptologos.cc/logos/optimism-ethereum-op-logo.png',
  },
  [CHAIN_IDS.AVALANCHE_FUJI]: {
    name: 'Avalanche Fuji',
    symbol: 'AVAX',
    decimals: 18,
    logoURI: getChainIconUrl(CHAIN_IDS.AVALANCHE_FUJI) || 'https://cryptologos.cc/logos/avalanche-avax-logo.png',
  },
  [CHAIN_IDS.BASE_SEPOLIA]: {
    name: 'Base Sepolia',
    symbol: 'ETH',
    decimals: 18,
    logoURI: getChainIconUrl(CHAIN_IDS.BASE_SEPOLIA) || 'https://cryptologos.cc/logos/base-base-logo.png',
  },
} as const
