import React from 'react'
import { Card, Typography } from 'antd'
import { PageTitle } from '@/components/PageTitle'
import { useTranslation } from 'react-i18next'
import styles from './index.module.less'

const { Title, Paragraph } = Typography

const FarmingPage: React.FC = () => {
  const { t } = useTranslation()

  return (
    <PageTitle title={t('pageTitle.defiFarming')}>
      <div className={styles.farmingPage}>
        <Card>
          <Title level={2}>{t('defi.farmingPage.title')}</Title>
          <Paragraph>{t('defi.farmingPage.description')}</Paragraph>
        </Card>
      </div>
    </PageTitle>
  )
}

export default FarmingPage

