import React, { useState, useMemo } from 'react'
import { Layout, Menu, Button, Typography, Drawer } from 'antd'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { MenuOutlined, CloseOutlined } from '@ant-design/icons'
import { LanguageSelector } from '@/components/LanguageSelector'
import { allRoutes } from '@/router/routes'
import { getMenuItemsFromRoutes } from '@/router/routes/utils'
import { getAssetsTab } from '@/utils/assetsStorage'
import logoImg from '@/assets/logo.png'
import styles from './index.module.less'

const { Header: AntHeader } = Layout
const { Title } = Typography

export const Header: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // 从路由配置中生成菜单项
  const menuItems = useMemo(() => {
    const items = getMenuItemsFromRoutes(allRoutes, t)
    
    // 处理菜单项，让父菜单的label可以点击跳转
    const processMenuItems = (itemsList: typeof items): typeof items => {
      if (!itemsList) return itemsList
      
      return itemsList.map(item => {
        if (!item) return item
        
        // 检查是否是profile菜单项
        if (item.key === '/profile' && 'children' in item && item.children) {
          // 为profile菜单项添加可点击的label
          return {
            ...item,
            label: (
              <span
                onClick={(e) => {
                  e.stopPropagation()
                  navigate('/profile')
                  setMobileMenuOpen(false)
                }}
                style={{ cursor: 'pointer' }}
              >
                {item.label}
              </span>
            ),
          } as typeof item
        }
        
        // 递归处理嵌套的菜单项（先递归，这样可以在子菜单中找到个人资产）
        if ('children' in item && item.children) {
          const processedChildren = processMenuItems(item.children)
          
          // 检查是否是个人资产菜单项（/profile/assets/xxx格式的key，位于profile的子菜单中）
          if (item.key && typeof item.key === 'string' && item.key.startsWith('/profile/assets/')) {
            // 为个人资产菜单项添加可点击的label，点击时从sessionStorage读取最新的缓存tab并跳转
            return {
              ...item,
              label: (
                <span
                  onClick={(e) => {
                    e.stopPropagation()
                    // 从sessionStorage读取最新的缓存tab，确保跳转到最近访问的页面
                    const cachedTab = getAssetsTab()
                    navigate(`/profile/assets/${cachedTab}`)
                    setMobileMenuOpen(false)
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  {item.label}
                </span>
              ),
              children: processedChildren,
            } as typeof item
          }
          
          return {
            ...item,
            children: processedChildren,
          } as typeof item
        }
        
        return item
      })
    }
    
    return processMenuItems(items)
  }, [t, navigate])

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key)
    setMobileMenuOpen(false) // 移动端点击菜单后关闭抽屉
  }


  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  // 递归查找匹配的路由路径（支持嵌套子路由）
  const findMatchingRoutePath = (pathname: string, routes: typeof allRoutes, basePath: string = ''): string | null => {
    for (const route of routes) {
      const routePath = basePath === '' ? `/${route.path}` : `${basePath}/${route.path}`
      
      // 精确匹配
      if (pathname === routePath || (route.path === '' && pathname === basePath)) {
        // 如果这个路由显示在菜单中，返回它
        if (route.showInMenu !== false) {
          return routePath
        }
        // 如果不显示在菜单中，但它是默认路由（path为空），继续查找其父路由
        if (route.path === '' && route.children) {
          const childResult = findMatchingRoutePath(pathname, route.children, basePath)
          if (childResult) return childResult
        }
      }
      
      // 前缀匹配（子路由）
      if (pathname.startsWith(`${routePath}/`)) {
        if (route.children && route.children.length > 0) {
          const childResult = findMatchingRoutePath(pathname, route.children, routePath)
          if (childResult) return childResult
        }
        // 如果没有子路由或没找到匹配的子路由，返回当前路由路径（如果显示在菜单中）
        if (route.showInMenu !== false) {
          return routePath
        }
      }
    }
    return null
  }

  // 获取菜单高亮的key
  const getSelectedKey = (pathname: string): string => {
    // 先尝试精确匹配
    const matched = findMatchingRoutePath(pathname, allRoutes)
    if (matched) return matched

    // 如果没有找到，使用原来的逻辑作为后备
    for (const parentRoute of allRoutes) {
      const parentPath = `/${parentRoute.path}`
      if (pathname.startsWith(`${parentPath}/`) || pathname === parentPath) {
        return parentPath
      }
    }

    return pathname
  }

  return (
    <AntHeader className={styles.header}>
      <div className={styles.headerContent}>
        {/* Logo */}
        <div className={styles.logo} onClick={() => navigate('/')}>
          <img src={logoImg} alt="Logo" className={styles.logoImage} />
          <Title level={3} className={styles.logoText}>
            Web3
          </Title>
        </div>

        {/* 桌面端菜单 */}
        <div className={styles.desktopMenu}>
          <Menu
            mode="horizontal"
            selectedKeys={[getSelectedKey(location.pathname)]}
            onClick={handleMenuClick}
            items={menuItems}
            className={styles.menu}
            triggerSubMenuAction="hover"
          />
        </div>

        {/* 右侧按钮组 */}
        <div className={styles.rightButtons}>
          {/* 语言切换器 - 桌面端（H5时隐藏） */}
          <div className={styles.languageSelector}>
            <LanguageSelector type="desktop" />
          </div>

          {/* 钱包连接 */}
          <div className={styles.walletContainer}>
            <ConnectButton
              chainStatus="icon"
              accountStatus={{
                smallScreen: 'avatar',
                largeScreen: 'full',
              }}
              showBalance={{
                smallScreen: false,
                largeScreen: true,
              }}
            />
          </div>

          {/* 移动端菜单按钮 */}
          <Button
            type="text"
            icon={<MenuOutlined />}
            className={styles.mobileMenuButton}
            onClick={toggleMobileMenu}
          />
        </div>
      </div>

      {/* 移动端抽屉菜单 */}
      <Drawer
        title={
          <div className={styles.drawerHeader} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div
              className={styles.drawerLogoContainer}
              onClick={() => {
                navigate('/')
                setMobileMenuOpen(false)
              }}
              style={{ display: 'flex', alignItems: 'center', gap: 10 }}
            >
              <img
                src={logoImg}
                alt="Logo"
                className={styles.drawerLogoImage}
                width={32}
                height={32}
              />
              <Title level={4} className={styles.drawerTitle} style={{ margin: 0 }}>
                Web3
              </Title>
            </div>
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={() => setMobileMenuOpen(false)}
              className={styles.closeButton}
            />
          </div>
        }
        placement="right"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        className={styles.mobileDrawer}
        size={280}
        closable={false}
      >
        {/* 移动端语言切换器 */}
        <LanguageSelector type="mobile" />

        <Menu
          mode="vertical"
          selectedKeys={[getSelectedKey(location.pathname)]}
          onClick={handleMenuClick}
          items={menuItems}
          className={styles.mobileMenu}
        />
      </Drawer>
    </AntHeader>
  )
}

