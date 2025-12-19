import type { RouteConfig } from './index'
import type { MenuProps } from 'antd'
import { getAssetsTab } from '@/utils/assetsStorage'

/**
 * 递归处理子路由，生成菜单项（支持嵌套子菜单）
 */
const processChildren = (
  children: RouteConfig[],
  parentPath: string,
  t: (key: string) => string
): MenuProps['items'] => {
  const items: MenuProps['items'] = []

  children.forEach((child) => {
    if (child.showInMenu === false) {
      return
    }

    const childPath = child.path === '' ? parentPath : `${parentPath}/${child.path}`
    
    // 如果子路由还有子路由（嵌套情况）
    if (child.children && child.children.length > 0) {
      const grandChildren = processChildren(child.children, childPath, t)
      const visibleGrandChildren = child.children.filter(gc => gc.showInMenu !== false)
      
      if (visibleGrandChildren.length > 0) {
        // 处理嵌套子菜单（如个人资产下的NFT和代币）
        // 父菜单项的key使用父路径，避免与子菜单项的key重复
        // 对于assets路由，点击时会通过Header组件中的onClick事件跳转到缓存的tab
        items.push({
          key: childPath, // 使用父路径作为key，避免与子菜单项key重复
          label: child.menuLabel ? t(child.menuLabel) : child.title || child.path,
          children: grandChildren,
        })
      }
    } else {
      // 普通子菜单项
      items.push({
        key: childPath,
        label: child.menuLabel ? t(child.menuLabel) : child.title || child.path,
      })
    }
  })

  return items
}

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

    const fullPath = basePath === '/' 
      ? (route.path === '' ? '/' : `/${route.path}`)
      : `${basePath}/${route.path}`

    // 如果有子路由，检查是否有需要显示在子菜单中的项
    if (route.children && route.children.length > 0) {
      // 过滤出需要在菜单中显示的子路由
      const visibleChildren = route.children.filter(child => child.showInMenu !== false)
      
      if (visibleChildren.length > 0) {
        // 生成子菜单项（支持嵌套）
        const subMenuItems = processChildren(route.children, fullPath, t)
        
        // 对于profile路由，点击时跳转到/profile（而不是第一个子路由）
        // 对于其他路由，如果有子菜单项，使用第一个子菜单项的key作为默认路径
        // 否则使用父路径
        let defaultPath = fullPath
        if (route.path !== 'profile' && subMenuItems && subMenuItems.length > 0 && subMenuItems[0]?.key) {
          defaultPath = subMenuItems[0].key as string
        }
        
        menuItems.push({
          key: defaultPath,
          icon: route.icon,
          label: route.menuLabel ? t(route.menuLabel) : route.title || route.path,
          children: subMenuItems,
        })
      } else {
        // 没有显示在菜单中的子路由，直接显示父路由
        menuItems.push({
          key: fullPath,
          icon: route.icon,
          label: route.menuLabel ? t(route.menuLabel) : route.title || route.path,
        })
      }
    } else {
      // 没有子路由的路由，直接添加到菜单
      menuItems.push({
        key: fullPath,
        icon: route.icon,
        label: route.menuLabel ? t(route.menuLabel) : route.title || route.path,
      })
    }
  })

  return menuItems
}

