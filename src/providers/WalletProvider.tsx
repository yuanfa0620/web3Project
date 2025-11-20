import '@rainbow-me/rainbowkit/styles.css'
import { RainbowKitProvider, lightTheme } from '@rainbow-me/rainbowkit'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { wagmiConfig } from '@/config/network'
import { useAppSelector } from '@/store'

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
