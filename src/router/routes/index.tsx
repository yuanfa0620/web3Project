import React from 'react'
import type { ReactNode } from 'react'
import NotFoundPage from '@/pages/NotFoundPage'
import { baseRoutes } from './base'
import { defiRoutes } from './defi'

// 路由配置接口
export interface RouteConfig {
  path: string
  element: React.ReactElement
  title?: string
  icon?: ReactNode // 菜单图标
  menuLabel?: string // 菜单标签的 i18n key
  showInMenu?: boolean // 是否在菜单中显示，默认为 true
  children?: RouteConfig[]
}

// 404 路由
export const notFoundRoute: RouteConfig = {
  path: '*',
  element: <NotFoundPage />,
  title: '页面未找到',
  showInMenu: false, // 404 页面不在菜单中显示
}

// 导出所有路由配置
export const allRoutes: RouteConfig[] = [
  ...baseRoutes,
  defiRoutes,
  notFoundRoute,
]
