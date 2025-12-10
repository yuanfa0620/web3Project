import { useCallback, useEffect } from 'react'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { message } from 'antd'
import NFTMarketPlace_ABI from '../../abi/NFTMarketPlace.json'

interface UseUnpauseParams {
  marketplaceAddress: string
  chainId: number
  onSuccess?: (hash: string) => void
  onError?: (error: string) => void
}

export const useUnpause = ({ marketplaceAddress, chainId, onSuccess, onError }: UseUnpauseParams) => {
  const {
    data: hash,
    isPending: isWriting,
    error: writeError,
    writeContract,
  } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const unpause = useCallback(() => {
    writeContract({
      address: marketplaceAddress as `0x${string}`,
      abi: NFTMarketPlace_ABI,
      functionName: 'unpause',
      args: [],
      chainId: chainId as any,
    })
  }, [marketplaceAddress, chainId, writeContract])

  useEffect(() => {
    if (isConfirmed && hash) {
      message.success('恢复合约成功')
      onSuccess?.(hash)
    }
  }, [isConfirmed, hash, onSuccess])

  useEffect(() => {
    if (writeError) {
      const errorMsg = writeError.message || '恢复合约失败'
      message.error(errorMsg)
      onError?.(errorMsg)
    }
  }, [writeError, onError])

  return {
    unpause,
    loading: isWriting || isConfirming,
    hash,
    isConfirmed,
  }
}

