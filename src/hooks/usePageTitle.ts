import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

// 路由标题键映射
const routeTitleKeyMap: Record<string, string> = {
  '/': 'pageTitle.home',
  '/wallet': 'pageTitle.wallet',
  '/tokens': 'pageTitle.tokens',
  '/nfts': 'pageTitle.nfts',
  '/defi': 'pageTitle.defi',
  '/swap': 'pageTitle.swap',
  '/staking': 'pageTitle.staking',
  '/governance': 'pageTitle.governance',
  '/analytics': 'pageTitle.analytics',
  '/settings': 'pageTitle.settings',
}

// 默认标题键
const DEFAULT_TITLE_KEY = 'pageTitle.home'

/**
 * 动态设置页面标题的Hook
 * @param customTitle 自定义标题，如果提供则覆盖路由标题
 */
export const usePageTitle = (customTitle?: string) => {
  const location = useLocation()
  const { t } = useTranslation()

  useEffect(() => {
    // 获取当前路由对应的标题键
    const routeTitleKey = routeTitleKeyMap[location.pathname]
    
    // 确定最终标题
    let finalTitle = customTitle || t(routeTitleKey || DEFAULT_TITLE_KEY)
    
    // 如果不是首页，添加项目名称后缀
    if (location.pathname !== '/' && !customTitle) {
      const projectTitle = t('pageTitle.home')
      finalTitle = `${finalTitle} - ${projectTitle}`
    }
    
    // 设置文档标题
    document.title = finalTitle
  }, [location.pathname, customTitle, t])

  return {
    setTitle: (title: string) => {
      document.title = title
    },
    getCurrentTitle: () => document.title,
  }
}

/**
 * 获取路由对应的标题键
 * @param pathname 路径名
 * @returns 对应的标题键
 */
export const getRouteTitleKey = (pathname: string): string => {
  return routeTitleKeyMap[pathname] || DEFAULT_TITLE_KEY
}
