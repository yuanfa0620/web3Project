import { useCallback, useEffect } from 'react'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { getMessage } from '@/utils/message'
import { getErrorMessage } from '@/utils/error'
import WhitelistManager_ABI from '../../abi/WhitelistManager.json'

interface UseTransferOwnershipParams {
  whitelistManagerAddress: string
  chainId: number
  onSuccess?: (hash: string) => void
  onError?: (error: string) => void
}

export const useTransferOwnership = ({ whitelistManagerAddress, chainId, onSuccess, onError }: UseTransferOwnershipParams) => {
  const {
    data: hash,
    isPending: isWriting,
    error: writeError,
    writeContract,
  } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const transferOwnership = useCallback(
    (newOwner: string) => {
      writeContract({
        address: whitelistManagerAddress as `0x${string}`,
        abi: WhitelistManager_ABI,
        functionName: 'transferOwnership',
        args: [newOwner],
        chainId: chainId as any,
      })
    },
    [whitelistManagerAddress, chainId, writeContract]
  )

  useEffect(() => {
    if (isConfirmed && hash) {
      getMessage().success('转移所有权成功')
      onSuccess?.(hash)
    }
  }, [isConfirmed, hash, onSuccess])

  useEffect(() => {
    if (writeError) {
      const errorMsg = getErrorMessage(writeError) || '转移所有权失败'
      getMessage().error(errorMsg)
      onError?.(errorMsg)
    }
  }, [writeError, onError])

  return {
    transferOwnership,
    loading: isWriting || isConfirming,
    hash,
    isConfirmed,
  }
}

