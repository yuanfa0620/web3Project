/**
 * 使用Alchemy API获取NFT数据的Hook（使用react-activation缓存组件状态）
 */
import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useAccount } from 'wagmi'
import { alchemyNFTApi, type AlchemyOwnedNFT } from '@/api/modules/alchemy'
import type { UserNFT } from '../../../types'
import { ALCHEMY_NETWORK_MAP } from '@/api/modules/alchemy/types'

/**
 * 将Alchemy NFT数据转换为UserNFT格式
 */
const convertAlchemyNFTToUserNFT = (alchemyNFT: AlchemyOwnedNFT, chainId: number, address: string): UserNFT => {
  // 获取图片URL（优先使用cachedUrl，然后是originalUrl）
  const imageUrl = alchemyNFT.image?.cachedUrl || alchemyNFT.image?.originalUrl || ''
  
  // 获取NFT名称
  const name = alchemyNFT.name || 
    `${alchemyNFT.contract.name || 'NFT'} #${alchemyNFT.tokenId}`
  
  // 获取集合名称
  const collectionName = alchemyNFT.contract.openSeaMetadata?.collectionName || 
    alchemyNFT.contract.name || 
    'Unknown Collection'

  // 转换属性
  const attributes = alchemyNFT.raw?.metadata?.attributes 
    ? (Array.isArray(alchemyNFT.raw.metadata.attributes) 
        ? alchemyNFT.raw.metadata.attributes.map((attr: any) => ({
            trait_type: attr.trait_type || attr.traitType || 'Unknown',
            value: attr.value || '',
          }))
        : [])
    : undefined

  // 生成唯一ID：chainId-contractAddress-tokenId
  const id = `${chainId}-${alchemyNFT.contract.address}-${alchemyNFT.tokenId}`

  // 获取 tokenType：优先使用 alchemyNFT.tokenType，如果没有则使用 contract.tokenType
  const tokenType = alchemyNFT.tokenType || alchemyNFT.contract?.tokenType || ''

  return {
    id,
    contractAddress: alchemyNFT.contract.address,
    tokenId: alchemyNFT.tokenId,
    name,
    description: alchemyNFT.description || '',
    image: imageUrl,
    chainId,
    owner: address || '', // 使用传入的地址作为owner
    createdAt: alchemyNFT.mint?.timestamp 
      ? new Date(alchemyNFT.mint.timestamp).getTime() / 1000 
      : Date.now() / 1000,
    collectionName,
    tokenType: tokenType || undefined, // 如果为空字符串则设为 undefined
    attributes,
  }
}

interface UseAlchemyNFTsParams {
  address: string | undefined
  chainIds: number[]
  enabled?: boolean
  pageSize?: number // 每页数量，默认50
}

interface ChainNFTState {
  nfts: UserNFT[]
  pageKey: string | null
  hasMore: boolean
  loading: boolean
}

interface UseAlchemyNFTsReturn {
  nfts: UserNFT[]
  loading: boolean
  error: string | null
  hasMore: boolean
  loadMore: () => void
  refetch: () => void
}

/**
 * 使用Alchemy API获取NFT数据（支持分页和滚动加载）
 */
