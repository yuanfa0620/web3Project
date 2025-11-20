/**
 * Mint代币按钮组件
 */
import React, { useEffect } from 'react'
import { Button, Card, Space, Typography, Alert } from 'antd'
import { useTranslation } from 'react-i18next'
import { useAccount } from 'wagmi'
import { useMintToken } from '../../hooks/useMintToken'
import { CONFIG } from '@/config/constants'
import styles from './index.module.less'

const { Text } = Typography

export const MintTokenButton: React.FC = () => {
  const { t } = useTranslation()
  const { address, chainId, isConnected } = useAccount()
  const { mint, loading, checkingBalance, balance, checkBalance } = useMintToken()

  // 组件挂载时检查余额
  useEffect(() => {
    if (isConnected && address && chainId) {
      checkBalance()
    }
  }, [isConnected, address, chainId, checkBalance])

  if (!isConnected) {
    return null
  }

  const tokenAddress = chainId ? CONFIG.TOKEN_CONTRACTS[chainId as keyof typeof CONFIG.TOKEN_CONTRACTS] : ''
  const hasTokenContract = !!tokenAddress
  const balanceValue = parseFloat(balance || '0')
  const isBalanceExceeded = balanceValue >= CONFIG.MINT.MAX_BALANCE

  return (
    <Card className={styles.mintCard}>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <div>
          <Text strong>{t('profile.mint.title')}</Text>
        </div>

        {hasTokenContract ? (
          <>
            <div>
              <Text type="secondary">{t('profile.mint.currentBalance')}: </Text>
              <Text strong>{checkingBalance ? t('common.loading') : `${balance || '0'} 代币`}</Text>
            </div>

            {isBalanceExceeded && (
              <Alert
                message={t('profile.mint.balanceExceeded', { maxBalance: CONFIG.MINT.MAX_BALANCE })}
                type="warning"
                showIcon
              />
            )}

            <Alert
              message={t('profile.mint.costInfo', { cost: CONFIG.MINT.COST })}
              type="info"
              showIcon
            />

            <Button
              type="primary"
              size="large"
              loading={loading || checkingBalance}
              disabled={isBalanceExceeded}
              onClick={mint}
              block
            >
              {loading ? t('profile.mint.minting') : t('profile.mint.button')}
            </Button>
          </>
        ) : (
          <Alert
            message={t('profile.mint.tokenContractNotConfigured')}
            type="warning"
            showIcon
          />
        )}
      </Space>
    </Card>
  )
}

