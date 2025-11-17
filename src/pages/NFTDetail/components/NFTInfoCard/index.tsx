/**
 * NFT信息卡片组件
 */
import React from 'react'
import { Card, Tag, Typography, Space, Button, Descriptions, Image } from 'antd'
import { useTranslation } from 'react-i18next'
import { AddressWithCopy } from '@/components/AddressWithCopy'
import { CHAIN_INFO } from '@/constants/chains'
import { openAddressInExplorer, openNFTInExplorer } from '@/utils/blockExplorer'
import type { UserNFT } from '@/pages/Profile/types'
import styles from './index.module.less'

const { Title, Text } = Typography

export interface NFTInfoCardProps {
  nft: UserNFT
  imageUrl: string
  onImageError: () => void
}

export const NFTInfoCard: React.FC<NFTInfoCardProps> = ({ nft, imageUrl, onImageError }) => {
  const { t } = useTranslation()

  return (
    <Card className={styles.nftInfoCard}>
      <div className={styles.nftHeader}>
        <Image
          src={imageUrl}
          alt={nft.name}
          className={styles.nftImage}
          preview={false}
          onError={onImageError}
        />
        <div className={styles.nftInfo}>
          <Title level={3}>{nft.name}</Title>
          <Text type="secondary">{nft.description}</Text>
          <Descriptions column={1} style={{ marginTop: 16 }}>
            <Descriptions.Item label={t('profile.collectionName')}>
              {nft.collectionName}
            </Descriptions.Item>
            <Descriptions.Item label={t('profile.tokenId')}>{nft.tokenId}</Descriptions.Item>
            <Descriptions.Item label={t('profile.network')}>
              <Tag>
                {CHAIN_INFO[nft.chainId as keyof typeof CHAIN_INFO]?.name || nft.chainId}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label={t('profile.contractAddress')}>
              <AddressWithCopy
                address={nft.contractAddress}
                onClick={() => openAddressInExplorer(nft.contractAddress, nft.chainId)}
              />
            </Descriptions.Item>
            <Descriptions.Item label={t('profile.owner')}>
              <AddressWithCopy
                address={nft.owner}
                onClick={() => openAddressInExplorer(nft.owner, nft.chainId)}
              />
            </Descriptions.Item>
            <Descriptions.Item label={t('profile.viewOnExplorer')}>
              <Button
                type="link"
                onClick={() => openNFTInExplorer(nft.contractAddress, nft.tokenId, nft.chainId)}
                style={{ padding: 0 }}
              >
                {t('profile.openInExplorer')}
              </Button>
            </Descriptions.Item>
          </Descriptions>
        </div>
      </div>

      {/* 属性 */}
      {nft.attributes && nft.attributes.length > 0 && (
        <div className={styles.attributes}>
          <Title level={4}>{t('profile.attributes')}</Title>
          <Space wrap>
            {nft.attributes.map((attr, index) => (
              <Tag key={index} color="blue">
                {attr.trait_type}: {attr.value}
              </Tag>
            ))}
          </Space>
        </div>
      )}
    </Card>
  )
}

