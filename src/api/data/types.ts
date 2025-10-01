// API 请求和响应的类型定义

export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
  success: boolean
}

export interface ApiError {
  code: number
  message: string
  details?: any
}

export interface RequestConfig {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  data?: any
  params?: any
  headers?: Record<string, string>
  timeout?: number
  showLoading?: boolean
  loadingText?: string
}

export interface AxiosInstanceConfig {
  baseURL: string
  timeout?: number
  headers?: Record<string, string>
  showGlobalLoading?: boolean
  globalLoadingText?: string
}

// 常用 API 接口类型
export interface UserInfo {
  id: string
  address: string
  nickname?: string
  avatar?: string
  createdAt: string
  updatedAt: string
}

export interface TokenInfo {
  address: string
  symbol: string
  name: string
  decimals: number
  logoURI?: string
  chainId: number
}

export interface TransactionInfo {
  hash: string
  from: string
  to: string
  value: string
  gasUsed: string
  gasPrice: string
  blockNumber: number
  timestamp: number
  status: 'pending' | 'success' | 'failed'
}
