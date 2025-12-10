import { useCallback, useEffect } from 'react'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { message } from 'antd'
import type { AddToWhitelistParams } from '../index'
import NFTMarketPlace_ABI from '../../abi/NFTMarketPlace.json'

interface UseAddToWhitelistParams {
  marketplaceAddress: string
  chainId: number
  onSuccess?: (hash: string) => void
  onError?: (error: string) => void
}

export const useAddToWhitelist = ({ marketplaceAddress, chainId, onSuccess, onError }: UseAddToWhitelistParams) => {
  const {
    data: hash,
    isPending: isWriting,
    error: writeError,
    writeContract,
  } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const addToWhitelist = useCallback(
    (params: AddToWhitelistParams) => {
      const platformFeeRate = typeof params.platformFeeRate === 'string' 
        ? BigInt(params.platformFeeRate) 
        : params.platformFeeRate

      writeContract({
        address: marketplaceAddress as `0x${string}`,
        abi: NFTMarketPlace_ABI,
        functionName: 'addToWhitelist',
        args: [params.nftContract, platformFeeRate],
        chainId: chainId as any,
      })
    },
    [marketplaceAddress, chainId, writeContract]
  )

  useEffect(() => {
    if (isConfirmed && hash) {
      message.success('添加到白名单成功')
      onSuccess?.(hash)
    }
  }, [isConfirmed, hash, onSuccess])

  useEffect(() => {
    if (writeError) {
      const errorMsg = writeError.message || '添加到白名单失败'
      message.error(errorMsg)
      onError?.(errorMsg)
    }
  }, [writeError, onError])

  return {
    addToWhitelist,
    loading: isWriting || isConfirming,
    hash,
    isConfirmed,
  }
}

