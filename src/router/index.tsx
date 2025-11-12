import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import type { RouteObject } from 'react-router-dom'
import { Layout } from '@/layout'
import { allRoutes, type RouteConfig } from './routes'

// 将 RouteConfig 转换为 react-router-dom 的 RouteObject
const convertToRouteObject = (config: RouteConfig): RouteObject => {
  const route: RouteObject = {
    path: config.path,
    element: config.element,
  }
  
  if (config.children && config.children.length > 0) {
    route.children = config.children.map(convertToRouteObject)
  }
  
  return route
}

// 路由配置
const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: allRoutes.map(convertToRouteObject),
  },
]

// 创建路由
export const router = createBrowserRouter(routes)

export const Router = () => <RouterProvider router={router} />
