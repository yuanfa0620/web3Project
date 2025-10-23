import React from 'react'
import { Card, Typography, Empty, Button } from 'antd'
import { BarChartOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { PageTitle } from '@/components/PageTitle'
import styles from './index.module.less'

const { Title } = Typography

const AnalyticsPage: React.FC = () => {
  const { t } = useTranslation()
  
  return (
    <PageTitle title={t('pageTitle.analytics')}>
      <div className={styles.analyticsPage}>
        <Title level={2} className={styles.pageTitle}>
          {t('analytics.title')}
        </Title>
        
        <Card className={styles.analyticsCard}>
          <Empty
            description={t('analytics.developing')}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button type="primary" icon={<BarChartOutlined />}>
              {t('analytics.viewAnalytics')}
            </Button>
          </Empty>
        </Card>
      </div>
    </PageTitle>
  )
}

export default AnalyticsPage
