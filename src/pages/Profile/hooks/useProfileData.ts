/**
 * 个人中心数据加载 Hook
 */
import { useMemo } from 'react'
import { loadTransactions, loadUserNFTs } from '../utils/dataLoader'

export const useProfileData = (address: string | undefined) => {
  // 加载交易记录
  const transactions = useMemo(() => {
    if (!address) return []
    return loadTransactions(address)
  }, [address])

  // 加载NFT列表
  const nfts = useMemo(() => {
    if (!address) return []
    return loadUserNFTs(address)
  }, [address])

  return {
    transactions,
    nfts,
  }
}

