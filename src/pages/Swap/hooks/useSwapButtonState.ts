import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { TokenConfig } from '@/types/swap'

interface UseSwapButtonStateParams {
  walletConnected: boolean
  fromToken: TokenConfig | null
  toToken: TokenConfig | null
  fromAmount: string
  fromAmountFromTo: string
  toAmount: string
  toAmountInput: string
  fromBalance: string
  needApprove: boolean
  activeInput: 'from' | 'to' | null
}

interface ButtonState {
  disabled: boolean
  text: string
  type: 'default' | 'primary' | 'dashed' | 'link' | 'text'
  needApprove: boolean
  needConnect: boolean
  insufficientBalance: boolean
}

/**
 * Swap 页面的按钮状态计算 Hook
 */
export const useSwapButtonState = ({
  walletConnected,
  fromToken,
  toToken,
  fromAmount,
  fromAmountFromTo,
  toAmount,
  toAmountInput,
  fromBalance,
  needApprove,
  activeInput,
}: UseSwapButtonStateParams): ButtonState => {
  const { t } = useTranslation()

  return useMemo(() => {
    if (!walletConnected) {
      return {
        disabled: false,
        text: t('swap.connectWallet'),
        type: 'primary' as const,
        needApprove: false,
        needConnect: true,
        insufficientBalance: false,
      }
    }

    if (!fromToken || !toToken) {
      return {
        disabled: true,
        text: t('swap.noTokenSelected'),
        type: 'default' as const,
        needApprove: false,
        needConnect: false,
        insufficientBalance: false,
      }
    }

    // 使用实际输入的值（根据activeInput决定）
    const actualFromAmount = activeInput === 'to' ? fromAmountFromTo : fromAmount

    if (!actualFromAmount || parseFloat(actualFromAmount) <= 0) {
      return {
        disabled: true,
        text: t('swap.enterAmount'),
        type: 'default' as const,
        needApprove: false,
        needConnect: false,
        insufficientBalance: false,
      }
    }

    if (parseFloat(actualFromAmount) > parseFloat(fromBalance || '0')) {
      return {
        disabled: true,
        text: t('swap.insufficientBalance'),
        type: 'default' as const,
        needApprove: false,
        needConnect: false,
        insufficientBalance: true,
      }
    }

    if (needApprove && !fromToken.isNative) {
      return {
        disabled: false,
        text: t('swap.approve'),
        type: 'primary' as const,
        needApprove: true,
        needConnect: false,
        insufficientBalance: false,
      }
    }

    return {
      disabled: false,
      text: t('swap.swap'),
      type: 'primary' as const,
      needApprove: false,
      needConnect: false,
      insufficientBalance: false,
    }
  }, [
    walletConnected,
    fromToken,
    toToken,
    fromAmount,
    fromAmountFromTo,
    fromBalance,
    needApprove,
    activeInput,
    t,
  ])
}

