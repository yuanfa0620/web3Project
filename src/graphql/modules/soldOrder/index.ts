// 已售出订单 API
import { request } from '../../client'
import { GET_SOLD_ORDERS, GET_SOLD_ORDER } from '../../queries'
import { SoldOrder, type GetSoldOrdersParams } from './types'
import { PaginatedList } from '../data/types'

/**
 * 获取已售出订单列表
 */
export const getSoldOrders = async (
  params: GetSoldOrdersParams = {}
): Promise<PaginatedList<SoldOrder>> => {
  const { first = 100, skip = 0, orderBy = 'soldAt', orderDirection = 'desc', ...filters } = params

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
  if (filters.buyer) {
    where.buyer = filters.buyer.toLowerCase()
  }

  const response = await request<{
    soldOrders: Array<{
      id: string
      orderId: string
      nftContract: string
      tokenId: string
      depositor: string
      buyer: string
      price: string
      platformFee: string
      sellerAmount: string
      createdAt: string
      soldAt: string
      createdBlockNumber: string
      soldBlockNumber: string
      createdTransactionHash: string
      soldTransactionHash: string
    }>
  }>(GET_SOLD_ORDERS, {
    first,
    skip,
    orderBy,
    orderDirection,
    where: Object.keys(where).length > 0 ? where : undefined,
  })

  const items = response.soldOrders.map((item) => new SoldOrder(item))
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
 * 获取已售出订单详情
 */
export const getSoldOrder = async (id: string): Promise<SoldOrder | null> => {
  const response = await request<{
    soldOrder: {
      id: string
      orderId: string
      nftContract: string
      tokenId: string
      depositor: string
      buyer: string
      price: string
      platformFee: string
      sellerAmount: string
      createdAt: string
      soldAt: string
      createdBlockNumber: string
      soldBlockNumber: string
      createdTransactionHash: string
      soldTransactionHash: string
    } | null
  }>(GET_SOLD_ORDER, { id })

  return response.soldOrder ? new SoldOrder(response.soldOrder) : null
}

// 导出已售出订单 API
export const soldOrderApi = {
  getSoldOrders,
  getSoldOrder,
}

// 导出类型
export * from './types'

