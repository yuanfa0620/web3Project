/**
 * 使用Alchemy API获取NFT元数据的Hook
 */
import { useState, useEffect, useCallback } from 'react'
import { alchemyNFTApi, type AlchemyNFTMetadata } from '@/api/modules/alchemy'
import type { UserNFT } from '../../../types'

/**
 * 从NFT ID中解析出chainId、contractAddress和tokenId
 * NFT ID格式: chainId-contractAddress-tokenId
 * 注意：合约地址通常以0x开头，不包含-，所以可以按-分割，contractAddress是第二部分，tokenId是剩余部分
 */
const parseNFTId = (nftId: string): { chainId: number; contractAddress: string; tokenId: string } | null => {
  const parts = nftId.split('-')
  if (parts.length < 3) {
    return null
  }
  
  // chainId是第一部分
  const chainId = Number(parts[0])
  if (isNaN(chainId)) {
    return null
  }
  
  // contractAddress是第二部分（合约地址不会包含-）
  const contractAddress = parts[1]
  if (!contractAddress || !contractAddress.startsWith('0x')) {
    return null
  }
  
  // tokenId是剩余所有部分（用-连接，因为tokenId可能包含-）
  const tokenId = parts.slice(2).join('-')
  
  return { chainId, contractAddress, tokenId }
}

/**
 * 将Alchemy NFT元数据转换为UserNFT格式
 */
const convertAlchemyMetadataToUserNFT = (
  metadata: AlchemyNFTMetadata,
  chainId: number,
  address?: string
): UserNFT => {
  // 获取图片URL（优先使用cachedUrl，然后是originalUrl）
  const imageUrl = metadata.image?.cachedUrl || metadata.image?.originalUrl || ''
  
  // 获取NFT名称
  const name = metadata.name || 
    `${metadata.contract.name || 'NFT'} #${metadata.tokenId}`
  
  // 获取集合名称
  const collectionName = metadata.contract.openSeaMetadata?.collectionName || 
    metadata.contract.name || 
    'Unknown Collection'

  // 转换属性
  const attributes = metadata.raw?.metadata?.attributes 
    ? (Array.isArray(metadata.raw.metadata.attributes) 
        ? metadata.raw.metadata.attributes.map((attr: any) => ({
            trait_type: attr.trait_type || attr.traitType || 'Unknown',
            value: attr.value || '',
          }))
        : [])
    : undefined

  // 生成唯一ID：chainId-contractAddress-tokenId
  const id = `${chainId}-${metadata.contract.address}-${metadata.tokenId}`

  // 获取 tokenType：优先使用 metadata.tokenType，如果没有则使用 contract.tokenType
  const tokenType = metadata.tokenType || metadata.contract?.tokenType || ''

  return {
    id,
    contractAddress: metadata.contract.address,
    tokenId: metadata.tokenId,
    name,
    description: metadata.description || '',
    image: imageUrl,
    chainId,
    owner: address || '',
    createdAt: metadata.mint?.timestamp 
      ? new Date(metadata.mint.timestamp).getTime() / 1000 
      : Date.now() / 1000,
    collectionName,
    tokenType: tokenType || undefined, // 如果为空字符串则设为 undefined
    attributes,
  }
}

interface UseNFTMetadataParams {
  nftId: string | undefined
  address?: string
}

interface UseNFTMetadataReturn {
  nft: UserNFT | null
  loading: boolean
  error: string | null
  refetch: () => void
}

/**
 * 使用Alchemy API获取NFT元数据
 */
export const useNFTMetadata = ({ nftId, address }: UseNFTMetadataParams): UseNFTMetadataReturn => {
  const [nft, setNft] = useState<UserNFT | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMetadata = useCallback(async () => {
    if (!nftId) {
      setNft(null)
      setLoading(false)
      return
    }

    // 解析NFT ID
    const parsed = parseNFTId(nftId)
    if (!parsed) {
      setError('Invalid NFT ID format')
      setNft(null)
      setLoading(false)
      return
    }

    const { chainId, contractAddress, tokenId } = parsed

    setLoading(true)
    setError(null)

    try {
      const metadata = await alchemyNFTApi.getNFTMetadata(chainId, {
        contractAddress,
        tokenId,
      })

      // 转换为UserNFT格式
      const userNFT = convertAlchemyMetadataToUserNFT(metadata, chainId, address)
      setNft(userNFT)
    } catch (err: any) {
      console.error('Error fetching NFT metadata:', err)
      setError(err.message || '获取NFT详情失败')
      setNft(null)
    } finally {
      setLoading(false)
    }
  }, [nftId, address])

  useEffect(() => {
    fetchMetadata()
  }, [fetchMetadata])

  return {
    nft,
    loading,
    error,
    refetch: fetchMetadata,
  }
}

