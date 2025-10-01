import React from 'react'
import { Card, Typography, Empty, Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import styles from './index.module.less'

const { Title } = Typography

const DeFiPage: React.FC = () => {
  return (
    <div className={styles.defiPage}>
      <Title level={2} className={styles.pageTitle}>
        DeFi 协议
      </Title>
      
      <Card className={styles.defiCard}>
        <Empty
          description="暂无 DeFi 协议"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Button type="primary" icon={<PlusOutlined />}>
            添加协议
          </Button>
        </Empty>
      </Card>
    </div>
  )
}

export default DeFiPage
