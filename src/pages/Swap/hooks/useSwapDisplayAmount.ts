import { useMemo } from 'react'
import { formatAmount } from '@/utils/swapUtils'

interface UseSwapDisplayAmountParams {
  activeInput: 'from' | 'to' | null
  fromAmount: string
  fromAmountFromTo: string
  toAmount: string
  toAmountInput: string
}

/**
 * Swap 页面的显示数量格式化 Hook
 */
export const useSwapDisplayAmount = ({
  activeInput,
  fromAmount,
  fromAmountFromTo,
  toAmount,
  toAmountInput,
}: UseSwapDisplayAmountParams) => {
  // 根据activeInput决定显示哪个值，并格式化
  const displayToAmount = useMemo(() => {
    const rawAmount = activeInput === 'to' ? toAmountInput : (toAmount || '')
    // 如果用户正在输入to，保持原样；否则格式化
    if (activeInput === 'to') {
      return rawAmount
    }
    return formatAmount(rawAmount)
  }, [activeInput, toAmountInput, toAmount])

  const displayFromAmount = useMemo(() => {
    const rawAmount = activeInput === 'to' ? (fromAmountFromTo || '') : fromAmount
    // 如果用户正在输入from，保持原样；否则格式化
    if (activeInput === 'from') {
      return rawAmount
    }
    return formatAmount(rawAmount)
  }, [activeInput, fromAmountFromTo, fromAmount])

  return {
    displayFromAmount,
    displayToAmount,
  }
}

