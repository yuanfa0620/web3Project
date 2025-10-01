import React from 'react'
import { Card, Typography, Empty, Button } from 'antd'
import { TrophyOutlined } from '@ant-design/icons'
import styles from './index.module.less'

const { Title } = Typography

const StakingPage: React.FC = () => {
  return (
    <div className={styles.stakingPage}>
      <Title level={2} className={styles.pageTitle}>
        质押挖矿
      </Title>
      
      <Card className={styles.stakingCard}>
        <Empty
          description="质押功能开发中"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Button type="primary" icon={<TrophyOutlined />}>
            开始质押
          </Button>
        </Empty>
      </Card>
    </div>
  )
}

export default StakingPage
