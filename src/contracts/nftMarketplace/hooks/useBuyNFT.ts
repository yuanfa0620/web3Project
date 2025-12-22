import { useCallback, useEffect } from 'react'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther } from 'viem'
import { getMessage } from '@/utils/message'
import { getErrorMessage } from '@/utils/error'
import type { BuyNFTByOrderIdParams } from '../types'
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
    (params: BuyNFTByOrderIdParams, value: string | bigint) => {
      const orderId = typeof params.orderId === 'string' ? BigInt(params.orderId) : params.orderId
      const ethValue = typeof value === 'string' ? parseEther(value) : value

      writeContract({
        address: marketplaceAddress as `0x${string}`,
        abi: NFTMarketPlace_ABI,
        functionName: 'buyNFTByOrderId',
        args: [orderId],
        value: ethValue,
        chainId: chainId as any,
      })
    },
    [marketplaceAddress, chainId, writeContract]
  )

  useEffect(() => {
    if (isConfirmed && hash) {
      getMessage().success('购买 NFT 成功')
      onSuccess?.(hash)
    }
  }, [isConfirmed, hash, onSuccess])

  useEffect(() => {
    if (writeError) {
      const errorMsg = getErrorMessage(writeError) || '购买 NFT 失败'
      getMessage().error(errorMsg)
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

