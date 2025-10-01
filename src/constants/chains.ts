import { mainnet, polygon, bsc, arbitrum, optimism, avalanche } from 'wagmi/chains'
import { CONFIG, getRpcUrls } from '@/config/constants'

// 支持的链配置
export const supportedChains = [
  mainnet,
  polygon,
  bsc,
  arbitrum,
  optimism,
  avalanche,
]

// 链 ID 映射
export const CHAIN_IDS = {
  ETHEREUM: 1,
  POLYGON: 137,
  BSC: 56,
  ARBITRUM: 42161,
  OPTIMISM: 10,
  AVALANCHE: 43114,
} as const

// RPC URLs
const rpcUrls = getRpcUrls()
export const RPC_URLS = {
  [CHAIN_IDS.ETHEREUM]: rpcUrls.ETHEREUM,
  [CHAIN_IDS.POLYGON]: rpcUrls.POLYGON,
  [CHAIN_IDS.BSC]: rpcUrls.BSC,
  [CHAIN_IDS.ARBITRUM]: rpcUrls.ARBITRUM,
  [CHAIN_IDS.OPTIMISM]: rpcUrls.OPTIMISM,
  [CHAIN_IDS.AVALANCHE]: rpcUrls.AVALANCHE,
} as const

// 链信息
export const CHAIN_INFO = {
  [CHAIN_IDS.ETHEREUM]: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
    logoURI: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
  },
  [CHAIN_IDS.POLYGON]: {
    name: 'Polygon',
    symbol: 'MATIC',
    decimals: 18,
    logoURI: 'https://cryptologos.cc/logos/polygon-matic-logo.png',
  },
  [CHAIN_IDS.BSC]: {
    name: 'BNB Smart Chain',
    symbol: 'BNB',
    decimals: 18,
    logoURI: 'https://cryptologos.cc/logos/bnb-bnb-logo.png',
  },
  [CHAIN_IDS.ARBITRUM]: {
    name: 'Arbitrum One',
    symbol: 'ETH',
    decimals: 18,
    logoURI: 'https://cryptologos.cc/logos/arbitrum-arb-logo.png',
  },
  [CHAIN_IDS.OPTIMISM]: {
    name: 'Optimism',
    symbol: 'ETH',
    decimals: 18,
    logoURI: 'https://cryptologos.cc/logos/optimism-ethereum-op-logo.png',
  },
  [CHAIN_IDS.AVALANCHE]: {
    name: 'Avalanche',
    symbol: 'AVAX',
    decimals: 18,
    logoURI: 'https://cryptologos.cc/logos/avalanche-avax-logo.png',
  },
} as const
