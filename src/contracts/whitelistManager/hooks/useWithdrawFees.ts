import { useCallback, useEffect } from 'react'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { message } from 'antd'
import type { WithdrawFeesParams } from '../index'
import WhitelistManager_ABI from '../../abi/WhitelistManager.json'

interface UseWithdrawFeesParams {
  whitelistManagerAddress: string
  chainId: number
  onSuccess?: (hash: string) => void
  onError?: (error: string) => void
}

export const useWithdrawFees = ({ whitelistManagerAddress, chainId, onSuccess, onError }: UseWithdrawFeesParams) => {
  const {
    data: hash,
    isPending: isWriting,
    error: writeError,
    writeContract,
  } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const withdrawFees = useCallback(
    (params: WithdrawFeesParams) => {
      const amount = typeof params.amount === 'string' ? BigInt(params.amount) : params.amount

      writeContract({
        address: whitelistManagerAddress as `0x${string}`,
        abi: WhitelistManager_ABI,
        functionName: 'withdrawFees',
        args: [params.to, amount],
        chainId: chainId as any,
      })
    },
    [whitelistManagerAddress, chainId, writeContract]
  )

  useEffect(() => {
    if (isConfirmed && hash) {
      message.success('提取费用成功')
      onSuccess?.(hash)
    }
  }, [isConfirmed, hash, onSuccess])

  useEffect(() => {
    if (writeError) {
      const errorMsg = writeError.message || '提取费用失败'
      message.error(errorMsg)
      onError?.(errorMsg)
    }
  }, [writeError, onError])

  return {
    withdrawFees,
    loading: isWriting || isConfirming,
    hash,
    isConfirmed,
  }
}

