import React, { useEffect } from 'react'
import { Layout as AntLayout, ConfigProvider, App } from 'antd'
import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { Banner } from '@/components/Banner'
import { usePageTitle } from '@/hooks/usePageTitle'
import { setMessageInstance } from '@/utils/message'
import styles from './index.module.less'

const { Content } = AntLayout

const LayoutContent: React.FC = () => {
  const { message } = App.useApp()
  
  // 设置全局 message 实例
  useEffect(() => {
    setMessageInstance(message)
  }, [message])

  return (
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
  )
}

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
      <App>
        <LayoutContent />
      </App>
    </ConfigProvider>
  )
}

