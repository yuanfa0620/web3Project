import { useState, useCallback, useEffect } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { message } from 'antd'
import { createERC721Service } from '@/contracts/erc721'
import type { DepositNFTParams } from '../index'
import NFTMarketPlace_ABI from '../../abi/NFTMarketPlace.json'
import ERC721_ABI from '../../abi/ERC721.json'

interface UseDepositNFTParams {
  marketplaceAddress: string
  chainId: number
  onSuccess?: (hash: string) => void
  onError?: (error: string) => void
}

export const useDepositNFT = ({ marketplaceAddress, chainId, onSuccess, onError }: UseDepositNFTParams) => {
  const { address } = useAccount()
  const [loading, setLoading] = useState(false)
  const [approving, setApproving] = useState(false)
  const [pendingParams, setPendingParams] = useState<DepositNFTParams | null>(null)

  // ERC721 授权
  const {
    data: approveHash,
    isPending: isApproving,
    error: approveError,
    writeContract: writeApproveContract,
  } = useWriteContract()

  // 存入 NFT
  const {
    data: depositHash,
    isPending: isDepositing,
    error: depositError,
    writeContract: writeDepositContract,
  } = useWriteContract()

  // 等待授权交易确认
  const { isLoading: isApprovingConfirming, isSuccess: isApproveConfirmed } = useWaitForTransactionReceipt({
    hash: approveHash,
  })

  // 等待存入交易确认
  const { isLoading: isDepositConfirming, isSuccess: isDepositConfirmed } = useWaitForTransactionReceipt({
    hash: depositHash,
  })

  // 执行存入操作
  const executeDeposit = useCallback(
    (params: DepositNFTParams) => {
      const price = typeof params.price === 'string' ? BigInt(params.price) : params.price
      const tokenIdBigInt = typeof params.tokenId === 'string' ? BigInt(params.tokenId) : params.tokenId

      writeDepositContract({
        address: marketplaceAddress as `0x${string}`,
        abi: NFTMarketPlace_ABI,
        functionName: 'depositNFT',
        args: [params.nftContract, tokenIdBigInt, price],
        chainId: chainId as any,
      })
    },
    [marketplaceAddress, chainId, writeDepositContract]
  )

  // 检查授权状态并存入 NFT
  const depositNFT = useCallback(
    async (params: DepositNFTParams) => {
      if (!address) {
        const errorMsg = '请先连接钱包'
        message.error(errorMsg)
        onError?.(errorMsg)
        return
      }

      setLoading(true)

      try {
        // 1. 检查单个 NFT 的授权状态
        const erc721Service = createERC721Service(params.nftContract, chainId)
        const tokenId = typeof params.tokenId === 'string' ? params.tokenId : params.tokenId.toString()

        // 检查单个 token 授权
        const approvedResult = await erc721Service.getApproved(tokenId)
        
        if (approvedResult.success && approvedResult.data === marketplaceAddress) {
          // 已授权，直接存入
          executeDeposit(params)
        } else {
          // 需要授权，先保存 params，然后进行单个 NFT 授权
          setPendingParams(params)
          setApproving(true)
          message.info('需要授权 NFT，请确认交易')
          
          const tokenIdBigInt = typeof params.tokenId === 'string' ? BigInt(params.tokenId) : params.tokenId
          
          writeApproveContract({
            address: params.nftContract as `0x${string}`,
            abi: ERC721_ABI,
            functionName: 'approve',
            args: [marketplaceAddress, tokenIdBigInt],
            chainId: chainId as any,
          })
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : '检查授权状态失败'
        message.error(errorMsg)
        onError?.(errorMsg)
        setLoading(false)
        setApproving(false)
        setPendingParams(null)
      }
    },
    [address, marketplaceAddress, chainId, executeDeposit, writeApproveContract, onError]
  )

  // 授权成功后自动存入
  useEffect(() => {
    if (isApproveConfirmed && approveHash && pendingParams) {
      setApproving(false)
      message.success('授权成功，正在存入 NFT...')
      executeDeposit(pendingParams)
      setPendingParams(null)
    }
  }, [isApproveConfirmed, approveHash, pendingParams, executeDeposit])

  // 存入成功后处理
  useEffect(() => {
    if (isDepositConfirmed && depositHash) {
      setLoading(false)
      message.success('NFT 存入成功')
      onSuccess?.(depositHash)
    }
  }, [isDepositConfirmed, depositHash, onSuccess])

  // 错误处理
  useEffect(() => {
    if (approveError) {
      const errorMsg = approveError.message || '授权失败'
      message.error(errorMsg)
      onError?.(errorMsg)
      setLoading(false)
      setApproving(false)
      setPendingParams(null)
    }
    if (depositError) {
      const errorMsg = depositError.message || '存入 NFT 失败'
      message.error(errorMsg)
      onError?.(errorMsg)
      setLoading(false)
    }
  }, [approveError, depositError, onError])

  return {
    depositNFT,
    loading: loading || isApproving || isApprovingConfirming || isDepositing || isDepositConfirming,
    approving: approving || isApproving || isApprovingConfirming,
    depositing: isDepositing || isDepositConfirming,
    approveHash,
    depositHash,
    isApproveConfirmed,
    isDepositConfirmed,
  }
}

