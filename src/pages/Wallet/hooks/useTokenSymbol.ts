import { useMemo } from 'react'
import { CHAIN_INFO } from '@/config/network'

/**
 * 根据链 ID 获取代币符号 Hook
 */
export const useTokenSymbol = (chainId?: number) => {
  const tokenSymbol = useMemo(() => {
    if (!chainId) {
      return 'ETH'
    }

    const chainInfo = CHAIN_INFO[chainId as keyof typeof CHAIN_INFO]
    return chainInfo?.symbol || 'ETH'
  }, [chainId])

  return {
    tokenSymbol,
  }
}

