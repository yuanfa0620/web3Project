// 白名单 NFT 类型定义
import type { PaginationParams } from '../data/types'
import { PaginatedList } from '../data/types'

// 白名单 NFT 合约
export class WhitelistedNFT {
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

  constructor(data: {
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
  }) {
    this.id = data.id
    this.nftContract = data.nftContract
    this.name = data.name
    this.symbol = data.symbol
    this.platformFeeRate = data.platformFeeRate
    this.isActive = data.isActive
    this.addedAt = data.addedAt
    this.removedAt = data.removedAt
    this.addedBlockNumber = data.addedBlockNumber
    this.removedBlockNumber = data.removedBlockNumber
  }

  // 获取平台手续费率（格式化为百分比）
  getPlatformFeeRatePercent(): string {
    const rate = BigInt(this.platformFeeRate)
    const percent = (Number(rate) / 100).toFixed(2)
    return `${percent}%`
  }

  // 检查是否已移除
  isRemoved(): boolean {
    return !this.isActive && !!this.removedAt
  }
}

// 白名单 NFT 查询参数
export interface GetWhitelistedNFTsParams extends PaginationParams {
  nftContract?: string
  isActive?: boolean
}

// 导出分页列表类型
export { PaginatedList } from '../data/types'

