// 用户相关API接口
import { createRequest } from '../../request'
import type { ApiResponse } from '../../modules/data/types'
import {
  UserInfo,
  UserTransactionList,
  type GetUserInfoParams,
  type UpdateUserInfoParams,
  type GetUserTransactionsParams
} from './types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

// 创建用户服务实例
const userRequest = createRequest({
  baseURL: `${API_BASE_URL}/user`,
  timeout: 10000,
  showGlobalLoading: true,
})

// 用户相关接口
export const userApi = {
  /**
   * 获取用户信息
   * @param params 用户地址参数
   * @returns 用户信息实例
   */
  getUserInfo: async (params: GetUserInfoParams): Promise<UserInfo> => {
    const response = await userRequest.get<{ id: string; address: string; nickname?: string; avatar?: string; createdAt: string; updatedAt: string }>(`/info/${params.address}`)
    return new UserInfo(response.data)
  },

  /**
   * 更新用户信息
   * @param params 更新参数
   * @returns 更新后的用户信息实例
   */
  updateUserInfo: async (params: UpdateUserInfoParams): Promise<UserInfo> => {
    const response = await userRequest.put<{ id: string; address: string; nickname?: string; avatar?: string; createdAt: string; updatedAt: string }>('/info', params)
    return new UserInfo(response.data)
  },

  /**
   * 获取用户交易记录
   * @param params 查询参数
   * @returns 用户交易列表实例
   */
  getUserTransactions: async (params: GetUserTransactionsParams): Promise<UserTransactionList> => {
    const response = await userRequest.get<any>(`/transactions/${params.address}`, {
      params: {
        page: params.page,
        limit: params.limit,
        status: params.status,
        type: params.type
      }
    })
    return new UserTransactionList(response.data)
  },
}

// 导出类型
export * from './types'
