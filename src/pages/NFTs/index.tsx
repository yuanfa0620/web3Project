import React from 'react'
import { Card, Typography, Empty, Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { PageTitle } from '@/components/PageTitle'
import styles from './index.module.less'

const { Title, Paragraph } = Typography

const NFTsPage: React.FC = () => {
  const { t } = useTranslation()
  
  return (
    <PageTitle title={t('pageTitle.nfts')}>
      <div className={styles.nftsPage}>
        <Title level={2} className={styles.pageTitle}>
          {t('nfts.title')}
        </Title>
        
        <Card className={styles.nftsCard}>
          <Empty
            description={t('nfts.noCollections')}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button type="primary" icon={<PlusOutlined />}>
              {t('nfts.addNFT')}
            </Button>
          </Empty>
        </Card>
      </div>
    </PageTitle>
  )
}

export default NFTsPage
