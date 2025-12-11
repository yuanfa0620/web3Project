import { useCallback, useEffect } from 'react'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { getMessage } from '@/utils/message'
import { getErrorMessage } from '@/utils/error'
import type { SetWhitelistManagerParams } from '../index'
import NFTMarketPlace_ABI from '../../abi/NFTMarketPlace.json'

interface UseSetWhitelistManagerParams {
  marketplaceAddress: string
  chainId: number
  onSuccess?: (hash: string) => void
  onError?: (error: string) => void
}

export const useSetWhitelistManager = ({ marketplaceAddress, chainId, onSuccess, onError }: UseSetWhitelistManagerParams) => {
  const {
    data: hash,
    isPending: isWriting,
    error: writeError,
    writeContract,
  } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const setWhitelistManager = useCallback(
    (params: SetWhitelistManagerParams) => {
      writeContract({
        address: marketplaceAddress as `0x${string}`,
        abi: NFTMarketPlace_ABI,
        functionName: 'setWhitelistManager',
        args: [params.whitelistManager],
        chainId: chainId as any,
      })
    },
    [marketplaceAddress, chainId, writeContract]
  )

  useEffect(() => {
    if (isConfirmed && hash) {
      getMessage().success('设置白名单管理器成功')
      onSuccess?.(hash)
    }
  }, [isConfirmed, hash, onSuccess])

  useEffect(() => {
    if (writeError) {
      const errorMsg = getErrorMessage(writeError) || '设置白名单管理器失败'
      getMessage().error(errorMsg)
      onError?.(errorMsg)
    }
  }, [writeError, onError])

  return {
    setWhitelistManager,
    loading: isWriting || isConfirming,
    hash,
    isConfirmed,
  }
}

