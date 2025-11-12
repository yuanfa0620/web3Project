import React from 'react'
import { Outlet } from 'react-router-dom'
import { SwapOutlined } from '@ant-design/icons'
import DeFiPage from '@/pages/DeFi'
import LiquidityPage from '@/pages/DeFi/Liquidity'
import FarmingPage from '@/pages/DeFi/Farming'
import type { RouteConfig } from './index'

// DeFi 布局组件，用于处理父路由和子路由的渲染
const DeFiLayout: React.FC = () => {
  return <Outlet />
}

// DeFi 路由配置（带二级页面）
export const defiRoutes: RouteConfig = {
  path: 'defi',
  element: <DeFiLayout />,
  title: 'DeFi',
  icon: <SwapOutlined />,
  menuLabel: 'navigation.defi',
  children: [
    {
      path: '', // index route，访问 /defi 时显示
      element: <DeFiPage />,
      title: 'DeFi',
      showInMenu: false, // 不在菜单中显示，只显示父路由
    },
    {
      path: 'liquidity',
      element: <LiquidityPage />,
      title: '流动性',
      showInMenu: false, // 二级页面不在菜单中显示
    },
    {
      path: 'farming',
      element: <FarmingPage />,
      title: '挖矿',
      showInMenu: false, // 二级页面不在菜单中显示
    },
  ],
}

