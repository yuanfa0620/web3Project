import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import HomePage from '@/pages/Home'
import WalletPage from '@/pages/Wallet'
import TokensPage from '@/pages/Tokens'
import NFTsPage from '@/pages/NFTs'
import DeFiPage from '@/pages/DeFi'
import SwapPage from '@/pages/Swap'
import StakingPage from '@/pages/Staking'
import GovernancePage from '@/pages/Governance'
import AnalyticsPage from '@/pages/Analytics'
import SettingsPage from '@/pages/Settings'
import NotFoundPage from '@/pages/NotFoundPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'wallet',
        element: <WalletPage />,
      },
      {
        path: 'tokens',
        element: <TokensPage />,
      },
      {
        path: 'nfts',
        element: <NFTsPage />,
      },
      {
        path: 'defi',
        element: <DeFiPage />,
      },
      {
        path: 'swap',
        element: <SwapPage />,
      },
      {
        path: 'staking',
        element: <StakingPage />,
      },
      {
        path: 'governance',
        element: <GovernancePage />,
      },
      {
        path: 'analytics',
        element: <AnalyticsPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
])

export const Router = () => <RouterProvider router={router} />
