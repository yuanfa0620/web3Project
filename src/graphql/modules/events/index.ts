// 事件 API
import { request } from '../../client'
import {
  GET_NFT_DEPOSITED_EVENTS,
  GET_NFT_SOLD_EVENTS,
  GET_NFT_WITHDRAWN_EVENTS,
  GET_NFT_WHITELISTED_EVENTS,
  GET_NFT_REMOVED_FROM_WHITELIST_EVENTS,
  GET_ORDER_STATUS_UPDATED_EVENTS,
  GET_PRICE_SET_EVENTS,
} from '../../queries'
import {
  NFTDeposited,
  NFTSold,
  NFTWithdrawn,
  NFTWhitelisted,
  NFTRemovedFromWhitelist,
  OrderStatusUpdated,
  PriceSet,
  type GetEventsParams,
} from './types'
import { PaginatedList } from '../data/types'

/**
 * 获取 NFT 存入事件列表
 */
export const getNFTDepositedEvents = async (
  params: GetEventsParams = {}
): Promise<PaginatedList<NFTDeposited>> => {
  const { first = 100, skip = 0, orderBy = 'blockTimestamp', orderDirection = 'desc', ...filters } = params

  const where: any = {}
  if (filters.nftContract) {
    where.nftContract = filters.nftContract.toLowerCase()
  }
  if (filters.tokenId !== undefined) {
    where.tokenId = filters.tokenId
  }
  if (filters.orderId !== undefined) {
    where.orderId = filters.orderId
  }
  if (filters.fromBlock !== undefined) {
    where.blockNumber_gte = filters.fromBlock
  }
  if (filters.toBlock !== undefined) {
    where.blockNumber_lte = filters.toBlock
  }

  const response = await request<{
    nFTDepositeds: Array<{
      id: string
      nftContract: string
      tokenId: string
      depositor: string
      price: string
      orderId: string
      blockNumber: string
      blockTimestamp: string
      transactionHash: string
    }>
  }>(GET_NFT_DEPOSITED_EVENTS, {
    first,
    skip,
    orderBy,
    orderDirection,
    where: Object.keys(where).length > 0 ? where : undefined,
  })

  const items = response.nFTDepositeds.map((item) => new NFTDeposited(item))
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
 * 获取 NFT 售出事件列表
 */
export const getNFTSoldEvents = async (
  params: GetEventsParams = {}
): Promise<PaginatedList<NFTSold>> => {
  const { first = 100, skip = 0, orderBy = 'blockTimestamp', orderDirection = 'desc', ...filters } = params

  const where: any = {}
  if (filters.nftContract) {
    where.nftContract = filters.nftContract.toLowerCase()
  }
  if (filters.tokenId !== undefined) {
    where.tokenId = filters.tokenId
  }
  if (filters.orderId !== undefined) {
    where.orderId = filters.orderId
  }
  if (filters.fromBlock !== undefined) {
    where.blockNumber_gte = filters.fromBlock
  }
  if (filters.toBlock !== undefined) {
    where.blockNumber_lte = filters.toBlock
  }

  const response = await request<{
    nFTSolds: Array<{
      id: string
      nftContract: string
      tokenId: string
      seller: string
      buyer: string
      price: string
      platformFee: string
      sellerAmount: string
      orderId: string
      blockNumber: string
      blockTimestamp: string
      transactionHash: string
    }>
  }>(GET_NFT_SOLD_EVENTS, {
    first,
    skip,
    orderBy,
    orderDirection,
    where: Object.keys(where).length > 0 ? where : undefined,
  })

  const items = response.nFTSolds.map((item) => new NFTSold(item))
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
 * 获取 NFT 撤回事件列表
 */
export const getNFTWithdrawnEvents = async (
  params: GetEventsParams = {}
): Promise<PaginatedList<NFTWithdrawn>> => {
  const { first = 100, skip = 0, orderBy = 'blockTimestamp', orderDirection = 'desc', ...filters } = params

  const where: any = {}
  if (filters.nftContract) {
    where.nftContract = filters.nftContract.toLowerCase()
  }
  if (filters.tokenId !== undefined) {
    where.tokenId = filters.tokenId
  }
  if (filters.orderId !== undefined) {
    where.orderId = filters.orderId
  }
  if (filters.fromBlock !== undefined) {
    where.blockNumber_gte = filters.fromBlock
  }
  if (filters.toBlock !== undefined) {
    where.blockNumber_lte = filters.toBlock
  }

  const response = await request<{
    nFTWithdrawns: Array<{
      id: string
      nftContract: string
      tokenId: string
      depositor: string
      orderId: string
      blockNumber: string
      blockTimestamp: string
      transactionHash: string
    }>
  }>(GET_NFT_WITHDRAWN_EVENTS, {
    first,
    skip,
    orderBy,
    orderDirection,
    where: Object.keys(where).length > 0 ? where : undefined,
  })

  const items = response.nFTWithdrawns.map((item) => new NFTWithdrawn(item))
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
 * 获取 NFT 加入白名单事件列表
 */
export const getNFTWhitelistedEvents = async (
  params: GetEventsParams = {}
): Promise<PaginatedList<NFTWhitelisted>> => {
  const { first = 100, skip = 0, orderBy = 'blockTimestamp', orderDirection = 'desc', ...filters } = params

  const where: any = {}
  if (filters.nftContract) {
    where.nftContract = filters.nftContract.toLowerCase()
  }
  if (filters.fromBlock !== undefined) {
    where.blockNumber_gte = filters.fromBlock
  }
  if (filters.toBlock !== undefined) {
    where.blockNumber_lte = filters.toBlock
  }

  const response = await request<{
    nFTWhitelisteds: Array<{
      id: string
      nftContract: string
      platformFeeRate: string
      blockNumber: string
      blockTimestamp: string
      transactionHash: string
    }>
  }>(GET_NFT_WHITELISTED_EVENTS, {
    first,
    skip,
    orderBy,
    orderDirection,
    where: Object.keys(where).length > 0 ? where : undefined,
  })

  const items = response.nFTWhitelisteds.map((item) => new NFTWhitelisted(item))
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
 * 获取 NFT 从白名单移除事件列表
 */
export const getNFTRemovedFromWhitelistEvents = async (
  params: GetEventsParams = {}
): Promise<PaginatedList<NFTRemovedFromWhitelist>> => {
  const { first = 100, skip = 0, orderBy = 'blockTimestamp', orderDirection = 'desc', ...filters } = params

  const where: any = {}
  if (filters.nftContract) {
    where.nftContract = filters.nftContract.toLowerCase()
  }
  if (filters.fromBlock !== undefined) {
    where.blockNumber_gte = filters.fromBlock
  }
  if (filters.toBlock !== undefined) {
    where.blockNumber_lte = filters.toBlock
  }

  const response = await request<{
    nFTRemovedFromWhitelists: Array<{
      id: string
      nftContract: string
      blockNumber: string
      blockTimestamp: string
      transactionHash: string
    }>
  }>(GET_NFT_REMOVED_FROM_WHITELIST_EVENTS, {
    first,
    skip,
    orderBy,
    orderDirection,
    where: Object.keys(where).length > 0 ? where : undefined,
  })

  const items = response.nFTRemovedFromWhitelists.map((item) => new NFTRemovedFromWhitelist(item))
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
 * 获取订单状态更新事件列表
 */
export const getOrderStatusUpdatedEvents = async (
  params: GetEventsParams = {}
): Promise<PaginatedList<OrderStatusUpdated>> => {
  const { first = 100, skip = 0, orderBy = 'blockTimestamp', orderDirection = 'desc', ...filters } = params

  const where: any = {}
  if (filters.orderId !== undefined) {
    where.orderId = filters.orderId
  }
  if (filters.fromBlock !== undefined) {
    where.blockNumber_gte = filters.fromBlock
  }
  if (filters.toBlock !== undefined) {
    where.blockNumber_lte = filters.toBlock
  }

  const response = await request<{
    orderStatusUpdateds: Array<{
      id: string
      orderId: string
      status: number
      blockNumber: string
      blockTimestamp: string
      transactionHash: string
    }>
  }>(GET_ORDER_STATUS_UPDATED_EVENTS, {
    first,
    skip,
    orderBy,
    orderDirection,
    where: Object.keys(where).length > 0 ? where : undefined,
  })

  const items = response.orderStatusUpdateds.map((item) => new OrderStatusUpdated(item))
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
 * 获取价格设置事件列表
 */
export const getPriceSetEvents = async (
  params: GetEventsParams = {}
): Promise<PaginatedList<PriceSet>> => {
  const { first = 100, skip = 0, orderBy = 'blockTimestamp', orderDirection = 'desc', ...filters } = params

  const where: any = {}
  if (filters.nftContract) {
    where.nftContract = filters.nftContract.toLowerCase()
  }
  if (filters.tokenId !== undefined) {
    where.tokenId = filters.tokenId
  }
  if (filters.fromBlock !== undefined) {
    where.blockNumber_gte = filters.fromBlock
  }
  if (filters.toBlock !== undefined) {
    where.blockNumber_lte = filters.toBlock
  }

  const response = await request<{
    priceSets: Array<{
      id: string
      nftContract: string
      tokenId: string
      price: string
      blockNumber: string
      blockTimestamp: string
      transactionHash: string
    }>
  }>(GET_PRICE_SET_EVENTS, {
    first,
    skip,
    orderBy,
    orderDirection,
    where: Object.keys(where).length > 0 ? where : undefined,
  })

  const items = response.priceSets.map((item) => new PriceSet(item))
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

// 导出事件 API
export const eventsApi = {
  getNFTDepositedEvents,
  getNFTSoldEvents,
  getNFTWithdrawnEvents,
  getNFTWhitelistedEvents,
  getNFTRemovedFromWhitelistEvents,
  getOrderStatusUpdatedEvents,
  getPriceSetEvents,
}

// 导出类型
export * from './types'

