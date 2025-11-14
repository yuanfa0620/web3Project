// 代币相关API接口
import { tokenApiService } from '../../request'
import  { 
  TokenInfo, 
  TokenList, 
  TokenSearchResult,
  type GetTokenListParams, 
  type GetTokenDetailParams, 
  type SearchTokensParams 
} from './types'

export class TokenApi {
  /**
   * 获取代币列表
   * @param params 查询参数
   * @returns 代币列表实例
   */
  async getTokenList(params: GetTokenListParams = {}): Promise<TokenList> {
    const data = await tokenApiService.get('/list', {
      chainId: params.chainId,
      page: params.page,
      limit: params.limit,
      sortBy: params.sortBy,
      sortOrder: params.sortOrder
    })
    return new TokenList(data)
  }

  /**
   * 获取代币详情
   * @param params 代币地址和链ID参数
   * @returns 代币信息实例
   */
  async getTokenDetail(params: GetTokenDetailParams): Promise<TokenInfo> {
    const data = await tokenApiService.get(`/detail/${params.address}`, {
      chainId: params.chainId
    })
    return new TokenInfo(data)
  }

  /**
   * 搜索代币
   * @param params 搜索参数
   * @returns 代币搜索结果实例
   */
  async searchTokens(params: SearchTokensParams): Promise<TokenSearchResult> {
    const data = await tokenApiService.get('/search', {
      keyword: params.keyword,
      chainId: params.chainId,
      limit: params.limit
    })
    return new TokenSearchResult(data)
  }

  /**
   * 获取热门代币列表
   * @param chainId 链ID
   * @param limit 数量限制
   * @returns 代币列表实例
   */
  async getPopularTokens(chainId?: number, limit = 20): Promise<TokenList> {
    const data = await tokenApiService.get('/popular', {
      chainId,
      limit
    })
    return new TokenList(data)
  }

  /**
   * 获取代币价格历史
   * @param address 代币地址
   * @param chainId 链ID
   * @param days 天数
   * @returns 价格历史数据
   */
  async getTokenPriceHistory(
    address: string, 
    chainId: number, 
    days: 1 | 7 | 30 | 90 | 365 = 7
  ): Promise<Array<{ timestamp: number; price: number }>> {
    return await tokenApiService.get(`/price-history/${address}`, {
      chainId,
      days
    })
  }
}

// 导出代币API实例
export const tokenApi = new TokenApi()

// 导出类型
export * from './types'
