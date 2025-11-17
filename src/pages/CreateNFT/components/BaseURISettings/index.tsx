/**
 * Base URI 设置组件
 */
import React from 'react'
import { Form, Input, Divider, Typography } from 'antd'
import { useTranslation } from 'react-i18next'

const { Text } = Typography

interface BaseURISettingsProps {
  nftImageHashes: string[]
}

export const BaseURISettings: React.FC<BaseURISettingsProps> = ({ nftImageHashes }) => {
  const { t } = useTranslation()

  return (
    <>
      <Divider>{t('createNFT.baseURISettings')}</Divider>

      <Form.Item
        name="baseURI"
        label={t('createNFT.baseURI')}
        extra={t('createNFT.baseURIDescOptional')}
      >
        <Input placeholder={t('createNFT.baseURIPlaceholder')} />
      </Form.Item>

      {nftImageHashes.length > 0 && (
        <Form.Item>
          <Text type="secondary">{t('createNFT.baseURIAutoGenerateHint')}</Text>
        </Form.Item>
      )}
    </>
  )
}

