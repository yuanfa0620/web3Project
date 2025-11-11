import { useState, useEffect, useCallback, useRef } from 'react'
import type { NFTData } from '@/components/NFTCard'

const IPFS_HASH = 'QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq'
const TOTAL_NFTS = 10000
const BATCH_SIZE = 20 // 每次加载的数量
const IPFS_GATEWAYS = [
  'https://ipfs.io/ipfs',
  'https://gateway.pinata.cloud/ipfs',
  'https://cloudflare-ipfs.com/ipfs',
  'https://dweb.link/ipfs',
]

// 获取IPFS URL
const getIPFSUrl = (index: number, path: string = '') => {
  const gateway = IPFS_GATEWAYS[0] // 使用第一个gateway
  const url = path 
    ? `${gateway}/${IPFS_HASH}/${path}`
    : `${gateway}/${IPFS_HASH}/${index}`
  return url
}

// 规范化IPFS图片URL
// 处理各种格式：ipfs://QmXXX, QmXXX, https://ipfs.io/ipfs/QmXXX 等
const normalizeImageUrl = (image: string | undefined): string | undefined => {
  if (!image) return undefined

  const gateway = IPFS_GATEWAYS[0]

  // 如果已经是完整的HTTP/HTTPS URL，直接返回
  if (image.startsWith('http://') || image.startsWith('https://')) {
    return image
  }

  // 处理 ipfs:// 协议
  if (image.startsWith('ipfs://')) {
    const hash = image.replace('ipfs://', '').split('/')[0]
    return `${gateway}/${hash}`
  }

  // 处理 /ipfs/ 路径
  if (image.startsWith('/ipfs/')) {
    const hash = image.replace('/ipfs/', '').split('/')[0]
    return `${gateway}/${hash}`
  }

  // 如果只是hash（Qm开头），直接使用
  if (image.startsWith('Qm') || image.startsWith('baf')) {
    return `${gateway}/${image}`
  }

  // 其他情况，尝试作为hash处理
  return `${gateway}/${image}`
}

// 获取图片URL（备用方案）
const getImageUrl = (index: number) => {
  const gateway = IPFS_GATEWAYS[0]
  return `${gateway}/${IPFS_HASH}/${index}.png`
}

// 加载单个NFT数据
const loadNFTData = async (index: number): Promise<NFTData> => {
  try {
    // 先尝试加载JSON元数据
    const jsonUrl = getIPFSUrl(index)
    const response = await fetch(jsonUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })

    if (response.ok) {
      const data = await response.json()
      // 使用从JSON中获取的image字段，并规范化URL
      const normalizedImage = normalizeImageUrl(data.image)
      
      return {
        index,
        ...data,
        image: normalizedImage || getImageUrl(index),
      }
    } else {
      // 如果JSON不存在，返回基础数据
      return {
        index,
        name: `NFT #${index}`,
        image: getImageUrl(index),
      }
    }
  } catch (error) {
    console.warn(`Failed to load NFT ${index}:`, error)
    // 返回基础数据
    return {
      index,
      name: `NFT #${index}`,
      image: getImageUrl(index),
    }
  }
}

// 批量加载NFT数据
const loadNFTBatch = async (startIndex: number, batchSize: number): Promise<NFTData[]> => {
  const promises = []
  for (let i = 0; i < batchSize && startIndex + i < TOTAL_NFTS; i++) {
    promises.push(loadNFTData(startIndex + i))
  }
  return Promise.all(promises)
}

export const useNFTLoader = () => {
  const [nfts, setNfts] = useState<NFTData[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const loadingRef = useRef(false)

  // 加载更多NFT
  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore) return

    loadingRef.current = true
    setLoading(true)

    try {
      const startIndex = nfts.length
      const batch = await loadNFTBatch(startIndex, BATCH_SIZE)
      
      setNfts(prev => [...prev, ...batch])
      setHasMore(startIndex + batch.length < TOTAL_NFTS)
    } catch (error) {
      console.error('Failed to load NFTs:', error)
    } finally {
      setLoading(false)
      loadingRef.current = false
    }
  }, [nfts.length, hasMore])

  // 初始化加载
  useEffect(() => {
    if (nfts.length === 0 && !loadingRef.current) {
      loadMore()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    nfts,
    loading,
    hasMore,
    loadMore,
  }
}

