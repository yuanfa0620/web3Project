import { useMemo } from 'react'
import { CHAIN_INFO } from '@/config/network'

/**
 * 网络信息 Hook
 */
export const useNetworkInfo = (chainId?: number) => {
  const networkName = useMemo(() => {
    if (!chainId) {
      return 'Unknown'
    }

    const chainInfo = CHAIN_INFO[chainId as keyof typeof CHAIN_INFO]
    return chainInfo?.name || `Chain ${chainId}`
  }, [chainId])

  return {
    networkName,
  }
}

