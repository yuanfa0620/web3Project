import { useMemo } from 'react'
import { formatAmount } from '@/utils/swapUtils'
import { applySlippageDecrease, applySlippageIncrease } from '@/utils/preciseMath'

interface UseSwapDisplayAmountParams {
  activeInput: 'from' | 'to' | null
  fromAmount: string
  fromAmountFromTo: string
  toAmount: string
  toAmountInput: string
  slippage: number
  expertMode: boolean
}

/**
 * Swap 页面的显示数量格式化 Hook
 * 根据滑点调整显示的数量
 */
export const useSwapDisplayAmount = ({
  activeInput,
  fromAmount,
  fromAmountFromTo,
  toAmount,
  toAmountInput,
  slippage,
  expertMode,
}: UseSwapDisplayAmountParams) => {
  // 根据activeInput决定显示哪个值，并格式化
  // 当activeInput是'from'时，toAmount需要根据滑点调整（减少滑点百分比）
  // 当activeInput是'to'时，fromAmount需要根据滑点调整（增加滑点百分比）
  // 专家模式下，不自动计算和显示对应的代币数量
  const displayToAmount = useMemo(() => {
    if (activeInput === 'to') {
      // 用户正在输入to，保持原样
      return toAmountInput
    }
    
    // 用户正在输入from，显示toAmount
    const rawAmount = toAmount || ''
    if (!rawAmount || parseFloat(rawAmount) <= 0) {
      return formatAmount(rawAmount)
    }
    
    // 如果专家模式开启，直接显示计算出的代币数量，不应用滑点
    if (expertMode) {
      return formatAmount(rawAmount)
    }
    
    // 非专家模式：应用滑点：减少滑点百分比（例如：滑点1%意味着最少得到99%）
    // 使用精确计算避免浮点数精度问题
    const adjustedAmount = applySlippageDecrease(rawAmount, slippage)
    return formatAmount(adjustedAmount)
  }, [activeInput, toAmountInput, toAmount, slippage, expertMode])

  const displayFromAmount = useMemo(() => {
    if (activeInput === 'from') {
      // 用户正在输入from，保持原样
      return fromAmount
    }
    
    // 用户正在输入to，显示fromAmount
    const rawAmount = fromAmountFromTo || ''
    if (!rawAmount || parseFloat(rawAmount) <= 0) {
      return formatAmount(rawAmount)
    }
    
    // 如果专家模式开启，直接显示计算出的代币数量，不应用滑点
    if (expertMode) {
      return formatAmount(rawAmount)
    }
    
    // 非专家模式：应用滑点：增加滑点百分比（例如：滑点1%意味着需要多付出1%）
    // 使用精确计算避免浮点数精度问题
    const adjustedAmount = applySlippageIncrease(rawAmount, slippage)
    return formatAmount(adjustedAmount)
  }, [activeInput, fromAmountFromTo, fromAmount, slippage, expertMode])

  return {
    displayFromAmount,
    displayToAmount,
  }
}
