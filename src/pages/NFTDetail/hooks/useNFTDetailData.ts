/**
 * NFT详情数据加载 Hook
 */
import { useMemo } from 'react'
import { loadNFTDetail, loadNFTTransactions } from '@/pages/Profile/utils/dataLoader'

export const useNFTDetailData = (nftId: string | undefined) => {
  // 加载NFT详情
  const nft = useMemo(() => {
    if (!nftId) return null
    return loadNFTDetail(nftId)
  }, [nftId])

  // 加载交易记录
  const transactions = useMemo(() => {
    if (!nftId) return []
    return loadNFTTransactions(nftId)
  }, [nftId])

  return {
    nft,
    transactions,
  }
}

