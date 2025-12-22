/**
 * WhitelistManager 合约参数类型定义
 */

// 添加到白名单参数
export interface AddToWhitelistParams {
  nftContract: string
  platformFeeRate: string | bigint
}

// 设置市场地址参数
export interface SetMarketplaceParams {
  marketplace: string
}

// 设置白名单费用参数
export interface SetWhitelistFeeParams {
  fee: string | bigint
}

// 提取费用参数
export interface WithdrawFeesParams {
  to: string
  amount: string | bigint
}

