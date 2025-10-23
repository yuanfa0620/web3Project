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

// 路由配置接口
interface RouteConfig {
  path: string
  element: React.ReactElement
  title?: string
  children?: RouteConfig[]
}

// 路由配置
const routes: RouteConfig[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '',
        element: <HomePage />,
        title: '首页',
      },
      {
        path: 'wallet',
        element: <WalletPage />,
        title: '钱包',
      },
      {
        path: 'tokens',
        element: <TokensPage />,
        title: '代币',
      },
      {
        path: 'nfts',
        element: <NFTsPage />,
        title: 'NFT',
      },
      {
        path: 'defi',
        element: <DeFiPage />,
        title: 'DeFi',
      },
      {
        path: 'swap',
        element: <SwapPage />,
        title: '交换',
      },
      {
        path: 'staking',
        element: <StakingPage />,
        title: '质押',
      },
      {
        path: 'governance',
        element: <GovernancePage />,
        title: '治理',
      },
      {
        path: 'analytics',
        element: <AnalyticsPage />,
        title: '分析',
      },
      {
        path: 'settings',
        element: <SettingsPage />,
        title: '设置',
      },
      {
        path: '*',
        element: <NotFoundPage />,
        title: '页面未找到',
      },
    ],
  },
]

// 创建路由
export const router = createBrowserRouter(routes)

export const Router = () => <RouterProvider router={router} />