export const useAlchemyNFTs = ({
  address,
  chainIds,
  enabled = true,
  pageSize = 50,
}: UseAlchemyNFTsParams): UseAlchemyNFTsReturn => {
  const [chainNFTStates, setChainNFTStates] = useState<Map<number, ChainNFTState>>(new Map())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // 使用ref存储最新状态，避免在useCallback中依赖state
  const chainNFTStatesRef = useRef<Map<number, ChainNFTState>>(new Map())
  // 使用ref存储上一次的依赖值，避免重复请求
  const prevDepsRef = useRef<{ address?: string; chainIds: string; enabled: boolean } | null>(null)
  const isLoadingRef = useRef(false)

  // 合并所有网络的NFT
  const nfts = useMemo(() => {
    const allNFTs: UserNFT[] = []
    chainNFTStates.forEach((state) => {
      allNFTs.push(...state.nfts)
    })
    // 按创建时间排序（最新的在前）
    return allNFTs.sort((a, b) => b.createdAt - a.createdAt)
  }, [chainNFTStates])

  // 检查是否还有更多数据
  const hasMore = useMemo(() => {
    let hasMoreData = false
    chainNFTStates.forEach((state) => {
      if (state.hasMore) {
        hasMoreData = true
      }
    })
    return hasMoreData
  }, [chainNFTStates])

  // 初始加载或重置（使用react-activation缓存组件状态，不需要sessionStorage）
  const fetchNFTs = useCallback(async (reset = false) => {
    if (!address || !enabled || chainIds.length === 0) {
      setChainNFTStates(new Map())
      setLoading(false)
      isLoadingRef.current = false
      return
    }

    // 防止重复请求
    if (isLoadingRef.current && !reset) {
      return
    }

    const supportedChainIds = chainIds.filter(chainId => ALCHEMY_NETWORK_MAP[chainId])
    
    // 如果reset=true，清空状态
    if (reset) {
      setChainNFTStates(new Map())
    }

    isLoadingRef.current = true
    setLoading(true)
    setError(null)

    try {
      // 并发请求所有支持的网络（只请求第一页）
      const fetchPromises = supportedChainIds.map(async (chainId) => {
        try {
          const result = await alchemyNFTApi.getNFTsForOwner(chainId, {
            owner: address,
            pageSize,
          })
          
          // 转换数据格式
          const convertedNFTs = result.nfts.map((alchemyNFT) => 
            convertAlchemyNFTToUserNFT(alchemyNFT, chainId, address)
          )
          
          return {
            chainId,
            nfts: convertedNFTs,
            pageKey: result.pageKey,
            hasMore: !!result.pageKey,
          }
        } catch (err: any) {
          console.error(`Error fetching NFTs for chain ${chainId}:`, err)
          // 单个网络失败不影响其他网络
          return { chainId, nfts: [], pageKey: null, hasMore: false }
        }
      })

      const results = await Promise.all(fetchPromises)
      
      // 更新状态
      setChainNFTStates((prev) => {
        const newMap = reset ? new Map() : new Map(prev)
        results.forEach(({ chainId, nfts, pageKey, hasMore }) => {
          newMap.set(chainId, {
            nfts,
            pageKey,
            hasMore,
            loading: false,
          })
        })
        chainNFTStatesRef.current = newMap
        return newMap
      })
    } catch (err: any) {
      console.error('Error fetching NFTs:', err)
      setError(err.message || '获取NFT数据失败')
    } finally {
      setLoading(false)
      isLoadingRef.current = false
    }
  }, [address, chainIds, enabled, pageSize])

  // 加载更多（滚动加载）
  const loadMore = useCallback(async () => {
    if (!address || !enabled || chainIds.length === 0 || loading || !hasMore) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      const supportedChainIds = chainIds.filter(chainId => ALCHEMY_NETWORK_MAP[chainId])
      
      // 并发加载所有还有更多数据的网络
      const loadPromises = supportedChainIds.map(async (chainId) => {
        try {
          // 从ref获取最新状态
          const currentState = chainNFTStatesRef.current.get(chainId)

          // 如果这个网络没有更多数据，跳过
          if (!currentState || !currentState.hasMore || !currentState.pageKey) {
            return null
          }

          const result = await alchemyNFTApi.getNFTsForOwner(chainId, {
            owner: address,
            pageSize,
            pageKey: currentState.pageKey,
          })
          
          // 转换数据格式
          const convertedNFTs = result.nfts.map((alchemyNFT) => 
            convertAlchemyNFTToUserNFT(alchemyNFT, chainId, address)
          )
          
          return {
            chainId,
            nfts: convertedNFTs,
            pageKey: result.pageKey,
            hasMore: !!result.pageKey,
          }
        } catch (err: any) {
          console.error(`Error loading more NFTs for chain ${chainId}:`, err)
          return null
        }
      })

      const results = (await Promise.all(loadPromises)).filter((r): r is NonNullable<typeof r> => r !== null)
      
      // 更新状态，追加新数据
      setChainNFTStates((prev) => {
        const newMap = new Map(prev)
        results.forEach(({ chainId, nfts: newNFTs, pageKey, hasMore }) => {
          const currentState = prev.get(chainId)
          if (currentState) {
            newMap.set(chainId, {
              nfts: [...currentState.nfts, ...newNFTs],
              pageKey,
              hasMore,
              loading: false,
            })
          }
        })
        chainNFTStatesRef.current = newMap
        return newMap
      })
    } catch (err: any) {
      console.error('Error loading more NFTs:', err)
      setError(err.message || '加载更多NFT数据失败')
    } finally {
      setLoading(false)
    }
  }, [address, chainIds, enabled, pageSize, loading, hasMore])

  // 同步ref和state
  useEffect(() => {
    chainNFTStatesRef.current = chainNFTStates
  }, [chainNFTStates])

  // 使用useMemo生成稳定的chainIds标识
  const chainIdsKey = useMemo(() => {
    return [...chainIds].sort().join(',')
  }, [chainIds])

  // 初始加载（使用深度比较避免重复请求）
  useEffect(() => {
    const currentDeps = {
      address,
      chainIds: chainIdsKey,
      enabled,
    }

    // 比较是否真的发生了变化
    const prevDeps = prevDepsRef.current
    if (prevDeps) {
      const isSame = 
        prevDeps.address === currentDeps.address &&
        prevDeps.chainIds === currentDeps.chainIds &&
        prevDeps.enabled === currentDeps.enabled
      
      if (isSame) {
        // 依赖没有变化，不重新请求
        return
      }
    }

    // 更新依赖记录
    prevDepsRef.current = currentDeps

    // 执行请求（react-activation会保留组件状态，所以只在依赖变化时请求）
    fetchNFTs(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, enabled, chainIdsKey]) // 使用稳定的chainIdsKey作为依赖

  return {
    nfts,
    loading,
    error,
    hasMore,
    loadMore,
    refetch: () => fetchNFTs(true), // reset=true，重新请求
  }
}

