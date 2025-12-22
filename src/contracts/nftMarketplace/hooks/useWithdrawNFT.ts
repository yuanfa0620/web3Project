import { useCallback, useEffect } from 'react'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { getMessage } from '@/utils/message'
import { getErrorMessage } from '@/utils/error'
import type { WithdrawNFTByOrderIdParams } from '../types'
import NFTMarketPlace_ABI from '../../abi/NFTMarketPlace.json'

interface UseWithdrawNFTParams {
  marketplaceAddress: string
  chainId: number
  onSuccess?: (hash: string) => void
  onError?: (error: string) => void
}

export const useWithdrawNFT = ({ marketplaceAddress, chainId, onSuccess, onError }: UseWithdrawNFTParams) => {
  const {
    data: hash,
    isPending: isWriting,
    error: writeError,
    writeContract,
  } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const withdrawNFT = useCallback(
    (params: WithdrawNFTByOrderIdParams) => {
      const orderId = typeof params.orderId === 'string' ? BigInt(params.orderId) : params.orderId

      writeContract({
        address: marketplaceAddress as `0x${string}`,
        abi: NFTMarketPlace_ABI,
        functionName: 'withdrawNFTByOrderId',
        args: [orderId],
        chainId: chainId as any,
      })
    },
    [marketplaceAddress, chainId, writeContract]
  )

  useEffect(() => {
    if (isConfirmed && hash) {
      getMessage().success('提取 NFT 成功')
      onSuccess?.(hash)
    }
  }, [isConfirmed, hash, onSuccess])

  useEffect(() => {
    if (writeError) {
      const errorMsg = getErrorMessage(writeError) || '提取 NFT 失败'
      getMessage().error(errorMsg)
      onError?.(errorMsg)
    }
  }, [writeError, onError])

  return {
    withdrawNFT,
    loading: isWriting || isConfirming,
    hash,
    isConfirmed,
  }
}

