import { useCallback, useEffect } from 'react'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { getMessage } from '@/utils/message'
import { getErrorMessage } from '@/utils/error'
import NFTMarketPlace_ABI from '../../abi/NFTMarketPlace.json'

interface UseRemoveFromWhitelistParams {
  marketplaceAddress: string
  chainId: number
  onSuccess?: (hash: string) => void
  onError?: (error: string) => void
}

export const useRemoveFromWhitelist = ({ marketplaceAddress, chainId, onSuccess, onError }: UseRemoveFromWhitelistParams) => {
  const {
    data: hash,
    isPending: isWriting,
    error: writeError,
    writeContract,
  } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const removeFromWhitelist = useCallback(
    (nftContract: string) => {
      writeContract({
        address: marketplaceAddress as `0x${string}`,
        abi: NFTMarketPlace_ABI,
        functionName: 'removeFromWhitelist',
        args: [nftContract],
        chainId: chainId as any,
      })
    },
    [marketplaceAddress, chainId, writeContract]
  )

  useEffect(() => {
    if (isConfirmed && hash) {
      getMessage().success('从白名单移除成功')
      onSuccess?.(hash)
    }
  }, [isConfirmed, hash, onSuccess])

  useEffect(() => {
    if (writeError) {
      const errorMsg = getErrorMessage(writeError) || '从白名单移除失败'
      getMessage().error(errorMsg)
      onError?.(errorMsg)
    }
  }, [writeError, onError])

  return {
    removeFromWhitelist,
    loading: isWriting || isConfirming,
    hash,
    isConfirmed,
  }
}

