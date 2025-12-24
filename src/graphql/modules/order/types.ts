// 订单类型定义
import type { PaginationParams, FilterParams } from '../data/types'
import { PaginatedList } from '../data/types'

// 订单信息
export class Order {
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

  constructor(data: {
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
  }) {
    this.id = data.id
    this.orderId = data.orderId
    this.nftContract = data.nftContract
    this.tokenId = data.tokenId
    this.depositor = data.depositor
    this.buyer = data.buyer
    this.price = data.price
    this.status = data.status
    this.platformFee = data.platformFee
    this.sellerAmount = data.sellerAmount
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
    this.soldAt = data.soldAt
    this.withdrawnAt = data.withdrawnAt
    this.createdBlockNumber = data.createdBlockNumber
    this.updatedBlockNumber = data.updatedBlockNumber
    this.soldBlockNumber = data.soldBlockNumber
    this.withdrawnBlockNumber = data.withdrawnBlockNumber
    this.createdTransactionHash = data.createdTransactionHash
    this.soldTransactionHash = data.soldTransactionHash
    this.withdrawnTransactionHash = data.withdrawnTransactionHash
  }

  // 获取状态文本
  getStatusText(): string {
    switch (this.status) {
      case 0: return '已上架'
      case 1: return '已取消'
      case 2: return '已售出'
      case 3: return '已撤回'
      default: return '未知'
    }
  }

  // 获取格式化的价格（ETH）
  getFormattedPrice(): string {
    const price = BigInt(this.price)
    const ethPrice = Number(price) / 1e18
    return `${ethPrice.toFixed(6)} ETH`
  }
}

// 订单查询参数
export interface GetOrdersParams extends PaginationParams, FilterParams {
  // 额外的订单特定筛选
}

// 导出分页列表类型
export { PaginatedList } from '../data/types'

