import { useCallback, useEffect } from 'react'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { getMessage } from '@/utils/message'
import { getErrorMessage } from '@/utils/error'
import type { WithdrawPlatformFeesParams } from '../types'
import NFTMarketPlace_ABI from '../../abi/NFTMarketPlace.json'

interface UseWithdrawPlatformFeesParams {
  marketplaceAddress: string
  chainId: number
  onSuccess?: (hash: string) => void
  onError?: (error: string) => void
}

export const useWithdrawPlatformFees = ({ marketplaceAddress, chainId, onSuccess, onError }: UseWithdrawPlatformFeesParams) => {
  const {
    data: hash,
    isPending: isWriting,
    error: writeError,
    writeContract,
  } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const withdrawPlatformFees = useCallback(
    (params: WithdrawPlatformFeesParams) => {
      const amount = typeof params.amount === 'string' ? BigInt(params.amount) : params.amount

      writeContract({
        address: marketplaceAddress as `0x${string}`,
        abi: NFTMarketPlace_ABI,
        functionName: 'withdrawPlatformFees',
        args: [params.to, amount],
        chainId: chainId as any,
      })
    },
    [marketplaceAddress, chainId, writeContract]
  )

  useEffect(() => {
    if (isConfirmed && hash) {
      getMessage().success('提取平台费用成功')
      onSuccess?.(hash)
    }
  }, [isConfirmed, hash, onSuccess])

  useEffect(() => {
    if (writeError) {
      const errorMsg = getErrorMessage(writeError) || '提取平台费用失败'
      getMessage().error(errorMsg)
      onError?.(errorMsg)
    }
  }, [writeError, onError])

  return {
    withdrawPlatformFees,
    loading: isWriting || isConfirming,
    hash,
    isConfirmed,
  }
}

