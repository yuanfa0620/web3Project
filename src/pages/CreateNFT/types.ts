/**
 * CreateNFT 页面类型定义
 */
import type { UploadFile } from 'antd'

export interface NFTFormData {
  name: string
  symbol: string
  description?: string
  totalSupply: number
  royaltyFee: number
  chainId: number
  baseURI?: string
}

export interface DeployedContract {
  address: string
  txHash: string
}

export interface CreateNFTState {
  currentStep: number
  collectionImage: UploadFile | null
  nftImageList: UploadFile[]
  uploading: boolean
  deploying: boolean
  uploadProgress: number
  deployProgress: number
  collectionImageHash: string
  nftImageHashes: string[]
  deployedContract: DeployedContract | null
}

