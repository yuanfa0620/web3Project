import React from 'react'
import { Input, Button, Typography, Space } from 'antd'
import { useTranslation } from 'react-i18next'
import { TokenSelector } from '@/components/TokenSelector'
import type { TokenConfig } from '@/types/swap'
import styles from './index.module.less'

const { Text } = Typography

interface SwapInputProps {
  label: string
  token: TokenConfig | null
  amount: string
  balance: string
  loading?: boolean
  tokens?: TokenConfig[]
  onTokenSelect: (token: TokenConfig, chainId?: number) => void
  onAmountChange: (amount: string) => void
  onMaxClick?: () => void
  disabled?: boolean
  showMax?: boolean
  selectedChainId?: number | null
  onChainSelect?: (chainId: number) => void
  defaultChainId?: number | null
  onChainChange?: (chainId: number) => void
  otherSelectedToken?: TokenConfig | null // 另一个输入框已选择的代币（用于双向绑定显示）
  otherSelectedChainId?: number | null // 另一个输入框已选择的网络ID
}

export const SwapInput: React.FC<SwapInputProps> = ({
  label,
  token,
  amount,
  balance,
  loading = false,
  tokens,
  onTokenSelect,
  onAmountChange,
  onMaxClick,
  disabled = false,
  showMax = false,
  selectedChainId,
  onChainSelect,
  defaultChainId,
  onChainChange,
  otherSelectedToken,
  otherSelectedChainId,
}) => {
  const { t } = useTranslation()
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    // 只允许数字和小数点
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      // 如果有token，限制decimal位数
      if (token && value.includes('.')) {
        const parts = value.split('.')
        if (parts[1] && parts[1].length > token.decimals) {
          return // 超过decimal位数，不更新
        }
      }
      onAmountChange(value)
    }
  }

  return (
    <div className={styles.swapInput}>
      <div className={styles.inputHeader}>
        <Text type="secondary" className={styles.label}>
          {label}
        </Text>
        {token && (
          <Text type="secondary" className={styles.balance}>
            {t('swap.balance')}: {loading ? '...' : balance}
            {showMax && parseFloat(balance) > 0 && (
              <Button
                type="link"
                size="small"
                onClick={onMaxClick}
                className={styles.maxButton}
              >
                {t('swap.max')}
              </Button>
            )}
          </Text>
        )}
      </div>
      <div className={styles.inputWrapper}>
        <Input
          type="text"
          value={amount}
          onChange={handleAmountChange}
          placeholder="0.0"
          disabled={disabled || !token}
          className={styles.amountInput}
        />
        <div className={styles.tokenSelectorWrapper}>
          <TokenSelector
            tokens={tokens}
            selectedToken={token}
            onSelect={onTokenSelect}
            disabled={disabled}
            placeholder={t('swap.selectToken')}
            selectedChainId={selectedChainId}
            onChainSelect={onChainSelect}
            defaultChainId={defaultChainId}
            onChainChange={onChainChange}
            otherSelectedToken={otherSelectedToken}
            otherSelectedChainId={otherSelectedChainId}
          />
        </div>
      </div>
    </div>
  )
}

