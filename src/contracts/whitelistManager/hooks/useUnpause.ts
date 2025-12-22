import { useCallback, useEffect } from 'react'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { getMessage } from '@/utils/message'
import { getErrorMessage } from '@/utils/error'
import WhitelistManager_ABI from '../../abi/WhitelistManager.json'

interface UseUnpauseParams {
  whitelistManagerAddress: string
  chainId: number
  onSuccess?: (hash: string) => void
  onError?: (error: string) => void
}

export const useUnpause = ({ whitelistManagerAddress, chainId, onSuccess, onError }: UseUnpauseParams) => {
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
      address: whitelistManagerAddress as `0x${string}`,
      abi: WhitelistManager_ABI,
      functionName: 'unpause',
      args: [],
      chainId: chainId as any,
    })
  }, [whitelistManagerAddress, chainId, writeContract])

  useEffect(() => {
    if (isConfirmed && hash) {
      getMessage().success('恢复合约成功')
      onSuccess?.(hash)
    }
  }, [isConfirmed, hash, onSuccess])

  useEffect(() => {
    if (writeError) {
      const errorMsg = getErrorMessage(writeError) || '恢复合约失败'
      getMessage().error(errorMsg)
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

