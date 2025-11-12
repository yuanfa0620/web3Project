import type { RouteConfig } from './index'
import type { MenuProps } from 'antd'

/**
 * 从路由配置中提取菜单项
 * @param routes 路由配置数组
 * @param t 翻译函数
 * @param basePath 基础路径，默认为 '/'
 * @returns 菜单项数组
 */
export const getMenuItemsFromRoutes = (
  routes: RouteConfig[],
  t: (key: string) => string,
  basePath: string = '/'
): MenuProps['items'] => {
  const menuItems: MenuProps['items'] = []

  routes.forEach((route) => {
    // 如果路由配置了不在菜单中显示，则跳过
    if (route.showInMenu === false) {
      return
    }

    // 如果有子路由，只显示父路由（不显示子路由）
    if (route.children && route.children.length > 0) {
      const fullPath = basePath === '/' ? `/${route.path}` : `${basePath}/${route.path}`
      
      menuItems.push({
        key: fullPath,
        icon: route.icon,
        label: route.menuLabel ? t(route.menuLabel) : route.title || route.path,
      })
    } else {
      // 没有子路由的路由，直接添加到菜单
      const fullPath = basePath === '/' 
        ? (route.path === '' ? '/' : `/${route.path}`)
        : `${basePath}/${route.path}`
      
      menuItems.push({
        key: fullPath,
        icon: route.icon,
        label: route.menuLabel ? t(route.menuLabel) : route.title || route.path,
      })
    }
  })

  return menuItems
}

