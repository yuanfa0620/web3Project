import { useState, useEffect, useRef, useCallback } from 'react'
import { debounce, throttle } from 'lodash-es'
import type { TokenConfig } from '@/types/swap'

// 预留接口：获取兑换数量
export const getSwapQuote = async (
  fromToken: TokenConfig,
  toToken: TokenConfig,
  amount: string,
  chainId: number,
  dexRouter?: string
): Promise<string> => {
  // TODO: 实现实际的合约调用逻辑
  // 这里预留接口，后续可以调用Uniswap V2/V3、PancakeSwap等DEX的Router合约
  // 示例：调用getAmountsOut或quoter合约
  
  // 模拟延迟
  await new Promise(resolve => setTimeout(resolve, 300))
  
  // 临时返回模拟数据（实际应该调用合约）
  if (!amount || parseFloat(amount) <= 0) {
    return '0'
  }
  
  // 这里应该调用实际的DEX合约获取兑换数量
  // 例如：Uniswap V2的getAmountsOut或Uniswap V3的quoter
  return (parseFloat(amount) * 1.5).toFixed(6) // 临时模拟
}

export const useSwapQuote = (
  fromToken: TokenConfig | null,
  toToken: TokenConfig | null,
  fromAmount: string,
  chainId: number | null
) => {
  const [toAmount, setToAmount] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 防抖函数：500ms延迟
  const debouncedFetchQuote = useRef(
    debounce(async (
      from: TokenConfig,
      to: TokenConfig,
      amount: string,
      chain: number
    ) => {
      if (!amount || parseFloat(amount) <= 0) {
        setToAmount('')
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)
      try {
        const quote = await getSwapQuote(from, to, amount, chain)
        setToAmount(quote)
      } catch (err) {
        setError(err instanceof Error ? err.message : '获取报价失败')
        setToAmount('')
      } finally {
        setLoading(false)
      }
    }, 500)
  ).current

  // 节流函数：1000ms间隔
  const throttledFetchQuote = useRef(
    throttle(async (
      from: TokenConfig,
      to: TokenConfig,
      amount: string,
      chain: number
    ) => {
      if (!amount || parseFloat(amount) <= 0) {
        setToAmount('')
        return
      }

      setLoading(true)
      setError(null)
      try {
        const quote = await getSwapQuote(from, to, amount, chain)
        setToAmount(quote)
      } catch (err) {
        setError(err instanceof Error ? err.message : '获取报价失败')
        setToAmount('')
      } finally {
        setLoading(false)
      }
    }, 1000)
  ).current

  useEffect(() => {
    if (!fromToken || !toToken || !fromAmount || !chainId) {
      setToAmount('')
      setLoading(false)
      return
    }

    if (fromToken.address === toToken.address) {
      setToAmount('')
      return
    }

    // 使用防抖
    debouncedFetchQuote(fromToken, toToken, fromAmount, chainId)

    // 清理函数
    return () => {
      debouncedFetchQuote.cancel()
    }
  }, [fromToken, toToken, fromAmount, chainId, debouncedFetchQuote])

  return {
    toAmount,
    loading,
    error,
    // 手动触发（使用节流）
    fetchQuote: useCallback(() => {
      if (fromToken && toToken && fromAmount && chainId) {
        throttledFetchQuote(fromToken, toToken, fromAmount, chainId)
      }
    }, [fromToken, toToken, fromAmount, chainId, throttledFetchQuote]),
  }
}

