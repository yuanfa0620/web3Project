import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// 路由名称映射
const routeTitleMap: Record<string, string> = {
  '/': '首页',
  '/wallet': '钱包',
  '/tokens': '代币',
  '/nfts': 'NFT',
  '/defi': 'DeFi',
  '/swap': '交换',
  '/staking': '质押',
  '/governance': '治理',
  '/analytics': '分析',
  '/settings': '设置',
}

// 默认标题
const DEFAULT_TITLE = 'Web3 Project'

/**
 * 动态设置页面标题的Hook
 * @param customTitle 自定义标题，如果提供则覆盖路由标题
 */
export const usePageTitle = (customTitle?: string) => {
  const location = useLocation()

  useEffect(() => {
    // 获取当前路由对应的标题
    const routeTitle = routeTitleMap[location.pathname]

    // 确定最终标题
    let finalTitle = customTitle || routeTitle || DEFAULT_TITLE

    // 如果不是首页，添加项目名称后缀
    if (location.pathname !== '/' && !customTitle) {
      finalTitle = `${finalTitle} - ${DEFAULT_TITLE}`
    }

    // 设置文档标题
    document.title = finalTitle
  }, [location.pathname, customTitle])

  return {
    setTitle: (title: string) => {
      document.title = title
    },
    getCurrentTitle: () => document.title,
  }
}

/**
 * 获取路由对应的标题
 * @param pathname 路径名
 * @returns 对应的标题
 */
export const getRouteTitle = (pathname: string): string => {
  return routeTitleMap[pathname] || DEFAULT_TITLE
}
