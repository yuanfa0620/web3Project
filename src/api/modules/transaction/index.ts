// 交易相关API接口
import { createRequest } from '../../request'
import {
  TransactionInfo,
  TransactionList,
  type GetTransactionDetailParams,
  type GetTransactionListParams,
  type SubmitTransactionParams
} from './types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

// 创建交易服务实例
const transactionRequest = createRequest({
  baseURL: `${API_BASE_URL}/transaction`,
  timeout: 10000,
  showGlobalLoading: false, // 交易相关请求不显示全局 loading
})

// 交易相关接口
export const transactionApi = {
  /**
   * 获取交易详情
   * @param params 交易哈希参数
   * @returns 交易信息实例
   */
  getTransactionDetail: async (params: GetTransactionDetailParams): Promise<TransactionInfo> => {
    const response = await transactionRequest.get<any>(`/detail/${params.hash}`)
    return new TransactionInfo(response.data)
  },

  /**
   * 获取交易列表
   * @param params 查询参数
   * @returns 交易列表实例
   */
  getTransactionList: async (params: GetTransactionListParams = {}): Promise<TransactionList> => {
    const response = await transactionRequest.get<any>('/list', {
      params: {
        address: params.address,
        page: params.page,
        limit: params.limit,
        status: params.status,
        type: params.type,
        startTime: params.startTime,
        endTime: params.endTime
      }
    })
    return new TransactionList(response.data)
  },

  /**
   * 提交交易
   * @param params 交易参数
   * @returns 交易哈希
   */
  submitTransaction: async (params: SubmitTransactionParams): Promise<{ hash: string }> => {
    const response = await transactionRequest.post<{ hash: string }>('/submit', params)
    return response.data
  },

  /**
   * 获取待确认交易
   * @param address 钱包地址
   * @returns 待确认交易列表实例
   */
  getPendingTransactions: async (address: string): Promise<TransactionList> => {
    const response = await transactionRequest.get<any>('/pending', {
      params: { address }
    })
    return new TransactionList(response.data)
  },

  /**
   * 获取交易状态
   * @param hash 交易哈希
   * @returns 交易状态
   */
  getTransactionStatus: async (hash: string): Promise<{
    status: 'pending' | 'success' | 'failed'
    confirmations: number
    blockNumber?: number
  }> => {
    const response = await transactionRequest.get<{
      status: 'pending' | 'success' | 'failed'
      confirmations: number
      blockNumber?: number
    }>(`/status/${hash}`)
    return response.data
  },

  /**
   * 估算Gas费用
   * @param params 交易参数
   * @returns Gas估算结果
   */
  estimateGas: async (params: {
    to: string
    value: string
    data?: string
  }): Promise<{
    gasLimit: string
    gasPrice: string
    gasFee: string
  }> => {
    const response = await transactionRequest.post<{
      gasLimit: string
      gasPrice: string
      gasFee: string
    }>('/estimate-gas', params)
    return response.data
  },

  /**
   * 获取交易历史统计
   * @param address 钱包地址
   * @param days 天数
   * @returns 统计信息
   */
  getTransactionStats: async (
    address: string,
    days: 7 | 30 | 90 | 365 = 30
  ): Promise<{
    totalTransactions: number
    successfulTransactions: number
    failedTransactions: number
    totalGasUsed: string
    totalGasFee: string
    averageGasPrice: string
    transactionTypes: Record<string, number>
  }> => {
    const response = await transactionRequest.get<{
      totalTransactions: number
      successfulTransactions: number
      failedTransactions: number
      totalGasUsed: string
      totalGasFee: string
      averageGasPrice: string
      transactionTypes: Record<string, number>
    }>(`/stats/${address}`, {
      params: { days }
    })
    return response.data
  },

  /**
   * 监听交易状态变化
   * @param hash 交易哈希
   * @param callback 状态变化回调
   * @returns 取消监听的函数
   */
  watchTransactionStatus: (
    hash: string,
    callback: (status: 'pending' | 'success' | 'failed') => void
  ): (() => void) => {
    const interval = setInterval(async () => {
      try {
        const status = await transactionApi.getTransactionStatus(hash)
        callback(status.status)

        if (status.status !== 'pending') {
          clearInterval(interval)
        }
      } catch (error) {
        console.error('监听交易状态失败:', error)
      }
    }, 3000) // 每3秒检查一次

    return () => clearInterval(interval)
  },
}

// 导出类型
export * from './types'
