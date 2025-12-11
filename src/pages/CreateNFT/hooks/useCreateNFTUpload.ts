/**
 * CreateNFT 页面图片上传逻辑 Hook
 */
import { useCallback } from 'react'
import { getMessage } from '@/utils/message'
import { getErrorMessage } from '@/utils/error'
import { useTranslation } from 'react-i18next'
import { uploadFileToIPFS, uploadFilesToIPFS } from '@/utils/ipfs'
import type { UploadFile } from 'antd'

interface UseCreateNFTUploadProps {
  collectionImage: UploadFile | null
  nftImageList: UploadFile[]
  setUploading: (uploading: boolean) => void
  setUploadProgress: (progress: number) => void
  setCollectionImageHash: (hash: string) => void
  setNftImageHashes: (hashes: string[]) => void
  setCurrentStep: (step: number) => void
}

export const useCreateNFTUpload = ({
  collectionImage,
  nftImageList,
  setUploading,
  setUploadProgress,
  setCollectionImageHash,
  setNftImageHashes,
  setCurrentStep,
}: UseCreateNFTUploadProps) => {
  const { t } = useTranslation()

  // 上传合集封面图到IPFS
  const handleUploadCollectionImage = useCallback(async () => {
    if (!collectionImage?.originFileObj) {
      getMessage().warning(t('createNFT.uploadCollectionImageFirst'))
      return
    }

    setUploading(true)
    setUploadProgress(0)

    try {
      setUploadProgress(50)
      console.log(collectionImage.originFileObj,'====')
      const collectionHash = await uploadFileToIPFS(collectionImage.originFileObj as File)
      setCollectionImageHash(collectionHash)
      setUploadProgress(100)
      getMessage().success(t('createNFT.collectionImageUploadSuccess'))
      setCurrentStep(1)
    } catch (error: any) {
      console.error('上传失败:', error)
      getMessage().error(getErrorMessage(error) || t('createNFT.uploadFailed'))
      setUploadProgress(0)
    } finally {
      setUploading(false)
    }
  }, [collectionImage, setUploading, setUploadProgress, setCollectionImageHash, setCurrentStep, t])

  // 上传NFT图片到IPFS（在第二步）
  const handleUploadNftImages = useCallback(async () => {
    if (nftImageList.length === 0) {
      getMessage().warning(t('createNFT.uploadNftImagesFirst'))
      return
    }

    setUploading(true)
    setUploadProgress(0)

    try {
      const nftFiles = nftImageList
        .map((file) => file.originFileObj as File | undefined)
        .filter((file): file is File => file !== undefined && file instanceof File)

      if (nftFiles.length === 0) {
        throw new Error(t('createNFT.noValidFiles'))
      }

      setUploadProgress(30)
      const hashes = await uploadFilesToIPFS(nftFiles)
      setNftImageHashes(hashes)
      setUploadProgress(100)
      getMessage().success(t('createNFT.nftImagesUploadSuccess', { count: hashes.length }))
    } catch (error: any) {
      console.error('上传失败:', error)
      getMessage().error(getErrorMessage(error) || t('createNFT.uploadFailed'))
      setUploadProgress(0)
    } finally {
      setUploading(false)
    }
  }, [nftImageList, setUploading, setUploadProgress, setNftImageHashes, t])

  return {
    handleUploadCollectionImage,
    handleUploadNftImages,
  }
}

