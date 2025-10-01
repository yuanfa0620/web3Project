// 合约调用相关的类型定义

export interface ContractConfig {
  address: string
  abi: any[]
  chainId: number
}

export interface TransactionRequest {
  to: string
  value?: string
  data?: string
  gasLimit?: string
  gasPrice?: string
  maxFeePerGas?: string
  maxPriorityFeePerGas?: string
}

export interface TransactionResponse {
  hash: string
  wait: () => Promise<TransactionReceipt>
}

export interface TransactionReceipt {
  transactionHash: string
  blockNumber: number
  blockHash: string
  from: string
  to: string
  gasUsed: string
  effectiveGasPrice: string
  status: 'success' | 'reverted'
  logs: any[]
}

// ERC20 相关类型
export interface ERC20TokenInfo {
  name: string
  symbol: string
  decimals: number
  totalSupply: string
  balance: string
}

export interface ERC20TransferParams {
  to: string
  amount: string
}

export interface ERC20ApprovalParams {
  spender: string
  amount: string
}

// ERC721 相关类型
export interface ERC721TokenInfo {
  name: string
  symbol: string
  totalSupply: string
  balance: string
  owner: string
}

export interface ERC721TransferParams {
  from: string
  to: string
  tokenId: string
}

export interface ERC721ApprovalParams {
  to: string
  tokenId: string
}

export interface ERC721TokenMetadata {
  tokenId: string
  name?: string
  description?: string
  image?: string
  attributes?: Array<{
    trait_type: string
    value: string | number
  }>
}

// 合约调用结果
export interface ContractCallResult<T = any> {
  success: boolean
  data?: T
  error?: string
  transactionHash?: string
}
