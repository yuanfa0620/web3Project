import React from 'react'
import { Card, Typography, Empty, Button } from 'antd'
import { TeamOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { PageTitle } from '@/components/PageTitle'
import styles from './index.module.less'

const { Title } = Typography

const GovernancePage: React.FC = () => {
  const { t } = useTranslation()
  
  return (
    <PageTitle title={t('pageTitle.governance')}>
      <div className={styles.governancePage}>
        <Title level={2} className={styles.pageTitle}>
          {t('governance.title')}
        </Title>
        
        <Card className={styles.governanceCard}>
          <Empty
            description={t('governance.developing')}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button type="primary" icon={<TeamOutlined />}>
              {t('governance.participate')}
            </Button>
          </Empty>
        </Card>
      </div>
    </PageTitle>
  )
}

export default GovernancePage
