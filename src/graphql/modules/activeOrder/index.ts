// 活跃订单 API
import { request } from '../../client'
import { GET_ACTIVE_ORDERS, GET_ACTIVE_ORDER } from '../../queries'
import { ActiveOrder, type GetActiveOrdersParams } from './types'
import { PaginatedList } from '../data/types'

/**
 * 获取活跃订单列表
 */
export const getActiveOrders = async (
  params: GetActiveOrdersParams = {}
): Promise<PaginatedList<ActiveOrder>> => {
  const { first = 100, skip = 0, orderBy = 'createdAt', orderDirection = 'desc', ...filters } = params

  const where: any = {}
  if (filters.nftContract) {
    where.nftContract = filters.nftContract.toLowerCase()
  }
  if (filters.tokenId !== undefined) {
    where.tokenId = filters.tokenId
  }
  if (filters.depositor) {
    where.depositor = filters.depositor.toLowerCase()
  }
  if (filters.status !== undefined) {
    where.status = filters.status
  }

  const response = await request<{
    activeOrders: Array<{
      id: string
      orderId: string
      nftContract: string
      tokenId: string
      depositor: string
      price: string
      status: number
      createdAt: string
      updatedAt?: string
      withdrawnAt?: string
      createdBlockNumber: string
      updatedBlockNumber?: string
      withdrawnBlockNumber?: string
      createdTransactionHash: string
      withdrawnTransactionHash?: string
    }>
  }>(GET_ACTIVE_ORDERS, {
    first,
    skip,
    orderBy,
    orderDirection,
    where: Object.keys(where).length > 0 ? where : undefined,
  })

  const items = response.activeOrders.map((item) => new ActiveOrder(item))
  const total = items.length
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
 * 获取活跃订单详情
 */
export const getActiveOrder = async (id: string): Promise<ActiveOrder | null> => {
  const response = await request<{
    activeOrder: {
      id: string
      orderId: string
      nftContract: string
      tokenId: string
      depositor: string
      price: string
      status: number
      createdAt: string
      updatedAt?: string
      withdrawnAt?: string
      createdBlockNumber: string
      updatedBlockNumber?: string
      withdrawnBlockNumber?: string
      createdTransactionHash: string
      withdrawnTransactionHash?: string
    } | null
  }>(GET_ACTIVE_ORDER, { id })

  return response.activeOrder ? new ActiveOrder(response.activeOrder) : null
}

/**
 * 根据 NFT 合约和 Token ID 获取活跃订单
 */
export const getActiveOrderByNFT = async (
  nftContract: string,
  tokenId: string
): Promise<ActiveOrder | null> => {
  const list = await getActiveOrders({
    nftContract,
    tokenId,
    first: 1,
  })
  return list.items.length > 0 ? list.items[0] : null
}

// 导出活跃订单 API
export const activeOrderApi = {
  getActiveOrders,
  getActiveOrder,
  getActiveOrderByNFT,
}

// 导出类型
export * from './types'

