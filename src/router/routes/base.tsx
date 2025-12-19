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
import NFTMarketplacePage from '@/pages/NFTMarketplace'
import CreateNFTPage from '@/pages/CreateNFT'
import SwapPage from '@/pages/Swap'
import StakingLayout from '@/pages/Staking/StakingLayout'
import StakingPage from '@/pages/Staking'
import StakingPoolDetailPage from '@/pages/StakingPoolDetail'
import ProfileLayout from '@/pages/Profile/ProfileLayout'
import ProfilePage from '@/pages/Profile'
import AssetsLayout from '@/pages/Profile/Assets/AssetsLayout'
import NFTAssetsPage from '@/pages/Profile/Assets/NFT'
import TokenAssetsPage from '@/pages/Profile/Assets/Token'
import NFTDetailPage from '@/pages/NFTDetail'
import GovernancePage from '@/pages/Governance'
import AnalyticsPage from '@/pages/Analytics'
import SettingsPage from '@/pages/Settings'
import { KeepAliveWrapper } from '@/components/KeepAlive/KeepAliveWrapper'
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
  // {
  //   path: 'tokens',
  //   element: <TokensPage />,
  //   title: '代币',
  //   icon: <SwapOutlined />,
  //   menuLabel: 'navigation.tokens',
  // },
  // {
  //   path: 'nfts',
  //   element: <NFTsPage />,
  //   title: 'NFT',
  //   icon: <TrophyOutlined />,
  //   menuLabel: 'navigation.nfts',
  // },
  {
    path: 'nft-marketplace',
    element: <NFTMarketplacePage />,
    title: 'NFT 市场',
    icon: <TrophyOutlined />,
    menuLabel: 'navigation.nftMarketplace',
  },
  // {
  //   path: 'create-nft',
  //   element: <CreateNFTPage />,
  //   title: '创建NFT',
  //   icon: <TrophyOutlined />,
  //   menuLabel: 'navigation.createNFT',
  // },
  {
    path: 'swap',
    element: <SwapPage />,
    title: '交换',
    icon: <SwapOutlined />,
    menuLabel: 'navigation.swap',
  },
  {
    path: 'staking',
    element: <StakingLayout />,
    title: '质押',
    icon: <TrophyOutlined />,
    menuLabel: 'navigation.staking',
    children: [
      {
        path: '',
        element: <StakingPage />,
        title: '质押',
        showInMenu: false,
      },
      {
        path: ':poolId',
        element: <StakingPoolDetailPage />,
        title: '质押池详情',
        showInMenu: false,
      },
    ],
  },
  {
    path: 'profile',
    element: <ProfileLayout />,
    title: '个人中心',
    icon: <SettingOutlined />,
    menuLabel: 'navigation.profile',
    children: [
      {
        path: '',
        element: <ProfilePage />,
        title: '个人中心',
        showInMenu: false,
      },
      {
        path: 'assets',
        element: <AssetsLayout />,
        title: '个人资产',
        menuLabel: 'navigation.assets',
        showInMenu: true,
        children: [
          {
            path: 'nft',
            element: (
              <KeepAliveWrapper name="nft-assets-page">
                <NFTAssetsPage />
              </KeepAliveWrapper>
            ),
            title: 'NFT',
            menuLabel: 'navigation.assetsNFT',
            showInMenu: true,
          },
          {
            path: 'token',
            element: <TokenAssetsPage />,
            title: '代币',
            menuLabel: 'navigation.assetsToken',
            showInMenu: true,
          },
        ],
      },
      {
        path: 'nft/:nftId',
        element: <NFTDetailPage />,
        title: 'NFT详情',
        showInMenu: false,
      },
    ],
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

