import '@rainbow-me/rainbowkit/styles.css'
import { connectorsForWallets, RainbowKitProvider, lightTheme } from '@rainbow-me/rainbowkit'
import {
  metaMaskWallet,
  coinbaseWallet,
  walletConnectWallet,
  injectedWallet,
  safeWallet,
  trustWallet,
  ledgerWallet,
} from '@rainbow-me/rainbowkit/wallets'
import { WagmiProvider, createConfig, http } from 'wagmi'
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
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RPC_URLS } from '@/constants/chains'
import { getWalletConnectProjectId } from '@/config/constants'
import { useAppSelector } from '@/store'

// 支持的链列表
const chains = [
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
] as const

// 配置钱包连接器，优先显示浏览器内置钱包
const connectors = connectorsForWallets(
  [
    {
      groupName: '推荐',
      wallets: [
        metaMaskWallet, // MetaMask
        coinbaseWallet, // Coinbase Wallet
        injectedWallet, // 浏览器内置钱包（如 Brave Wallet）
      ],
    },
    {
      groupName: '其他钱包',
      wallets: [
        walletConnectWallet, // WalletConnect
        safeWallet, // Safe Wallet
        trustWallet, // Trust Wallet
        ledgerWallet, // Ledger
      ],
    },
  ],
  {
    appName: import.meta.env.VITE_APP_TITLE || 'Web3',
    projectId: getWalletConnectProjectId(),
  }
)

// 配置支持的链（主网 + 测试网 + Base）
export const wagmiConfig = createConfig({
  chains,
  connectors,
  transports: chains.reduce((acc, chain) => {
    const rpcUrl = RPC_URLS[chain.id as keyof typeof RPC_URLS]
    acc[chain.id] = http(rpcUrl || undefined)
    return acc
  }, {} as Record<number, ReturnType<typeof http>>),
  ssr: false,
})

// 创建 QueryClient
const queryClient = new QueryClient()

interface WalletProviderProps {
  children: React.ReactNode
}

export const WalletProvider = ({ children }: WalletProviderProps) => {
  const currentLanguage = useAppSelector(state => state.app.language)

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={lightTheme()} locale={currentLanguage} showRecentTransactions>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
