// API 服务统一导出
export { defaultRequest as apiService, createRequest, default as defaultRequest } from './request'

// 导出基础类型定义
export type { ApiResponse, ApiError, RequestConfig, AxiosInstanceConfig } from './modules/data/types'

// 导出分类的API服务
export { userApi } from './modules/user'
export { tokenApi } from './modules/token'
export { transactionApi } from './modules/transaction'
export { alchemyNFTApi } from './modules/alchemy'

// 导出所有类型定义（使用别名避免冲突）
export type { 
  UserInfo as UserInfoClass,
  UserTransaction,
  UserTransactionList,
  GetUserInfoParams,
  UpdateUserInfoParams,
  GetUserTransactionsParams
} from './modules/user/types'

export type {
  TokenInfo as TokenInfoClass,
  TokenList,
  TokenSearchResult,
  GetTokenListParams,
  GetTokenDetailParams,
  SearchTokensParams
} from './modules/token/types'

export type {
  TransactionInfo as TransactionInfoClass,
  TransactionList,
  TransactionLog,
  GetTransactionDetailParams,
  GetTransactionListParams,
  SubmitTransactionParams
} from './modules/transaction/types'

export type {
  AlchemyOwnedNFT,
  AlchemyNFTList,
  AlchemyGetNFTsResponse,
  GetNFTsForOwnerParams,
  GetNFTMetadataParams,
  AlchemyNFTMetadata,
  NFTContract,
  NFTImage,
  NFTMint
} from './modules/alchemy/types'
