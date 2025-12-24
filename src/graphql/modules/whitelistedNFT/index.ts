// 白名单 NFT API
import { request } from '../../client'
import { GET_WHITELISTED_NFTS, GET_WHITELISTED_NFT } from '../../queries'
import { WhitelistedNFT, type GetWhitelistedNFTsParams } from './types'
import { PaginatedList } from '../data/types'

/**
 * 获取白名单 NFT 列表
 */
export const getWhitelistedNFTs = async (
  params: GetWhitelistedNFTsParams = {}
): Promise<PaginatedList<WhitelistedNFT>> => {
  const { first = 100, skip = 0, orderBy = 'addedAt', orderDirection = 'desc', ...filters } = params

  const where: any = {}
  if (filters.nftContract) {
    where.nftContract = filters.nftContract.toLowerCase()
  }
  if (filters.isActive !== undefined) {
    where.isActive = filters.isActive
  }

  const response = await request<{
    whitelistedNFTs: Array<{
      id: string
      nftContract: string
      name?: string
      symbol?: string
      platformFeeRate: string
      isActive: boolean
      addedAt: string
      removedAt?: string
      addedBlockNumber: string
      removedBlockNumber?: string
    }>
  }>(GET_WHITELISTED_NFTS, {
    first,
    skip,
    orderBy,
    orderDirection,
    where: Object.keys(where).length > 0 ? where : undefined,
  })

  const items = response.whitelistedNFTs.map((item) => new WhitelistedNFT(item))
  const total = items.length // The Graph 可能不返回总数，这里使用列表长度
  const hasMore = items.length === first

  return new PaginatedList({
    items,
    total,
    page: Math.floor(skip / first) + 1,
    limit: first,
    hasMore,
  })
}

/**
 * 获取白名单 NFT 详情
 */
export const getWhitelistedNFT = async (id: string): Promise<WhitelistedNFT | null> => {
  const response = await request<{
    whitelistedNFT: {
      id: string
      nftContract: string
      name?: string
      symbol?: string
      platformFeeRate: string
      isActive: boolean
      addedAt: string
      removedAt?: string
      addedBlockNumber: string
      removedBlockNumber?: string
    } | null
  }>(GET_WHITELISTED_NFT, { id })

  return response.whitelistedNFT ? new WhitelistedNFT(response.whitelistedNFT) : null
}

/**
 * 根据 NFT 合约地址获取白名单 NFT
 */
export const getWhitelistedNFTByContract = async (
  nftContract: string
): Promise<WhitelistedNFT | null> => {
  const list = await getWhitelistedNFTs({
    nftContract,
    first: 1,
  })
  return list.items.length > 0 ? list.items[0] : null
}

// 导出白名单 NFT API
export const whitelistedNFTApi = {
  getWhitelistedNFTs,
  getWhitelistedNFT,
  getWhitelistedNFTByContract,
}

// 导出类型
export * from './types'

