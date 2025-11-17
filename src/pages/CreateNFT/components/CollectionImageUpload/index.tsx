/**
 * 合集封面图上传组件
 */
import React from 'react'
import { Form, Upload, Button, Space, Progress, Divider } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import type { UploadFile, UploadProps } from 'antd'

interface CollectionImageUploadProps {
  collectionImage: UploadFile | null
  uploading: boolean
  uploadProgress: number
  onImageChange: UploadProps['onChange']
  onRemove: () => void
  onUpload: () => void
}

export const CollectionImageUpload: React.FC<CollectionImageUploadProps> = ({
  collectionImage,
  uploading,
  uploadProgress,
  onImageChange,
  onRemove,
  onUpload,
}) => {
  const { t } = useTranslation()

  return (
    <>
      <Divider>{t('createNFT.collectionImage')}</Divider>

      <Form.Item
        label={t('createNFT.collectionImageLabel')}
        extra={t('createNFT.collectionImageDesc')}
      >
        <Upload
          listType="picture-card"
          fileList={collectionImage ? [collectionImage] : []}
          onChange={onImageChange}
          onRemove={onRemove}
          beforeUpload={() => false}
          maxCount={1}
        >
          {!collectionImage && (
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>{t('createNFT.upload')}</div>
            </div>
          )}
        </Upload>
      </Form.Item>

      <Form.Item>
        <Space>
          <Button
            type="primary"
            onClick={onUpload}
            loading={uploading}
            disabled={!collectionImage}
          >
            {uploading ? t('createNFT.uploading') : t('createNFT.uploadCollectionImageToIPFS')}
          </Button>
          {uploading && <Progress percent={uploadProgress} style={{ width: 200 }} />}
        </Space>
      </Form.Item>
    </>
  )
}

