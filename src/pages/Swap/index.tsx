import React from 'react'
import { Card, Typography, Empty, Button } from 'antd'
import { SwapOutlined } from '@ant-design/icons'
import styles from './index.module.less'

const { Title } = Typography

const SwapPage: React.FC = () => {
  return (
    <div className={styles.swapPage}>
      <Title level={2} className={styles.pageTitle}>
        代币兑换
      </Title>
      
      <Card className={styles.swapCard}>
        <Empty
          description="兑换功能开发中"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Button type="primary" icon={<SwapOutlined />}>
            开始兑换
          </Button>
        </Empty>
      </Card>
    </div>
  )
}

export default SwapPage
