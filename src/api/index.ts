// API 服务统一导出
export { default as apiService } from './request'
export * from './data/types'
import { userApiService, tokenApiService, transactionApiService } from './request'

// 用户相关 API
export const userApi = {
  // 获取用户信息
  getUserInfo: (address: string) => userApiService.get(`/info/${address}`),
  
  // 更新用户信息
  updateUserInfo: (data: { nickname?: string; avatar?: string }) => 
    userApiService.put('/info', data),
  
  // 获取用户交易记录
  getUserTransactions: (address: string, params?: { page?: number; limit?: number }) =>
    userApiService.get(`/transactions/${address}`, params),
}

// 代币相关 API
export const tokenApi = {
  // 获取代币列表
  getTokenList: (params?: { chainId?: number; page?: number; limit?: number }) =>
    tokenApiService.get('/list', params),
  
  // 获取代币详情
  getTokenDetail: (address: string, chainId: number) =>
    tokenApiService.get(`/detail/${address}`, { chainId }),
  
  // 搜索代币
  searchTokens: (keyword: string, chainId?: number) =>
    tokenApiService.get('/search', { keyword, chainId }),
}

// 交易相关 API
export const transactionApi = {
  // 获取交易详情
  getTransactionDetail: (hash: string) =>
    transactionApiService.get(`/detail/${hash}`),
  
  // 获取交易列表
  getTransactionList: (params?: { 
    address?: string; 
    page?: number; 
    limit?: number;
    status?: 'pending' | 'success' | 'failed';
  }) => transactionApiService.get('/list', params),
  
  // 提交交易
  submitTransaction: (data: {
    to: string;
    value: string;
    data?: string;
    gasLimit?: string;
  }) => transactionApiService.post('/submit', data),
}
