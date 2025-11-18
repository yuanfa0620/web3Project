import React from 'react'
import { Layout as AntLayout, ConfigProvider } from 'antd'
import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { Banner } from '@/components/Banner'
import { usePageTitle } from '@/hooks/usePageTitle'
import styles from './index.module.less'

const { Content } = AntLayout

export const Layout: React.FC = () => {
  // 使用页面标题Hook
  usePageTitle()

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 6,
        },
      }}
    >
      <AntLayout className={styles.layout}>
        <Banner />
        <Header />
        <Content className={styles.content}>
          <div className={styles.contentWrapper}>
            <Outlet />
          </div>
        </Content>
        <Footer />
      </AntLayout>
    </ConfigProvider>
  )
}

