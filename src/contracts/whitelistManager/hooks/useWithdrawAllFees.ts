import { useCallback, useEffect } from 'react'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { getMessage } from '@/utils/message'
import { getErrorMessage } from '@/utils/error'
import WhitelistManager_ABI from '../../abi/WhitelistManager.json'

interface UseWithdrawAllFeesParams {
  whitelistManagerAddress: string
  chainId: number
  onSuccess?: (hash: string) => void
  onError?: (error: string) => void
}

export const useWithdrawAllFees = ({ whitelistManagerAddress, chainId, onSuccess, onError }: UseWithdrawAllFeesParams) => {
  const {
    data: hash,
    isPending: isWriting,
    error: writeError,
    writeContract,
  } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const withdrawAllFees = useCallback(
    (to: string) => {
      writeContract({
        address: whitelistManagerAddress as `0x${string}`,
        abi: WhitelistManager_ABI,
        functionName: 'withdrawAllFees',
        args: [to],
        chainId: chainId as any,
      })
    },
    [whitelistManagerAddress, chainId, writeContract]
  )

  useEffect(() => {
    if (isConfirmed && hash) {
      getMessage().success('提取所有费用成功')
      onSuccess?.(hash)
    }
  }, [isConfirmed, hash, onSuccess])

  useEffect(() => {
    if (writeError) {
      const errorMsg = getErrorMessage(writeError) || '提取所有费用失败'
      getMessage().error(errorMsg)
      onError?.(errorMsg)
    }
  }, [writeError, onError])

  return {
    withdrawAllFees,
    loading: isWriting || isConfirming,
    hash,
    isConfirmed,
  }
}

