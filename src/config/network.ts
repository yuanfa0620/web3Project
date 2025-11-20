import { connectorsForWallets } from '@rainbow-me/rainbowkit'
import { metaMaskWallet, coinbaseWallet, walletConnectWallet, injectedWallet, safeWallet, trustWallet, ledgerWallet } from '@rainbow-me/rainbowkit/wallets'
import { createConfig, http } from 'wagmi'
import { mainnet, polygon, bsc, base, sepolia, polygonMumbai, bscTestnet, baseSepolia } from 'wagmi/chains'
import { getWalletConnectProjectId, getRpcUrls } from '@/config/constants'
import { getChainIconUrl } from '@/utils/chainIcons'

export const supportedChains = [
  mainnet,
  polygon,
  bsc,
  base,
  sepolia,
  polygonMumbai,
  bscTestnet,
  baseSepolia,
] as const

// 链 ID 映射
export const CHAIN_IDS = {
  ETHEREUM: 1,
  POLYGON: 137,
  BSC: 56,
  BASE: 8453,
  // 测试网
  SEPOLIA: 11155111,
  POLYGON_MUMBAI: 80001,
  BSC_TESTNET: 97,
  BASE_SEPOLIA: 84532,
} as const

export const MAINNET_CHAIN_IDS = [
  CHAIN_IDS.ETHEREUM,
  CHAIN_IDS.POLYGON,
  CHAIN_IDS.BSC,
  CHAIN_IDS.BASE,
] as const

export const TESTNET_CHAIN_IDS = [
  CHAIN_IDS.SEPOLIA,
  CHAIN_IDS.POLYGON_MUMBAI,
  CHAIN_IDS.BSC_TESTNET,
  CHAIN_IDS.BASE_SEPOLIA,
] as const

// RPC URLs（主网 + 测试网统一管理）
const rpcUrls = getRpcUrls()
export const RPC_URLS = {
  [CHAIN_IDS.ETHEREUM]: rpcUrls.ETHEREUM,
  [CHAIN_IDS.POLYGON]: rpcUrls.POLYGON,
  [CHAIN_IDS.BSC]: rpcUrls.BSC,
  [CHAIN_IDS.BASE]: rpcUrls.BASE,
  [CHAIN_IDS.SEPOLIA]: rpcUrls.SEPOLIA,
  [CHAIN_IDS.POLYGON_MUMBAI]: rpcUrls.POLYGON_MUMBAI,
  [CHAIN_IDS.BSC_TESTNET]: rpcUrls.BSC_TESTNET,
  [CHAIN_IDS.BASE_SEPOLIA]: rpcUrls.BASE_SEPOLIA,
} as const

// 链信息
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
  [CHAIN_IDS.BASE]: {
    name: 'Base',
    symbol: 'ETH',
    decimals: 18,
    logoURI: getChainIconUrl(CHAIN_IDS.BASE) || 'https://cryptologos.cc/logos/base-base-logo.png',
  },
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
  [CHAIN_IDS.BASE_SEPOLIA]: {
    name: 'Base Sepolia',
    symbol: 'ETH',
    decimals: 18,
    logoURI: getChainIconUrl(CHAIN_IDS.BASE_SEPOLIA) || 'https://cryptologos.cc/logos/base-base-logo.png',
  },
} as const

// RainbowKit 连接器
const connectors = connectorsForWallets(
  [
    {
      groupName: '推荐',
      wallets: [metaMaskWallet, coinbaseWallet, injectedWallet],
    },
    {
      groupName: '其他钱包',
      wallets: [walletConnectWallet, safeWallet, trustWallet, ledgerWallet],
    },
  ],
  {
    appName: import.meta.env.VITE_APP_TITLE || 'Web3',
    projectId: getWalletConnectProjectId(),
  }
)

// Wagmi 配置
export const wagmiConfig = createConfig({
  chains: supportedChains,
  connectors,
  transports: supportedChains.reduce((acc, chain) => {
    const rpcUrl = RPC_URLS[chain.id as keyof typeof RPC_URLS]
    acc[chain.id] = http(rpcUrl || undefined)
    return acc
  }, {} as Record<number, ReturnType<typeof http>>),
  ssr: false,
})

export const SUPPORTED_CHAIN_IDS = supportedChains.map(chain => chain.id)

