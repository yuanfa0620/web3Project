// 已售出订单类型定义
import type { PaginationParams } from '../data/types'
import { PaginatedList } from '../data/types'

// 已售出订单
export class SoldOrder {
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

  constructor(data: {
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
  }) {
    this.id = data.id
    this.orderId = data.orderId
    this.nftContract = data.nftContract
    this.tokenId = data.tokenId
    this.depositor = data.depositor
    this.buyer = data.buyer
    this.price = data.price
    this.platformFee = data.platformFee
    this.sellerAmount = data.sellerAmount
    this.createdAt = data.createdAt
    this.soldAt = data.soldAt
    this.createdBlockNumber = data.createdBlockNumber
    this.soldBlockNumber = data.soldBlockNumber
    this.createdTransactionHash = data.createdTransactionHash
    this.soldTransactionHash = data.soldTransactionHash
  }

  // 获取格式化的价格（ETH）
  getFormattedPrice(): string {
    const price = BigInt(this.price)
    const ethPrice = Number(price) / 1e18
    return `${ethPrice.toFixed(6)} ETH`
  }

  // 获取格式化的平台手续费（ETH）
  getFormattedPlatformFee(): string {
    const fee = BigInt(this.platformFee)
    const ethFee = Number(fee) / 1e18
    return `${ethFee.toFixed(6)} ETH`
  }

  // 获取格式化的卖家收到金额（ETH）
  getFormattedSellerAmount(): string {
    const amount = BigInt(this.sellerAmount)
    const ethAmount = Number(amount) / 1e18
    return `${ethAmount.toFixed(6)} ETH`
  }
}

// 已售出订单查询参数
export interface GetSoldOrdersParams extends PaginationParams {
  nftContract?: string
  tokenId?: string
  depositor?: string
  buyer?: string
}

// 导出分页列表类型
export { PaginatedList } from '../data/types'

