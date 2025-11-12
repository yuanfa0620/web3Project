import React from 'react'
import { Card, Typography } from 'antd'
import { PageTitle } from '@/components/PageTitle'
import { useTranslation } from 'react-i18next'
import styles from './index.module.less'

const { Title, Paragraph } = Typography

const FarmingPage: React.FC = () => {
  const { t } = useTranslation()

  return (
    <PageTitle title="挖矿">
      <div className={styles.farmingPage}>
        <Card>
          <Title level={2}>流动性挖矿</Title>
          <Paragraph>这是 DeFi 的挖矿页面</Paragraph>
        </Card>
      </div>
    </PageTitle>
  )
}

export default FarmingPage

