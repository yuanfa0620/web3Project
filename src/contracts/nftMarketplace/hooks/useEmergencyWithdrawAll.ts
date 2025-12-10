import { useCallback, useEffect } from 'react'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { message } from 'antd'
import NFTMarketPlace_ABI from '../../abi/NFTMarketPlace.json'

interface UseEmergencyWithdrawAllParams {
  marketplaceAddress: string
  chainId: number
  onSuccess?: (hash: string) => void
  onError?: (error: string) => void
}

export const useEmergencyWithdrawAll = ({ marketplaceAddress, chainId, onSuccess, onError }: UseEmergencyWithdrawAllParams) => {
  const {
    data: hash,
    isPending: isWriting,
    error: writeError,
    writeContract,
  } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const emergencyWithdrawAll = useCallback(() => {
    writeContract({
      address: marketplaceAddress as `0x${string}`,
      abi: NFTMarketPlace_ABI,
      functionName: 'emergencyWithdrawAll',
      args: [],
      chainId: chainId as any,
    })
  }, [marketplaceAddress, chainId, writeContract])

  useEffect(() => {
    if (isConfirmed && hash) {
      message.success('紧急提取所有 NFT 成功')
      onSuccess?.(hash)
    }
  }, [isConfirmed, hash, onSuccess])

  useEffect(() => {
    if (writeError) {
      const errorMsg = writeError.message || '紧急提取所有 NFT 失败'
      message.error(errorMsg)
      onError?.(errorMsg)
    }
  }, [writeError, onError])

  return {
    emergencyWithdrawAll,
    loading: isWriting || isConfirming,
    hash,
    isConfirmed,
  }
}

