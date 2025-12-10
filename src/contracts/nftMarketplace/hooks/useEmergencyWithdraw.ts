import { useCallback, useEffect } from 'react'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { message } from 'antd'
import type { EmergencyWithdrawParams } from '../index'
import NFTMarketPlace_ABI from '../../abi/NFTMarketPlace.json'

interface UseEmergencyWithdrawParams {
  marketplaceAddress: string
  chainId: number
  onSuccess?: (hash: string) => void
  onError?: (error: string) => void
}

export const useEmergencyWithdraw = ({ marketplaceAddress, chainId, onSuccess, onError }: UseEmergencyWithdrawParams) => {
  const {
    data: hash,
    isPending: isWriting,
    error: writeError,
    writeContract,
  } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const emergencyWithdraw = useCallback(
    (params: EmergencyWithdrawParams) => {
      const tokenId = typeof params.tokenId === 'string' ? BigInt(params.tokenId) : params.tokenId

      writeContract({
        address: marketplaceAddress as `0x${string}`,
        abi: NFTMarketPlace_ABI,
        functionName: 'emergencyWithdraw',
        args: [params.nftContract, tokenId, params.to],
        chainId: chainId as any,
      })
    },
    [marketplaceAddress, chainId, writeContract]
  )

  useEffect(() => {
    if (isConfirmed && hash) {
      message.success('紧急提取 NFT 成功')
      onSuccess?.(hash)
    }
  }, [isConfirmed, hash, onSuccess])

  useEffect(() => {
    if (writeError) {
      const errorMsg = writeError.message || '紧急提取 NFT 失败'
      message.error(errorMsg)
      onError?.(errorMsg)
    }
  }, [writeError, onError])

  return {
    emergencyWithdraw,
    loading: isWriting || isConfirming,
    hash,
    isConfirmed,
  }
}

