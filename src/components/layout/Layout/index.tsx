import React from 'react'
import { Layout as AntLayout, ConfigProvider } from 'antd'
import { Outlet } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from '@/store'
import { Header } from '../Header'
import { Footer } from '../Footer'
import styles from './index.module.less'

const { Content } = AntLayout

export const Layout: React.FC = () => {
  return (
    <Provider store={store}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#1890ff',
            borderRadius: 6,
          },
        }}
      >
        <AntLayout className={styles.layout}>
          <Header />
          <Content className={styles.content}>
            <div className={styles.contentWrapper}>
              <Outlet />
            </div>
          </Content>
          <Footer />
        </AntLayout>
      </ConfigProvider>
    </Provider>
  )
}
