/**
 * Alchemy NFT API 类型定义
 */

// 网络映射：chainId -> Alchemy网络标识
export const ALCHEMY_NETWORK_MAP: Record<number, string> = {
  11155111: 'eth-sepolia',      // Sepolia
  80002: 'polygon-amoy',        // Polygon Amoy
  84532: 'base-sepolia',        // Base Sepolia
}

// OpenSea元数据
export interface OpenSeaMetadata {
  floorPrice: number | null
  collectionName: string | null
  collectionSlug: string | null
  safelistRequestStatus: string | null
  imageUrl: string | null
  description: string | null
  externalUrl: string | null
  twitterUsername: string | null
  discordUrl: string | null
  bannerImageUrl: string | null
  lastIngestedAt: string | null
}

// 合约信息
export interface NFTContract {
  address: string
  name: string | null
  symbol: string | null
  totalSupply: string | null
  tokenType: string
  contractDeployer: string | null
  deployedBlockNumber: number | null
  openSeaMetadata: OpenSeaMetadata
  isSpam: boolean
  spamClassifications: string[]
}

// 图片信息
export interface NFTImage {
  cachedUrl: string | null
  thumbnailUrl: string | null
  pngUrl: string | null
  contentType: string | null
  size: number | null
  originalUrl: string | null
}

// 动画信息
export interface NFTAnimation {
  cachedUrl: string | null
  contentType: string | null
  size: number | null
  originalUrl: string | null
}

// 原始数据
export interface NFTRaw {
  tokenUri: string | null
  metadata: Record<string, any>
  error: string | null
}

// 铸造信息
export interface NFTMint {
  mintAddress: string
  blockNumber: number
  timestamp: string
  transactionHash: string
}

// 获取时间信息
export interface NFTAcquiredAt {
  blockTimestamp: string | null
  blockNumber: number | null
}

// 单个NFT数据
export interface AlchemyOwnedNFT {
  contract: NFTContract
  tokenId: string
  tokenType: string
  name: string | null
  description: string | null
  tokenUri: string | null
  image: NFTImage
  animation: NFTAnimation
  raw: NFTRaw
  collection: any | null
  mint: NFTMint
  owners: string[] | null
  timeLastUpdated: string
  balance: string
  acquiredAt: NFTAcquiredAt
}

// 验证信息
export interface NFTValidAt {
  blockNumber: number
  blockHash: string
  blockTimestamp: string
}

// Alchemy API响应
export interface AlchemyGetNFTsResponse {
  ownedNfts: AlchemyOwnedNFT[]
  totalCount: number
  validAt: NFTValidAt
  pageKey?: string | null
}

// 获取NFT列表请求参数
export interface GetNFTsForOwnerParams {
  /** 钱包地址 */
  owner: string
  /** 合约地址列表（可选） */
  contractAddresses?: string[]
  /** 每页数量 */
  pageSize: number
  /** 排除过滤（可选） */
  excludeFilters?: string[]
  /** 包含过滤（可选） */
  includeFilters?: string[]
  /** 分页键（可选，用于获取下一页） */
  pageKey?: string
}

// 获取NFT元数据请求参数
export interface GetNFTMetadataParams {
  /** 合约地址 */
  contractAddress: string
  /** Token ID */
  tokenId: string
  /** Token URI超时时间（毫秒，可选） */
  tokenUriTimeoutInMs?: number
  /** 是否刷新缓存（可选） */
  refreshCache?: boolean
}

// NFT元数据响应（和AlchemyOwnedNFT结构相同）
export type AlchemyNFTMetadata = AlchemyOwnedNFT

// NFT列表结果类
export class AlchemyNFTList {
  nfts: AlchemyOwnedNFT[]
  totalCount: number
  validAt: NFTValidAt
  pageKey: string | null
  hasMore: boolean

  constructor(data: AlchemyGetNFTsResponse) {
    this.nfts = data.ownedNfts || []
    this.totalCount = data.totalCount || 0
    this.validAt = data.validAt
    this.pageKey = data.pageKey || null
    this.hasMore = !!data.pageKey
  }

  /**
   * 检查是否有下一页
   */
  hasNextPage(): boolean {
    return this.hasMore
  }

  /**
   * 获取图片URL（优先使用cachedUrl，然后是originalUrl）
   */
  getImageUrl(nft: AlchemyOwnedNFT): string | null {
    return nft.image?.cachedUrl || nft.image?.originalUrl || null
  }

  /**
   * 获取缩略图URL
   */
  getThumbnailUrl(nft: AlchemyOwnedNFT): string | null {
    return nft.image?.thumbnailUrl || this.getImageUrl(nft)
  }

  /**
   * 获取NFT名称（优先使用name，否则使用tokenId）
   */
  getNFTName(nft: AlchemyOwnedNFT): string {
    return nft.name || `${nft.contract.name || 'NFT'} #${nft.tokenId}`
  }

  /**
   * 获取集合名称
   */
  getCollectionName(nft: AlchemyOwnedNFT): string | null {
    return nft.contract.openSeaMetadata?.collectionName || nft.contract.name || null
  }
}

