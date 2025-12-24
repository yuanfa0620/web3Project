// GraphQL API 统一导出
import { whitelistedNFTApi } from './modules/whitelistedNFT'
import { orderApi } from './modules/order'
import { activeOrderApi } from './modules/activeOrder'
import { soldOrderApi } from './modules/soldOrder'
import { eventsApi } from './modules/events'

// 导出所有 API 方法（统一的 graphqlApi 对象）
export const graphqlApi = {
  // 白名单 NFT
  getWhitelistedNFTs: whitelistedNFTApi.getWhitelistedNFTs,
  getWhitelistedNFT: whitelistedNFTApi.getWhitelistedNFT,
  getWhitelistedNFTByContract: whitelistedNFTApi.getWhitelistedNFTByContract,

  // 订单
  getOrders: orderApi.getOrders,
  getOrder: orderApi.getOrder,
  getOrderByOrderId: orderApi.getOrderByOrderId,

  // 活跃订单
  getActiveOrders: activeOrderApi.getActiveOrders,
  getActiveOrder: activeOrderApi.getActiveOrder,
  getActiveOrderByNFT: activeOrderApi.getActiveOrderByNFT,

  // 已售出订单
  getSoldOrders: soldOrderApi.getSoldOrders,
  getSoldOrder: soldOrderApi.getSoldOrder,

  // 事件
  getNFTDepositedEvents: eventsApi.getNFTDepositedEvents,
  getNFTSoldEvents: eventsApi.getNFTSoldEvents,
  getNFTWithdrawnEvents: eventsApi.getNFTWithdrawnEvents,
  getNFTWhitelistedEvents: eventsApi.getNFTWhitelistedEvents,
  getNFTRemovedFromWhitelistEvents: eventsApi.getNFTRemovedFromWhitelistEvents,
  getOrderStatusUpdatedEvents: eventsApi.getOrderStatusUpdatedEvents,
  getPriceSetEvents: eventsApi.getPriceSetEvents,
}

// 导出各个模块的 API（按需导入使用）
export { whitelistedNFTApi } from './modules/whitelistedNFT'
export { orderApi } from './modules/order'
export { activeOrderApi } from './modules/activeOrder'
export { soldOrderApi } from './modules/soldOrder'
export { eventsApi } from './modules/events'

// 导出所有类型（从各个模块）
export * from './modules/whitelistedNFT/types'
export * from './modules/order/types'
export * from './modules/activeOrder/types'
export * from './modules/soldOrder/types'
export * from './modules/events/types'
export * from './modules/data/types'
