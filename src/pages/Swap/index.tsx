import React from 'react'
import { Card, Typography, Empty, Button } from 'antd'
import { SwapOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { PageTitle } from '@/components/PageTitle'
import styles from './index.module.less'

const { Title } = Typography

const SwapPage: React.FC = () => {
  const { t } = useTranslation()
  
  return (
    <PageTitle title={t('pageTitle.swap')}>
      <div className={styles.swapPage}>
        <Title level={2} className={styles.pageTitle}>
          {t('swap.title')}
        </Title>
        
        <Card className={styles.swapCard}>
          <Empty
            description={t('swap.developing')}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button type="primary" icon={<SwapOutlined />}>
              {t('swap.startSwap')}
            </Button>
          </Empty>
        </Card>
      </div>
    </PageTitle>
  )
}

export default SwapPage
