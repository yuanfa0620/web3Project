/**
 * NFT图片上传组件
 */
import React from 'react'
import { Form, Upload, Button, Space, Progress, Divider, Typography } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import type { UploadFile, UploadProps } from 'antd'

const { Text } = Typography

interface NFTImagesUploadProps {
  nftImageList: UploadFile[]
  uploading: boolean
  uploadProgress: number
  nftImageHashes: string[]
  onImageChange: UploadProps['onChange']
  onRemove: (file: UploadFile) => void
  onUpload: () => void
}

export const NFTImagesUpload: React.FC<NFTImagesUploadProps> = ({
  nftImageList,
  uploading,
  uploadProgress,
  nftImageHashes,
  onImageChange,
  onRemove,
  onUpload,
}) => {
  const { t } = useTranslation()

  return (
    <>
      <Divider>{t('createNFT.nftImages')}</Divider>

      <Form.Item
        label={t('createNFT.nftImagesLabel')}
        extra={t('createNFT.nftImagesDescOptional')}
      >
        <Upload
          listType="picture-card"
          fileList={nftImageList}
          onChange={onImageChange}
          onRemove={onRemove}
          beforeUpload={() => false}
          multiple
        >
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>{t('createNFT.upload')}</div>
          </div>
        </Upload>
      </Form.Item>

      {nftImageList.length > 0 && (
        <Form.Item>
          <Space>
            <Button type="default" onClick={onUpload} loading={uploading}>
              {uploading ? t('createNFT.uploading') : t('createNFT.uploadNftImagesToIPFS')}
            </Button>
            {uploading && <Progress percent={uploadProgress} style={{ width: 200 }} />}
          </Space>
          {nftImageHashes.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <Text type="success">
                {t('createNFT.nftImagesUploaded', { count: nftImageHashes.length })}
              </Text>
            </div>
          )}
        </Form.Item>
      )}
    </>
  )
}

