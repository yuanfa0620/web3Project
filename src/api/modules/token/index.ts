// 代币相关API接口
import { createRequest } from '../../request'
import {
  TokenInfo,
  TokenList,
  TokenSearchResult,
  type GetTokenListParams,
  type GetTokenDetailParams,
  type SearchTokensParams
} from './types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

// 创建代币服务实例
const tokenRequest = createRequest({
  baseURL: `${API_BASE_URL}/token`,
  timeout: 10000,
  showGlobalLoading: true,
})

// 代币相关接口
export const tokenApi = {
  /**
   * 获取代币列表
   * @param params 查询参数
   * @returns 代币列表实例
   */
  getTokenList: async (params: GetTokenListParams = {}): Promise<TokenList> => {
    const response = await tokenRequest.get<any>('/list', {
      params: {
        chainId: params.chainId,
        page: params.page,
        limit: params.limit,
        sortBy: params.sortBy,
        sortOrder: params.sortOrder
      }
    })
    return new TokenList(response.data)
  },

  /**
   * 获取代币详情
   * @param params 代币地址和链ID参数
   * @returns 代币信息实例
   */
  getTokenDetail: async (params: GetTokenDetailParams): Promise<TokenInfo> => {
    const response = await tokenRequest.get<any>(`/detail/${params.address}`, {
      params: {
        chainId: params.chainId
      }
    })
    return new TokenInfo(response.data)
  },

  /**
   * 搜索代币
   * @param params 搜索参数
   * @returns 代币搜索结果实例
   */
  searchTokens: async (params: SearchTokensParams): Promise<TokenSearchResult> => {
    const response = await tokenRequest.get<any>('/search', {
      params: {
        keyword: params.keyword,
        chainId: params.chainId,
        limit: params.limit
      }
    })
    return new TokenSearchResult(response.data)
  },

  /**
   * 获取热门代币列表
   * @param chainId 链ID
   * @param limit 数量限制
   * @returns 代币列表实例
   */
  getPopularTokens: async (chainId?: number, limit = 20): Promise<TokenList> => {
    const response = await tokenRequest.get<any>('/popular', {
      params: {
        chainId,
        limit
      }
    })
    return new TokenList(response.data)
  },

  /**
   * 获取代币价格历史
   * @param address 代币地址
   * @param chainId 链ID
   * @param days 天数
   * @returns 价格历史数据
   */
  getTokenPriceHistory: async (
    address: string,
    chainId: number,
    days: 1 | 7 | 30 | 90 | 365 = 7
  ): Promise<Array<{ timestamp: number; price: number }>> => {
    const response = await tokenRequest.get<Array<{ timestamp: number; price: number }>>(`/price-history/${address}`, {
      params: {
        chainId,
        days
      }
    })
    return response.data
  },
}

// 导出类型
export * from './types'
