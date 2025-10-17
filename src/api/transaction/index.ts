// 交易相关API接口
import { transactionApiService } from '../request'
import {
  TransactionInfo,
  TransactionList,
  type GetTransactionDetailParams,
  type GetTransactionListParams,
  type SubmitTransactionParams
} from './types'

export class TransactionApi {
  /**
   * 获取交易详情
   * @param params 交易哈希参数
   * @returns 交易信息实例
   */
  async getTransactionDetail(params: GetTransactionDetailParams): Promise<TransactionInfo> {
    const data = await transactionApiService.get(`/detail/${params.hash}`)
    return new TransactionInfo(data)
  }

  /**
   * 获取交易列表
   * @param params 查询参数
   * @returns 交易列表实例
   */
  async getTransactionList(params: GetTransactionListParams = {}): Promise<TransactionList> {
    const data = await transactionApiService.get('/list', {
      address: params.address,
      page: params.page,
      limit: params.limit,
      status: params.status,
      type: params.type,
      startTime: params.startTime,
      endTime: params.endTime
    })
    return new TransactionList(data)
  }

  /**
   * 提交交易
   * @param params 交易参数
   * @returns 交易哈希
   */
  async submitTransaction(params: SubmitTransactionParams): Promise<{ hash: string }> {
    return await transactionApiService.post('/submit', params)
  }

  /**
   * 获取待确认交易
   * @param address 钱包地址
   * @returns 待确认交易列表实例
   */
  async getPendingTransactions(address: string): Promise<TransactionList> {
    const data = await transactionApiService.get('/pending', { address })
    return new TransactionList(data)
  }

  /**
   * 获取交易状态
   * @param hash 交易哈希
   * @returns 交易状态
   */
  async getTransactionStatus(hash: string): Promise<{
    status: 'pending' | 'success' | 'failed'
    confirmations: number
    blockNumber?: number
  }> {
    return await transactionApiService.get(`/status/${hash}`)
  }

  /**
   * 估算Gas费用
   * @param params 交易参数
   * @returns Gas估算结果
   */
  async estimateGas(params: {
    to: string
    value: string
    data?: string
  }): Promise<{
    gasLimit: string
    gasPrice: string
    gasFee: string
  }> {
    return await transactionApiService.post('/estimate-gas', params)
  }

  /**
   * 获取交易历史统计
   * @param address 钱包地址
   * @param days 天数
   * @returns 统计信息
   */
  async getTransactionStats(
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
  }> {
    return await transactionApiService.get(`/stats/${address}`, { days })
  }

  /**
   * 监听交易状态变化
   * @param hash 交易哈希
   * @param callback 状态变化回调
   * @returns 取消监听的函数
   */
  watchTransactionStatus(
    hash: string,
    callback: (status: 'pending' | 'success' | 'failed') => void
  ): () => void {
    const interval = setInterval(async () => {
      try {
        const status = await this.getTransactionStatus(hash)
        callback(status.status)

        if (status.status !== 'pending') {
          clearInterval(interval)
        }
      } catch (error) {
        console.error('监听交易状态失败:', error)
      }
    }, 3000) // 每3秒检查一次

    return () => clearInterval(interval)
  }
}

// 导出交易API实例
export const transactionApi = new TransactionApi()

// 导出类型
export * from './types'
