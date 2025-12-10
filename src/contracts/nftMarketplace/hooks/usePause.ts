import { useCallback, useEffect } from 'react'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { message } from 'antd'
import NFTMarketPlace_ABI from '../../abi/NFTMarketPlace.json'

interface UsePauseParams {
  marketplaceAddress: string
  chainId: number
  onSuccess?: (hash: string) => void
  onError?: (error: string) => void
}

export const usePause = ({ marketplaceAddress, chainId, onSuccess, onError }: UsePauseParams) => {
  const {
    data: hash,
    isPending: isWriting,
    error: writeError,
    writeContract,
  } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const pause = useCallback(() => {
    writeContract({
      address: marketplaceAddress as `0x${string}`,
      abi: NFTMarketPlace_ABI,
      functionName: 'pause',
      args: [],
      chainId: chainId as any,
    })
  }, [marketplaceAddress, chainId, writeContract])

  useEffect(() => {
    if (isConfirmed && hash) {
      message.success('暂停合约成功')
      onSuccess?.(hash)
    }
  }, [isConfirmed, hash, onSuccess])

  useEffect(() => {
    if (writeError) {
      const errorMsg = writeError.message || '暂停合约失败'
      message.error(errorMsg)
      onError?.(errorMsg)
    }
  }, [writeError, onError])

  return {
    pause,
    loading: isWriting || isConfirming,
    hash,
    isConfirmed,
  }
}

