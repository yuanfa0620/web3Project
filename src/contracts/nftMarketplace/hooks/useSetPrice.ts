import { useCallback, useEffect } from 'react'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { getMessage } from '@/utils/message'
import { getErrorMessage } from '@/utils/error'
import type { SetPriceParams } from '../index'
import NFTMarketPlace_ABI from '../../abi/NFTMarketPlace.json'

interface UseSetPriceParams {
  marketplaceAddress: string
  chainId: number
  onSuccess?: (hash: string) => void
  onError?: (error: string) => void
}

export const useSetPrice = ({ marketplaceAddress, chainId, onSuccess, onError }: UseSetPriceParams) => {
  const {
    data: hash,
    isPending: isWriting,
    error: writeError,
    writeContract,
  } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const setPrice = useCallback(
    (params: SetPriceParams) => {
      const tokenId = typeof params.tokenId === 'string' ? BigInt(params.tokenId) : params.tokenId
      const price = typeof params.price === 'string' ? BigInt(params.price) : params.price

      writeContract({
        address: marketplaceAddress as `0x${string}`,
        abi: NFTMarketPlace_ABI,
        functionName: 'setPrice',
        args: [params.nftContract, tokenId, price],
        chainId: chainId as any,
      })
    },
    [marketplaceAddress, chainId, writeContract]
  )

  useEffect(() => {
    if (isConfirmed && hash) {
      getMessage().success('设置价格成功')
      onSuccess?.(hash)
    }
  }, [isConfirmed, hash, onSuccess])

  useEffect(() => {
    if (writeError) {
      const errorMsg = getErrorMessage(writeError) || '设置价格失败'
      getMessage().error(errorMsg)
      onError?.(errorMsg)
    }
  }, [writeError, onError])

  return {
    setPrice,
    loading: isWriting || isConfirming,
    hash,
    isConfirmed,
  }
}

