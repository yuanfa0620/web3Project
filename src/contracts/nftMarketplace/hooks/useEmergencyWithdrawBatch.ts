import { useCallback, useEffect } from 'react'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { getMessage } from '@/utils/message'
import { getErrorMessage } from '@/utils/error'
import type { EmergencyWithdrawBatchParams } from '../index'
import NFTMarketPlace_ABI from '../../abi/NFTMarketPlace.json'

interface UseEmergencyWithdrawBatchParams {
  marketplaceAddress: string
  chainId: number
  onSuccess?: (hash: string) => void
  onError?: (error: string) => void
}

export const useEmergencyWithdrawBatch = ({ marketplaceAddress, chainId, onSuccess, onError }: UseEmergencyWithdrawBatchParams) => {
  const {
    data: hash,
    isPending: isWriting,
    error: writeError,
    writeContract,
  } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const emergencyWithdrawBatch = useCallback(
    (params: EmergencyWithdrawBatchParams) => {
      const startIndex = typeof params.startIndex === 'string' ? BigInt(params.startIndex) : params.startIndex
      const endIndex = typeof params.endIndex === 'string' ? BigInt(params.endIndex) : params.endIndex

      writeContract({
        address: marketplaceAddress as `0x${string}`,
        abi: NFTMarketPlace_ABI,
        functionName: 'emergencyWithdrawBatch',
        args: [startIndex, endIndex],
        chainId: chainId as any,
      })
    },
    [marketplaceAddress, chainId, writeContract]
  )

  useEffect(() => {
    if (isConfirmed && hash) {
      getMessage().success('批量紧急提取 NFT 成功')
      onSuccess?.(hash)
    }
  }, [isConfirmed, hash, onSuccess])

  useEffect(() => {
    if (writeError) {
      const errorMsg = getErrorMessage(writeError) || '批量紧急提取 NFT 失败'
      getMessage().error(errorMsg)
      onError?.(errorMsg)
    }
  }, [writeError, onError])

  return {
    emergencyWithdrawBatch,
    loading: isWriting || isConfirming,
    hash,
    isConfirmed,
  }
}

