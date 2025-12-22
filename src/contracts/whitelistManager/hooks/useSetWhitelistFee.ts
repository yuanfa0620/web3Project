import { useCallback, useEffect } from 'react'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { getMessage } from '@/utils/message'
import { getErrorMessage } from '@/utils/error'
import type { SetWhitelistFeeParams } from '../types'
import WhitelistManager_ABI from '../../abi/WhitelistManager.json'

interface UseSetWhitelistFeeParams {
  whitelistManagerAddress: string
  chainId: number
  onSuccess?: (hash: string) => void
  onError?: (error: string) => void
}

export const useSetWhitelistFee = ({ whitelistManagerAddress, chainId, onSuccess, onError }: UseSetWhitelistFeeParams) => {
  const {
    data: hash,
    isPending: isWriting,
    error: writeError,
    writeContract,
  } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const setWhitelistFee = useCallback(
    (params: SetWhitelistFeeParams) => {
      const fee = typeof params.fee === 'string' ? BigInt(params.fee) : params.fee

      writeContract({
        address: whitelistManagerAddress as `0x${string}`,
        abi: WhitelistManager_ABI,
        functionName: 'setWhitelistFee',
        args: [fee],
        chainId: chainId as any,
      })
    },
    [whitelistManagerAddress, chainId, writeContract]
  )

  useEffect(() => {
    if (isConfirmed && hash) {
      getMessage().success('设置白名单费用成功')
      onSuccess?.(hash)
    }
  }, [isConfirmed, hash, onSuccess])

  useEffect(() => {
    if (writeError) {
      const errorMsg = getErrorMessage(writeError) || '设置白名单费用失败'
      getMessage().error(errorMsg)
      onError?.(errorMsg)
    }
  }, [writeError, onError])

  return {
    setWhitelistFee,
    loading: isWriting || isConfirming,
    hash,
    isConfirmed,
  }
}

