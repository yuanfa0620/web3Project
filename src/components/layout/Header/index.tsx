import React, { useState } from 'react'
import { Layout, Menu, Button, Space, Typography, Drawer } from 'antd'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useLocation, useNavigate } from 'react-router-dom'
import { 
  WalletOutlined, 
  HomeOutlined, 
  SwapOutlined, 
  TrophyOutlined, 
  SettingOutlined,
  MenuOutlined,
  CloseOutlined
} from '@ant-design/icons'
import styles from './index.module.less'

const { Header: AntHeader } = Layout
const { Title } = Typography

const menuItems = [
  {
    key: '/',
    icon: <HomeOutlined />,
    label: '首页',
  },
  {
    key: '/wallet',
    icon: <WalletOutlined />,
    label: '钱包',
  },
  {
    key: '/tokens',
    icon: <SwapOutlined />,
    label: '代币',
  },
  {
    key: '/nfts',
    icon: <TrophyOutlined />,
    label: 'NFT',
  },
  {
    key: '/defi',
    icon: <SwapOutlined />,
    label: 'DeFi',
  },
  {
    key: '/swap',
    icon: <SwapOutlined />,
    label: '交易',
  },
  {
    key: '/staking',
    icon: <TrophyOutlined />,
    label: '质押',
  },
  {
    key: '/governance',
    icon: <TrophyOutlined />,
    label: '治理',
  },
  {
    key: '/analytics',
    icon: <TrophyOutlined />,
    label: '分析',
  },
  {
    key: '/settings',
    icon: <SettingOutlined />,
    label: '设置',
  },
]

export const Header: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key)
    setMobileMenuOpen(false) // 移动端点击菜单后关闭抽屉
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <AntHeader className={styles.header}>
      <div className={styles.headerContent}>
        {/* Logo */}
        <div className={styles.logo}>
          <Title level={3} className={styles.logoText}>
            Web3
          </Title>
        </div>

        {/* 桌面端菜单 */}
        <div className={styles.desktopMenu}>
          <Menu
            mode="horizontal"
            selectedKeys={[location.pathname]}
            onClick={handleMenuClick}
            items={menuItems}
            className={styles.menu}
          />
        </div>

        {/* 右侧按钮组 */}
        <div className={styles.rightButtons}>
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
          <div className={styles.drawerHeader}>
            <Title level={4} className={styles.drawerTitle}>
              Web3
            </Title>
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
        width={280}
        closable={false}
      >
        <Menu
          mode="vertical"
          selectedKeys={[location.pathname]}
          onClick={handleMenuClick}
          items={menuItems}
          className={styles.mobileMenu}
        />
      </Drawer>
    </AntHeader>
  )
}
