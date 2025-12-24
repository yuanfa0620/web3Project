// 订单 API
import { request } from '../../client'
import { GET_ORDERS, GET_ORDER } from '../../queries'
import { Order, type GetOrdersParams } from './types'
import { PaginatedList } from '../data/types'

/**
 * 获取订单列表
 */
export const getOrders = async (params: GetOrdersParams = {}): Promise<PaginatedList<Order>> => {
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
  if (filters.buyer) {
    where.buyer = filters.buyer.toLowerCase()
  }
  if (filters.status !== undefined) {
    where.status = filters.status
  }
  if (filters.minPrice) {
    where.price_gte = filters.minPrice
  }
  if (filters.maxPrice) {
    where.price_lte = filters.maxPrice
  }

  const response = await request<{
    orders: Array<{
      id: string
      orderId: string
      nftContract: string
      tokenId: string
      depositor: string
      buyer?: string
      price: string
      status: number
      platformFee?: string
      sellerAmount?: string
      createdAt: string
      updatedAt?: string
      soldAt?: string
      withdrawnAt?: string
      createdBlockNumber: string
      updatedBlockNumber?: string
      soldBlockNumber?: string
      withdrawnBlockNumber?: string
      createdTransactionHash: string
      soldTransactionHash?: string
      withdrawnTransactionHash?: string
    }>
  }>(GET_ORDERS, {
    first,
    skip,
    orderBy,
    orderDirection,
    where: Object.keys(where).length > 0 ? where : undefined,
  })

  const items = response.orders.map((item) => new Order(item))
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
 * 获取订单详情
 */
export const getOrder = async (id: string): Promise<Order | null> => {
  const response = await request<{
    order: {
      id: string
      orderId: string
      nftContract: string
      tokenId: string
      depositor: string
      buyer?: string
      price: string
      status: number
      platformFee?: string
      sellerAmount?: string
      createdAt: string
      updatedAt?: string
      soldAt?: string
      withdrawnAt?: string
      createdBlockNumber: string
      updatedBlockNumber?: string
      soldBlockNumber?: string
      withdrawnBlockNumber?: string
      createdTransactionHash: string
      soldTransactionHash?: string
      withdrawnTransactionHash?: string
    } | null
  }>(GET_ORDER, { id })

  return response.order ? new Order(response.order) : null
}

/**
 * 根据订单 ID 获取订单
 */
export const getOrderByOrderId = async (orderId: string): Promise<Order | null> => {
  const list = await getOrders({
    first: 1,
    // 注意：这里需要根据实际的 GraphQL schema 来构建查询
    // 如果 schema 支持 orderId 筛选，可以使用 where: { orderId }
  })
  // 手动查找匹配的订单
  const order = list.items.find((o) => o.orderId === orderId)
  return order || null
}

// 导出订单 API
export const orderApi = {
  getOrders,
  getOrder,
  getOrderByOrderId,
}

// 导出类型
export * from './types'

