import React from 'react'
import { Card, Typography, Empty, Button } from 'antd'
import { TeamOutlined } from '@ant-design/icons'
import styles from './index.module.less'

const { Title } = Typography

const GovernancePage: React.FC = () => {
  return (
    <div className={styles.governancePage}>
      <Title level={2} className={styles.pageTitle}>
        治理投票
      </Title>
      
      <Card className={styles.governanceCard}>
        <Empty
          description="治理功能开发中"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Button type="primary" icon={<TeamOutlined />}>
            参与治理
          </Button>
        </Empty>
      </Card>
    </div>
  )
}

export default GovernancePage
