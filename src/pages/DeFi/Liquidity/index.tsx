import React from 'react'
import { Card, Typography } from 'antd'
import { PageTitle } from '@/components/PageTitle'
import { useTranslation } from 'react-i18next'
import styles from './index.module.less'

const { Title, Paragraph } = Typography

const LiquidityPage: React.FC = () => {
  const { t } = useTranslation()

  return (
    <PageTitle title="流动性">
      <div className={styles.liquidityPage}>
        <Card>
          <Title level={2}>流动性池</Title>
          <Paragraph>这是 DeFi 的流动性页面</Paragraph>
        </Card>
      </div>
    </PageTitle>
  )
}

export default LiquidityPage

