// 用户相关API接口
import { userApiService } from '../request'
import { 
  UserInfo, 
  UserTransactionList, 
  type GetUserInfoParams, 
  type UpdateUserInfoParams, 
  type GetUserTransactionsParams 
} from './types'

export class UserApi {
  /**
   * 获取用户信息
   * @param params 用户地址参数
   * @returns 用户信息实例
   */
  async getUserInfo(params: GetUserInfoParams): Promise<UserInfo> {
    const data = await userApiService.get(`/info/${params.address}`)
    return new UserInfo(data)
  }

  /**
   * 更新用户信息
   * @param params 更新参数
   * @returns 更新后的用户信息实例
   */
  async updateUserInfo(params: UpdateUserInfoParams): Promise<UserInfo> {
    const data = await userApiService.put('/info', params)
    return new UserInfo(data)
  }

  /**
   * 获取用户交易记录
   * @param params 查询参数
   * @returns 用户交易列表实例
   */
  async getUserTransactions(params: GetUserTransactionsParams): Promise<UserTransactionList> {
    const data = await userApiService.get(`/transactions/${params.address}`, {
      page: params.page,
      limit: params.limit,
      status: params.status,
      type: params.type
    })
    return new UserTransactionList(data)
  }
}

// 导出用户API实例
export const userApi = new UserApi()

// 导出类型
export * from './types'
