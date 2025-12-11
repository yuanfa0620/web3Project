/**
 * CreateNFT 页面合约部署逻辑 Hook
 */
import { useCallback } from 'react'
import { getMessage } from '@/utils/message'
import { getErrorMessage } from '@/utils/error'
import { useTranslation } from 'react-i18next'
import { useAccount, useSwitchChain } from 'wagmi'
import { uploadJSONToIPFS, createOpenSeaMetadata } from '@/utils/ipfs'
import { deployERC721 } from '@/contracts/erc721/deploy'
import type { NFTFormData, DeployedContract } from '../types'
import type { FormInstance } from 'antd'

interface UseCreateNFTDeployProps {
  form: FormInstance<NFTFormData>
  nftImageHashes: string[]
  setDeploying: (deploying: boolean) => void
  setDeployProgress: (progress: number) => void
  setDeployedContract: (contract: DeployedContract) => void
  setCurrentStep: (step: number) => void
}

export const useCreateNFTDeploy = ({
  form,
  nftImageHashes,
  setDeploying,
  setDeployProgress,
  setDeployedContract,
  setCurrentStep,
}: UseCreateNFTDeployProps) => {
  const { t } = useTranslation()
  const { address, chainId, isConnected } = useAccount()
  const { switchChain } = useSwitchChain()

  // 部署合约
  const handleDeploy = useCallback(async () => {
    if (!isConnected || !address) {
      getMessage().error(t('createNFT.connectWalletFirst'))
      return
    }

    try {
      const values = await form.validateFields()
      const { name, symbol, totalSupply, royaltyFee, chainId: selectedChainId } = values

      // 切换到目标网络
      if (chainId !== selectedChainId) {
        await switchChain({ chainId: selectedChainId })
        // 等待网络切换
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }

      setDeploying(true)
      setDeployProgress(10)

      // 获取baseURI（从表单或上传的NFT图片生成）
      let baseURI = values.baseURI || ''
      
      // 如果上传了NFT图片但没有填写baseURI，则自动生成
      if (nftImageHashes.length > 0 && !baseURI) {
        setDeployProgress(30)
        // 为每个NFT创建元数据
        const metadataPromises = nftImageHashes.map((hash: string, index: number) => {
          const metadata = createOpenSeaMetadata(
            `${name} #${index + 1}`,
            values.description || '',
            hash
          )
          return uploadJSONToIPFS(metadata)
        })

        const metadataHashes = await Promise.all(metadataPromises)
        setDeployProgress(60)

        // 创建baseURI（使用第一个元数据的目录）
        // 注意：这里简化处理，实际应该上传一个包含所有元数据的目录结构
        baseURI = `ipfs://${metadataHashes[0].split('/').slice(0, -1).join('/')}/`
      }

      setDeployProgress(70)

      // 部署合约
      const result = await deployERC721({
        name,
        symbol,
        baseURI: baseURI || '',
        royaltyRecipient: address,
        royaltyFee: royaltyFee || 0,
        owner: address,
      })

      setDeployProgress(100)
      setDeployedContract({
        address: result.contractAddress,
        txHash: result.transactionHash,
      })

      getMessage().success(t('createNFT.deploySuccess'))
      setCurrentStep(2)
    } catch (error: any) {
      console.error('部署失败:', error)
      getMessage().error(getErrorMessage(error) || t('createNFT.deployFailed'))
      setDeployProgress(0)
    } finally {
      setDeploying(false)
    }
  }, [
    isConnected,
    address,
    chainId,
    form,
    nftImageHashes,
    switchChain,
    setDeploying,
    setDeployProgress,
    setDeployedContract,
    setCurrentStep,
    t,
  ])

  return {
    handleDeploy,
  }
}

