import React from 'react'
import { Card, Typography } from 'antd'
import { PageTitle } from '@/components/PageTitle'
import { useTranslation } from 'react-i18next'
import styles from './index.module.less'

const { Title, Paragraph } = Typography

const LiquidityPage: React.FC = () => {
  const { t } = useTranslation()

  return (
    <PageTitle title={t('pageTitle.defiLiquidity')}>
      <div className={styles.liquidityPage}>
        <Card>
          <Title level={2}>{t('defi.liquidityPage.title')}</Title>
          <Paragraph>{t('defi.liquidityPage.description')}</Paragraph>
        </Card>
      </div>
    </PageTitle>
  )
}

export default LiquidityPage

