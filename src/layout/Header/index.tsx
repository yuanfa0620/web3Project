import React, { useState, useMemo } from 'react'
import { Layout, Menu, Button, Typography, Drawer } from 'antd'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { MenuOutlined, CloseOutlined } from '@ant-design/icons'
import { LanguageSelector } from '@/components/LanguageSelector'
import { allRoutes } from '@/router/routes'
import { getMenuItemsFromRoutes } from '@/router/routes/utils'
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
    return getMenuItemsFromRoutes(allRoutes, t)
  }, [t])

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key)
    setMobileMenuOpen(false) // 移动端点击菜单后关闭抽屉
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  // 获取菜单高亮的key，如果是二级页面，返回父路由路径
  const getSelectedKey = (pathname: string): string => {
    // 查找所有带子路由的父路由
    const parentRoutes = allRoutes.filter(route => route.children && route.children.length > 0)

    // 检查当前路径是否匹配某个父路由的子路由
    for (const parentRoute of parentRoutes) {
      const parentPath = `/${parentRoute.path}`
      if (pathname.startsWith(`${parentPath}/`) || pathname === parentPath) {
        return parentPath
      }
    }

    // 其他情况返回完整路径
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

