/**
 * 连接钱包卡片组件
 */
import React from 'react'
import { Card, Typography } from 'antd'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useTranslation } from 'react-i18next'
import styles from './index.module.less'

const { Text } = Typography

export const ConnectWalletCard: React.FC = () => {
  const { t } = useTranslation()

  return (
    <Card className={styles.connectCard}>
      <div className={styles.connectContent}>
        <Text>{t('profile.connectWalletFirst')}</Text>
        <ConnectButton />
      </div>
    </Card>
  )
}

