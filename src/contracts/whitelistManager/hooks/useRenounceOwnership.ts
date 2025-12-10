import { useCallback, useEffect } from 'react'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { message } from 'antd'
import WhitelistManager_ABI from '../../abi/WhitelistManager.json'

interface UseRenounceOwnershipParams {
  whitelistManagerAddress: string
  chainId: number
  onSuccess?: (hash: string) => void
  onError?: (error: string) => void
}

export const useRenounceOwnership = ({ whitelistManagerAddress, chainId, onSuccess, onError }: UseRenounceOwnershipParams) => {
  const {
    data: hash,
    isPending: isWriting,
    error: writeError,
    writeContract,
  } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const renounceOwnership = useCallback(() => {
    writeContract({
      address: whitelistManagerAddress as `0x${string}`,
      abi: WhitelistManager_ABI,
      functionName: 'renounceOwnership',
      args: [],
      chainId: chainId as any,
    })
  }, [whitelistManagerAddress, chainId, writeContract])

  useEffect(() => {
    if (isConfirmed && hash) {
      message.success('放弃所有权成功')
      onSuccess?.(hash)
    }
  }, [isConfirmed, hash, onSuccess])

  useEffect(() => {
    if (writeError) {
      const errorMsg = writeError.message || '放弃所有权失败'
      message.error(errorMsg)
      onError?.(errorMsg)
    }
  }, [writeError, onError])

  return {
    renounceOwnership,
    loading: isWriting || isConfirming,
    hash,
    isConfirmed,
  }
}

