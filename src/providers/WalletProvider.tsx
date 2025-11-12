import '@rainbow-me/rainbowkit/styles.css'
import { getDefaultConfig, RainbowKitProvider, lightTheme } from '@rainbow-me/rainbowkit'
import { WagmiProvider } from 'wagmi'
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
import { useAppDispatch, useAppSelector } from '@/store'

// 配置支持的链（主网 + 测试网 + Base）
export const wagmiConfig = getDefaultConfig({
  appName: import.meta.env.VITE_APP_TITLE || 'Web3',
  projectId: getWalletConnectProjectId(),
  chains: [
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
  ],
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
