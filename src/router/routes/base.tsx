import React from 'react'
import {
  HomeOutlined,
  WalletOutlined,
  SwapOutlined,
  TrophyOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import HomePage from '@/pages/Home'
import WalletPage from '@/pages/Wallet'
import TokensPage from '@/pages/Tokens'
import NFTsPage from '@/pages/NFTs'
import SwapPage from '@/pages/Swap'
import StakingPage from '@/pages/Staking'
import GovernancePage from '@/pages/Governance'
import AnalyticsPage from '@/pages/Analytics'
import SettingsPage from '@/pages/Settings'
import type { RouteConfig } from './index'

// 基础路由配置
export const baseRoutes: RouteConfig[] = [
  {
    path: '',
    element: <HomePage />,
    title: '首页',
    icon: <HomeOutlined />,
    menuLabel: 'navigation.home',
  },
  {
    path: 'wallet',
    element: <WalletPage />,
    title: '钱包',
    icon: <WalletOutlined />,
    menuLabel: 'navigation.wallet',
  },
  {
    path: 'tokens',
    element: <TokensPage />,
    title: '代币',
    icon: <SwapOutlined />,
    menuLabel: 'navigation.tokens',
  },
  {
    path: 'nfts',
    element: <NFTsPage />,
    title: 'NFT',
    icon: <TrophyOutlined />,
    menuLabel: 'navigation.nfts',
  },
  {
    path: 'swap',
    element: <SwapPage />,
    title: '交换',
    icon: <SwapOutlined />,
    menuLabel: 'navigation.swap',
  },
  {
    path: 'staking',
    element: <StakingPage />,
    title: '质押',
    icon: <TrophyOutlined />,
    menuLabel: 'navigation.staking',
  },
  // {
  //   path: 'governance',
  //   element: <GovernancePage />,
  //   title: '治理',
  //   icon: <TrophyOutlined />,
  //   menuLabel: 'navigation.governance',
  // },
  // {
  //   path: 'analytics',
  //   element: <AnalyticsPage />,
  //   title: '分析',
  //   icon: <TrophyOutlined />,
  //   menuLabel: 'navigation.analytics',
  // },
  // {
  //   path: 'settings',
  //   element: <SettingsPage />,
  //   title: '设置',
  //   icon: <SettingOutlined />,
  //   menuLabel: 'navigation.settings',
  // },
]

