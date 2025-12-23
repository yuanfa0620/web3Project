/**
 * MFTToken 合约参数类型定义
 */

export interface MintParams {
  value: string | bigint // 铸造费用（ETH）
}

export interface SetFeeRecipientParams {
  newRecipient: string
}

export interface SetMintAmountParams {
  newAmount: string | bigint
}

export interface SetMintCooldownParams {
  newCooldown: string | bigint
}

export interface SetMintEnabledParams {
  enabled: boolean
}

export interface SetMintFeeParams {
  newFee: string | bigint
}

export interface TransferOwnershipParams {
  newOwner: string
}

export interface MFTTokenMintInfo {
  canMint: boolean
  mintEnabled: boolean
  mintAmount: string
  mintFee: string
  mintCooldown: string
  remainingCooldown: string
  lastMintTime: string
  balanceThreshold: string
  feeRecipient: string
  owner: string
}

