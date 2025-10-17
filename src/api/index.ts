// API 服务统一导出
export { default as apiService } from './request'

// 导出基础类型定义
export type { ApiResponse, ApiError, RequestConfig, AxiosInstanceConfig } from './data/types'

// 导出分类的API服务
export { userApi } from './user'
export { tokenApi } from './token'
export { transactionApi } from './transaction'

// 导出所有类型定义（使用别名避免冲突）
export type { 
  UserInfo as UserInfoClass,
  UserTransaction,
  UserTransactionList,
  GetUserInfoParams,
  UpdateUserInfoParams,
  GetUserTransactionsParams
} from './user/types'

export type {
  TokenInfo as TokenInfoClass,
  TokenList,
  TokenSearchResult,
  GetTokenListParams,
  GetTokenDetailParams,
  SearchTokensParams
} from './token/types'

export type {
  TransactionInfo as TransactionInfoClass,
  TransactionList,
  TransactionLog,
  GetTransactionDetailParams,
  GetTransactionListParams,
  SubmitTransactionParams
} from './transaction/types'

// 为了向后兼容，保留原有的API实例导出
export { userApiService, tokenApiService, transactionApiService } from './request'
