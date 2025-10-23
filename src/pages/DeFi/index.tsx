import React from 'react'
import { Card, Typography, Empty, Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { PageTitle } from '@/components/PageTitle'
import styles from './index.module.less'

const { Title } = Typography

const DeFiPage: React.FC = () => {
  const { t } = useTranslation()
  
  return (
    <PageTitle title={t('pageTitle.defi')}>
      <div className={styles.defiPage}>
        <Title level={2} className={styles.pageTitle}>
          {t('defi.title')}
        </Title>
        
        <Card className={styles.defiCard}>
          <Empty
            description={t('defi.noProtocols')}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button type="primary" icon={<PlusOutlined />}>
              {t('defi.addProtocol')}
            </Button>
          </Empty>
        </Card>
      </div>
    </PageTitle>
  )
}

export default DeFiPage
