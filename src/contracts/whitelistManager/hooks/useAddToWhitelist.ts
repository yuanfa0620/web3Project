import { useCallback, useEffect } from 'react'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther } from 'viem'
import { message } from 'antd'
import type { AddToWhitelistParams } from '../index'
import WhitelistManager_ABI from '../../abi/WhitelistManager.json'

interface UseAddToWhitelistParams {
  whitelistManagerAddress: string
  chainId: number
  onSuccess?: (hash: string) => void
  onError?: (error: string) => void
}

export const useAddToWhitelist = ({ whitelistManagerAddress, chainId, onSuccess, onError }: UseAddToWhitelistParams) => {
  const {
    data: hash,
    isPending: isWriting,
    error: writeError,
    writeContract,
  } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const addToWhitelist = useCallback(
    (params: AddToWhitelistParams, fee: string | bigint) => {
      const platformFeeRate = typeof params.platformFeeRate === 'string' 
        ? BigInt(params.platformFeeRate) 
        : params.platformFeeRate
      const ethFee = typeof fee === 'string' ? parseEther(fee) : fee

      writeContract({
        address: whitelistManagerAddress as `0x${string}`,
        abi: WhitelistManager_ABI,
        functionName: 'addToWhitelist',
        args: [params.nftContract, platformFeeRate],
        value: ethFee,
        chainId: chainId as any,
      })
    },
    [whitelistManagerAddress, chainId, writeContract]
  )

  useEffect(() => {
    if (isConfirmed && hash) {
      message.success('添加到白名单成功')
      onSuccess?.(hash)
    }
  }, [isConfirmed, hash, onSuccess])

  useEffect(() => {
    if (writeError) {
      const errorMsg = writeError.message || '添加到白名单失败'
      message.error(errorMsg)
      onError?.(errorMsg)
    }
  }, [writeError, onError])

  return {
    addToWhitelist,
    loading: isWriting || isConfirming,
    hash,
    isConfirmed,
  }
}

