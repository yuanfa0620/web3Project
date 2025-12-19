/**
 * 个人中心页面类型定义
 */

export interface Transaction {
  hash: string
  from: string
  to: string
  value: string
  gasUsed: string
  gasPrice: string
  blockNumber: number
  timestamp: number
  status: 'success' | 'failed' | 'pending'
  type: 'transfer' | 'swap' | 'stake' | 'unstake' | 'contract' | 'approve'
  chainId: number
  tokenSymbol?: string
  tokenDecimals?: number
}

export interface UserNFT {
  id: string
  contractAddress: string
  tokenId: string
  name: string
  description: string
  image: string
  chainId: number
  owner: string
  createdAt: number
  collectionName: string
  tokenType?: string // ERC721 或 ERC1155
  attributes?: Array<{
    trait_type: string
    value: string | number
  }>
}

export interface NFTTransaction {
  hash: string
  from: string
  to: string
  blockNumber: number
  timestamp: number
  type: 'mint' | 'transfer' | 'burn' | 'sale'
  chainId: number
}

