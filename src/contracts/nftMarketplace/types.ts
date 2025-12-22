/**
 * NFT Marketplace 合约参数类型定义
 */

// NFT 存入相关
export interface DepositNFTParams {
  nftContract: string
  tokenId: string | bigint
  price: string | bigint
}

// 基于 orderId 的参数接口
export interface BuyNFTByOrderIdParams {
  orderId: string | bigint
}

export interface WithdrawNFTByOrderIdParams {
  orderId: string | bigint
}

export interface SetPriceByOrderIdParams {
  orderId: string | bigint
  price: string | bigint
}

// 白名单相关
export interface AddToWhitelistParams {
  nftContract: string
  platformFeeRate: string | bigint
}

export interface UpdateWhitelistParams {
  nftContract: string
  platformFeeRate: string | bigint
}

export interface SetWhitelistManagerParams {
  whitelistManager: string
}

// 平台费用相关
export interface WithdrawPlatformFeesParams {
  to: string
  amount: string | bigint
}

// 紧急提取相关
export interface EmergencyWithdrawParams {
  nftContract: string
  tokenId: string | bigint
  to: string
}

export interface EmergencyWithdrawBatchParams {
  startIndex: string | bigint
  endIndex: string | bigint
}

