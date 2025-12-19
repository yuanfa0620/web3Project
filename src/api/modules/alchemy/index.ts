/**
 * Alchemy NFT API 接口封装
 */
import axios from 'axios'
import type { AxiosInstance } from 'axios'
import {
  ALCHEMY_NETWORK_MAP,
  AlchemyNFTList,
  type GetNFTsForOwnerParams,
  type AlchemyGetNFTsResponse,
  type GetNFTMetadataParams,
  type AlchemyNFTMetadata
} from './types'

// Alchemy API Key（从环境变量获取，如果没有则使用默认值）
const ALCHEMY_API_KEY = import.meta.env.VITE_ALCHEMY_API_KEY || '4k84D40IoMfmLVP2KOaAq3TG2FnQBSoN'

/**
 * 根据chainId获取Alchemy网络标识
 */
const getAlchemyNetwork = (chainId: number): string => {
  const network = ALCHEMY_NETWORK_MAP[chainId]
  if (!network) {
    throw new Error(`Unsupported chainId: ${chainId}. Supported chains: ${Object.keys(ALCHEMY_NETWORK_MAP).join(', ')}`)
  }
  return network
}

/**
 * 创建Alchemy API请求实例
 */
const createAlchemyRequest = (chainId: number): AxiosInstance => {
  const network = getAlchemyNetwork(chainId)
  const baseURL = `https://${network}.g.alchemy.com/nft/v3/${ALCHEMY_API_KEY}`

  return axios.create({
    baseURL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

/**
 * Alchemy NFT API
 */
export const alchemyNFTApi = {
  /**
   * 获取指定地址拥有的NFT列表
   * @param chainId 链ID
   * @param params 查询参数
   * @returns NFT列表实例
   */
  getNFTsForOwner: async (
    chainId: number,
    params: GetNFTsForOwnerParams
  ): Promise<AlchemyNFTList> => {
    try {
      const request = createAlchemyRequest(chainId)

      const queryParams: Record<string, any> = {
        owner: params.owner,
        pageSize: params.pageSize,
      }

      // 添加可选参数
      if (params.contractAddresses && params.contractAddresses.length > 0) {
        queryParams.contractAddresses = params.contractAddresses
      }

      if (params.excludeFilters && params.excludeFilters.length > 0) {
        queryParams.excludeFilters = params.excludeFilters
      }

      if (params.includeFilters && params.includeFilters.length > 0) {
        queryParams.includeFilters = params.includeFilters
      }

      if (params.pageKey) {
        queryParams.pageKey = params.pageKey
      }

      const response = await request.get<AlchemyGetNFTsResponse>('/getNFTsForOwner', {
        params: queryParams,
      })

      return new AlchemyNFTList(response.data)
    } catch (error: any) {
      console.error('Alchemy NFT API Error:', error)

      // 处理错误响应
      if (error.response) {
        throw new Error(
          `Alchemy API Error: ${error.response.status} - ${error.response.data?.message || error.response.statusText
          }`
        )
      } else if (error.request) {
        throw new Error('Alchemy API Error: Network error, please check your connection')
      } else {
        throw new Error(`Alchemy API Error: ${error.message}`)
      }
    }
  },

  /**
   * 获取指定地址拥有的所有NFT（自动处理分页）
   * @param chainId 链ID
   * @param owner 钱包地址
   * @param contractAddresses 合约地址列表（可选）
   * @param pageSize 每页数量（默认100）
   * @param excludeFilters 排除过滤（可选）
   * @param includeFilters 包含过滤（可选）
   * @returns 所有NFT列表
   */
  getAllNFTsForOwner: async (
    chainId: number,
    owner: string,
    contractAddresses?: string[],
    pageSize: number = 100,
    excludeFilters?: string[],
    includeFilters?: string[]
  ): Promise<AlchemyNFTList> => {
    const allNFTs: AlchemyNFTList[] = []
    let pageKey: string | undefined = undefined
    let totalCount = 0
    let validAt: any = null

    do {
      const result = await alchemyNFTApi.getNFTsForOwner(chainId, {
        owner,
        contractAddresses,
        pageSize,
        excludeFilters,
        includeFilters,
        pageKey,
      })

      allNFTs.push(result)
      totalCount = result.totalCount
      validAt = result.validAt
      pageKey = result.pageKey || undefined
    } while (pageKey)

    // 合并所有NFT
    const allOwnedNFTs = allNFTs.flatMap(list => list.nfts)

    return new AlchemyNFTList({
      ownedNfts: allOwnedNFTs,
      totalCount,
      validAt,
      pageKey: null,
    })
  },

  /**
   * 获取NFT元数据
   * @param chainId 链ID
   * @param params 查询参数
   * @returns NFT元数据
   */
  getNFTMetadata: async (
    chainId: number,
    params: GetNFTMetadataParams
  ): Promise<AlchemyNFTMetadata> => {
    try {
      const request = createAlchemyRequest(chainId)

      const queryParams: Record<string, any> = {
        contractAddress: params.contractAddress,
        tokenId: params.tokenId,
      }

      // 添加可选参数
      if (params.tokenUriTimeoutInMs !== undefined) {
        queryParams.tokenUriTimeoutInMs = params.tokenUriTimeoutInMs
      }

      if (params.refreshCache !== undefined) {
        queryParams.refreshCache = params.refreshCache
      }

      const response = await request.get<AlchemyNFTMetadata>('/getNFTMetadata', {
        params: queryParams,
      })

      return response.data
    } catch (error: any) {
      console.error('Alchemy NFT Metadata API Error:', error)

      // 处理错误响应
      if (error.response) {
        throw new Error(
          `Alchemy API Error: ${error.response.status} - ${error.response.data?.message || error.response.statusText
          }`
        )
      } else if (error.request) {
        throw new Error('Alchemy API Error: Network error, please check your connection')
      } else {
        throw new Error(`Alchemy API Error: ${error.message}`)
      }
    }
  },
}

// 导出类型
export * from './types'

