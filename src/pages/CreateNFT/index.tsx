/**
 * 创建NFT页面
 */
import React, { useMemo } from 'react'
import { Card, Form, Steps, Typography } from 'antd'
import { CheckCircleOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { PageTitle } from '@/components/PageTitle'
import { supportedChains } from '@/constants/chains'
import { useCreateNFTState } from './hooks/useCreateNFTState'
import { useCreateNFTUpload } from './hooks/useCreateNFTUpload'
import { useCreateNFTDeploy } from './hooks/useCreateNFTDeploy'
import {
  BasicInfoForm,
  CollectionImageUpload,
  NFTImagesUpload,
  BaseURISettings,
  DeployProgress,
  DeploySuccess,
} from './components'
import type { UploadFile, UploadProps } from 'antd'
import type { NFTFormData } from './types'
import styles from './index.module.less'

const { Title, Text } = Typography

const CreateNFTPage: React.FC = () => {
  const { t } = useTranslation()
  const { isConnected } = useAccount()
  const [form] = Form.useForm<NFTFormData>()

  // 状态管理
  const {
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
    defaultChainId,
    setCurrentStep,
    setCollectionImage,
    setNftImageList,
    resetState,
    setUploading,
    setUploadProgress,
    setCollectionImageHash,
    setNftImageHashes,
    setDeploying,
    setDeployProgress,
    setDeployedContract,
  } = useCreateNFTState()

  // 上传逻辑
  const { handleUploadCollectionImage, handleUploadNftImages } = useCreateNFTUpload({
    collectionImage,
    nftImageList,
    setUploading,
    setUploadProgress,
    setCollectionImageHash,
    setNftImageHashes,
    setCurrentStep,
  })

  // 部署逻辑
  const { handleDeploy } = useCreateNFTDeploy({
    form,
    nftImageHashes,
    setDeploying,
    setDeployProgress,
    setDeployedContract,
    setCurrentStep,
  })

  // 合集封面图上传处理
  const handleCollectionImageChange: UploadProps['onChange'] = (info) => {
    if (info.fileList.length > 0) {
      setCollectionImage(info.fileList[0])
    } else {
      setCollectionImage(null)
    }
  }

  // NFT图片上传处理
  const handleNftImageChange: UploadProps['onChange'] = (info) => {
    setNftImageList(info.fileList)
  }

  // 移除合集封面图
  const handleRemoveCollectionImage = () => {
    setCollectionImage(null)
    return true
  }

  // 移除NFT图片
  const handleRemoveNftImage = (file: UploadFile) => {
    const newFileList = nftImageList.filter((item) => item.uid !== file.uid)
    setNftImageList(newFileList)
    return true
  }

  // 重置表单
  const handleReset = () => {
    form.resetFields()
    resetState()
  }

  // 步骤配置
  const steps = useMemo(
    () => [
      {
        title: t('createNFT.step1'),
        description: t('createNFT.step1Desc'),
      },
      {
        title: t('createNFT.step2'),
        description: t('createNFT.step2Desc'),
      },
      {
        title: t('createNFT.step3'),
        description: t('createNFT.step3Desc'),
      },
    ],
    [t]
  )

  return (
    <PageTitle title={t('pageTitle.createNFT')}>
      <div className={styles.createNFTPage}>
        <div className={styles.pageHeader}>
          <Title level={2} className={styles.pageTitle}>
            {t('createNFT.title')}
          </Title>
        </div>

        {!isConnected ? (
          <Card className={styles.connectCard}>
            <div className={styles.connectContent}>
              <Text>{t('createNFT.connectWalletFirst')}</Text>
              <ConnectButton />
            </div>
          </Card>
        ) : (
          <Card className={styles.formCard}>
            <Steps current={currentStep} items={steps} className={styles.steps} />

            <Form
              form={form}
              layout="vertical"
              initialValues={{
                chainId: defaultChainId,
                royaltyFee: 5,
                totalSupply: 1,
              }}
              className={styles.form}
            >
              {/* 步骤1: 基本信息 */}
              {currentStep === 0 && (
                <>
                  <BasicInfoForm
                    form={form}
                    chainOptions={chainOptions}
                    defaultChainId={defaultChainId}
                  />
                  <CollectionImageUpload
                    collectionImage={collectionImage}
                    uploading={uploading}
                    uploadProgress={uploadProgress}
                    onImageChange={handleCollectionImageChange}
                    onRemove={handleRemoveCollectionImage}
                    onUpload={handleUploadCollectionImage}
                  />
                </>
              )}

              {/* 步骤2: 上传NFT图片和设置Base URI */}
              {currentStep === 1 && (
                <>
                  {collectionImageHash && (
                    <div className={styles.step2Content}>
                      <CheckCircleOutlined className={styles.successIcon} />
                      <Title level={4}>{t('createNFT.collectionImageUploaded')}</Title>
                    </div>
                  )}

                  <NFTImagesUpload
                    nftImageList={nftImageList}
                    uploading={uploading}
                    uploadProgress={uploadProgress}
                    nftImageHashes={nftImageHashes}
                    onImageChange={handleNftImageChange}
                    onRemove={handleRemoveNftImage}
                    onUpload={handleUploadNftImages}
                  />

                  <BaseURISettings nftImageHashes={nftImageHashes} />

                  <Form.Item>
                    <DeployProgress
                      deploying={deploying}
                      deployProgress={deployProgress}
                      onBack={() => setCurrentStep(0)}
                      onDeploy={handleDeploy}
                    />
                  </Form.Item>
                </>
              )}

              {/* 步骤3: 部署成功 */}
              {currentStep === 2 && deployedContract && (
                <DeploySuccess
                  deployedContract={deployedContract}
                  onReset={handleReset}
                  onViewContract={(address) => {
                    // TODO: 跳转到合约详情页面
                    console.log('View contract:', address)
                  }}
                />
              )}
            </Form>
          </Card>
        )}
      </div>
    </PageTitle>
  )
}

export default CreateNFTPage
