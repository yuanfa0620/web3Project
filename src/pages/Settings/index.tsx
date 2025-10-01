import React from 'react'
import { Card, Typography, Empty, Button } from 'antd'
import { SettingOutlined } from '@ant-design/icons'
import styles from './index.module.less'

const { Title } = Typography

const SettingsPage: React.FC = () => {
  return (
    <div className={styles.settingsPage}>
      <Title level={2} className={styles.pageTitle}>
        系统设置
      </Title>
      
      <Card className={styles.settingsCard}>
        <Empty
          description="设置功能开发中"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Button type="primary" icon={<SettingOutlined />}>
            打开设置
          </Button>
        </Empty>
      </Card>
    </div>
  )
}

export default SettingsPage
