// 事件类型定义
import type { PaginationParams } from '../data/types'
import { PaginatedList } from '../data/types'

// NFT 存入事件
export class NFTDeposited {
  id: string
  nftContract: string
  tokenId: string
  depositor: string
  price: string
  orderId: string
  blockNumber: string
  blockTimestamp: string
  transactionHash: string

  constructor(data: {
    id: string
    nftContract: string
    tokenId: string
    depositor: string
    price: string
    orderId: string
    blockNumber: string
    blockTimestamp: string
    transactionHash: string
  }) {
    this.id = data.id
    this.nftContract = data.nftContract
    this.tokenId = data.tokenId
    this.depositor = data.depositor
    this.price = data.price
    this.orderId = data.orderId
    this.blockNumber = data.blockNumber
    this.blockTimestamp = data.blockTimestamp
    this.transactionHash = data.transactionHash
  }
}

// NFT 售出事件
export class NFTSold {
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

  constructor(data: {
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
  }) {
    this.id = data.id
    this.nftContract = data.nftContract
    this.tokenId = data.tokenId
    this.seller = data.seller
    this.buyer = data.buyer
    this.price = data.price
    this.platformFee = data.platformFee
    this.sellerAmount = data.sellerAmount
    this.orderId = data.orderId
    this.blockNumber = data.blockNumber
    this.blockTimestamp = data.blockTimestamp
    this.transactionHash = data.transactionHash
  }
}

// NFT 撤回事件
export class NFTWithdrawn {
  id: string
  nftContract: string
  tokenId: string
  depositor: string
  orderId: string
  blockNumber: string
  blockTimestamp: string
  transactionHash: string

  constructor(data: {
    id: string
    nftContract: string
    tokenId: string
    depositor: string
    orderId: string
    blockNumber: string
    blockTimestamp: string
    transactionHash: string
  }) {
    this.id = data.id
    this.nftContract = data.nftContract
    this.tokenId = data.tokenId
    this.depositor = data.depositor
    this.orderId = data.orderId
    this.blockNumber = data.blockNumber
    this.blockTimestamp = data.blockTimestamp
    this.transactionHash = data.transactionHash
  }
}

// NFT 加入白名单事件
export class NFTWhitelisted {
  id: string
  nftContract: string
  platformFeeRate: string
  blockNumber: string
  blockTimestamp: string
  transactionHash: string

  constructor(data: {
    id: string
    nftContract: string
    platformFeeRate: string
    blockNumber: string
    blockTimestamp: string
    transactionHash: string
  }) {
    this.id = data.id
    this.nftContract = data.nftContract
    this.platformFeeRate = data.platformFeeRate
    this.blockNumber = data.blockNumber
    this.blockTimestamp = data.blockTimestamp
    this.transactionHash = data.transactionHash
  }
}

// NFT 从白名单移除事件
export class NFTRemovedFromWhitelist {
  id: string
  nftContract: string
  blockNumber: string
  blockTimestamp: string
  transactionHash: string

  constructor(data: {
    id: string
    nftContract: string
    blockNumber: string
    blockTimestamp: string
    transactionHash: string
  }) {
    this.id = data.id
    this.nftContract = data.nftContract
    this.blockNumber = data.blockNumber
    this.blockTimestamp = data.blockTimestamp
    this.transactionHash = data.transactionHash
  }
}

// 订单状态更新事件
export class OrderStatusUpdated {
  id: string
  orderId: string
  status: number
  blockNumber: string
  blockTimestamp: string
  transactionHash: string

  constructor(data: {
    id: string
    orderId: string
    status: number
    blockNumber: string
    blockTimestamp: string
    transactionHash: string
  }) {
    this.id = data.id
    this.orderId = data.orderId
    this.status = data.status
    this.blockNumber = data.blockNumber
    this.blockTimestamp = data.blockTimestamp
    this.transactionHash = data.transactionHash
  }
}

// 价格设置事件
export class PriceSet {
  id: string
  nftContract: string
  tokenId: string
  price: string
  blockNumber: string
  blockTimestamp: string
  transactionHash: string

  constructor(data: {
    id: string
    nftContract: string
    tokenId: string
    price: string
    blockNumber: string
    blockTimestamp: string
    transactionHash: string
  }) {
    this.id = data.id
    this.nftContract = data.nftContract
    this.tokenId = data.tokenId
    this.price = data.price
    this.blockNumber = data.blockNumber
    this.blockTimestamp = data.blockTimestamp
    this.transactionHash = data.transactionHash
  }
}

// 事件查询参数
export interface GetEventsParams extends PaginationParams {
  nftContract?: string
  tokenId?: string
  orderId?: string
  fromBlock?: number
  toBlock?: number
}

// 导出分页列表类型
export { PaginatedList } from '../data/types'

