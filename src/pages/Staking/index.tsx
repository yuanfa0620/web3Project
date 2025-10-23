import React from 'react'
import { Card, Typography, Empty, Button } from 'antd'
import { TrophyOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { PageTitle } from '@/components/PageTitle'
import styles from './index.module.less'

const { Title } = Typography

const StakingPage: React.FC = () => {
  const { t } = useTranslation()
  
  return (
    <PageTitle title={t('pageTitle.staking')}>
      <div className={styles.stakingPage}>
        <Title level={2} className={styles.pageTitle}>
          {t('staking.title')}
        </Title>
        
        <Card className={styles.stakingCard}>
          <Empty
            description={t('staking.developing')}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button type="primary" icon={<TrophyOutlined />}>
              {t('staking.startStaking')}
            </Button>
          </Empty>
        </Card>
      </div>
    </PageTitle>
  )
}

export default StakingPage
