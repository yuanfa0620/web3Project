/**
 * CreateNFT 页面状态管理 Hook
 */
import { useState, useMemo } from 'react'
import { useAccount } from 'wagmi'
import { supportedChains, CHAIN_INFO } from '@/config/network'
import type { UploadFile } from 'antd'
import type { DeployedContract } from '../types'

export const useCreateNFTState = () => {
  const { chainId } = useAccount()
  const [currentStep, setCurrentStep] = useState(0)
  const [collectionImage, setCollectionImage] = useState<UploadFile | null>(null)
  const [nftImageList, setNftImageList] = useState<UploadFile[]>([])
  const [uploading, setUploading] = useState(false)
  const [deploying, setDeploying] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [deployProgress, setDeployProgress] = useState(0)
  const [collectionImageHash, setCollectionImageHash] = useState<string>('')
  const [nftImageHashes, setNftImageHashes] = useState<string[]>([])
  const [deployedContract, setDeployedContract] = useState<DeployedContract | null>(null)

  // 支持的链选项
  const chainOptions = useMemo(() => {
    return supportedChains.map((chain) => ({
      value: chain.id,
      label: CHAIN_INFO[chain.id as keyof typeof CHAIN_INFO]?.name || chain.name,
    }))
  }, [])

  // 重置所有状态
  const resetState = () => {
    setCurrentStep(0)
    setCollectionImage(null)
    setNftImageList([])
    setUploading(false)
    setDeploying(false)
    setUploadProgress(0)
    setDeployProgress(0)
    setCollectionImageHash('')
    setNftImageHashes([])
    setDeployedContract(null)
  }

  return {
    // 状态
    currentStep,
    collectionImage,
    nftImageList,
    uploading,
    deploying,
    uploadProgress,
    deployProgress,
    collectionImageHash,
    nftImageHashes,
    deployedContract,
    chainOptions,
    defaultChainId: chainId || supportedChains[0].id,

    // 状态更新函数
    setCurrentStep,
    setCollectionImage,
    setNftImageList,
    setUploading,
    setDeploying,
    setUploadProgress,
    setDeployProgress,
    setCollectionImageHash,
    setNftImageHashes,
    setDeployedContract,
    resetState,
  }
}

