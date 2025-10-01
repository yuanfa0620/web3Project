import React from 'react'
import { Card, Typography, Empty, Button } from 'antd'
import { BarChartOutlined } from '@ant-design/icons'
import styles from './index.module.less'

const { Title } = Typography

const AnalyticsPage: React.FC = () => {
  return (
    <div className={styles.analyticsPage}>
      <Title level={2} className={styles.pageTitle}>
        数据分析
      </Title>
      
      <Card className={styles.analyticsCard}>
        <Empty
          description="分析功能开发中"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Button type="primary" icon={<BarChartOutlined />}>
            查看分析
          </Button>
        </Empty>
      </Card>
    </div>
  )
}

export default AnalyticsPage
