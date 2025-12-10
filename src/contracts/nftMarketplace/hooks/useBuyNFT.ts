import { useCallback, useEffect } from 'react'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther } from 'viem'
import { message } from 'antd'
import type { BuyNFTParams } from '../index'
import NFTMarketPlace_ABI from '../../abi/NFTMarketPlace.json'

interface UseBuyNFTParams {
  marketplaceAddress: string
  chainId: number
  onSuccess?: (hash: string) => void
  onError?: (error: string) => void
}

export const useBuyNFT = ({ marketplaceAddress, chainId, onSuccess, onError }: UseBuyNFTParams) => {
  const {
    data: hash,
    isPending: isWriting,
    error: writeError,
    writeContract,
  } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const buyNFT = useCallback(
    (params: BuyNFTParams, value: string | bigint) => {
      const tokenId = typeof params.tokenId === 'string' ? BigInt(params.tokenId) : params.tokenId
      const ethValue = typeof value === 'string' ? parseEther(value) : value

      writeContract({
        address: marketplaceAddress as `0x${string}`,
        abi: NFTMarketPlace_ABI,
        functionName: 'buyNFT',
        args: [params.nftContract, tokenId],
        value: ethValue,
        chainId: chainId as any,
      })
    },
    [marketplaceAddress, chainId, writeContract]
  )

  useEffect(() => {
    if (isConfirmed && hash) {
      message.success('购买 NFT 成功')
      onSuccess?.(hash)
    }
  }, [isConfirmed, hash, onSuccess])

  useEffect(() => {
    if (writeError) {
      const errorMsg = writeError.message || '购买 NFT 失败'
      message.error(errorMsg)
      onError?.(errorMsg)
    }
  }, [writeError, onError])

  return {
    buyNFT,
    loading: isWriting || isConfirming,
    hash,
    isConfirmed,
  }
}

