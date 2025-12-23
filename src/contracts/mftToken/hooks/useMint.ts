import { useCallback, useEffect } from 'react'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther } from 'viem'
import { getMessage } from '@/utils/message'
import { getErrorMessage } from '@/utils/error'
import type { MintParams } from '../types'
import MFTToken_ABI from '../../abi/MFTToken.json'

interface UseMintParams {
  tokenAddress: string
  chainId: number
  onSuccess?: (hash: string) => void
  onError?: (error: string) => void
}

export const useMint = ({ tokenAddress, chainId, onSuccess, onError }: UseMintParams) => {
  const {
    data: hash,
    isPending: isWriting,
    error: writeError,
    writeContract,
  } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const mint = useCallback(
    (params: MintParams) => {
      const value = typeof params.value === 'string' ? parseEther(params.value) : params.value

      writeContract({
        address: tokenAddress as `0x${string}`,
        abi: MFTToken_ABI,
        functionName: 'mint',
        args: [],
        value,
        chainId: chainId as any,
      })
    },
    [tokenAddress, chainId, writeContract]
  )

  useEffect(() => {
    if (isConfirmed && hash) {
      getMessage().success('铸造代币成功')
      onSuccess?.(hash)
    }
  }, [isConfirmed, hash, onSuccess])

  useEffect(() => {
    if (writeError) {
      const errorMsg = getErrorMessage(writeError) || '铸造代币失败'
      getMessage().error(errorMsg)
      onError?.(errorMsg)
    }
  }, [writeError, onError])

  return {
    mint,
    loading: isWriting || isConfirming,
    hash,
    isConfirmed,
  }
}

