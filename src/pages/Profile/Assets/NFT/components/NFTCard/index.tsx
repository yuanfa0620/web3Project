/**
 * NFT卡片组件（用于个人资产页面）
 */
import React from 'react'
import { Card, Tag, Typography, Button, Avatar } from 'antd'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { CHAIN_INFO } from '@/config/network'
import { getChainIconUrl } from '@/utils/chainIcons'
import type { UserNFT } from '../../../../types'
import styles from './index.module.less'

const { Text, Paragraph } = Typography

interface NFTCardProps {
  nft: UserNFT
}

const NFTCard: React.FC<NFTCardProps> = ({ nft }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const chainInfo = CHAIN_INFO[nft.chainId as keyof typeof CHAIN_INFO]
  const chainIcon = getChainIconUrl(nft.chainId)

  const handleViewDetail = () => {
    navigate(`/profile/nft/${nft.id}`)
  }

  return (
    <Card
      className={styles.nftCard}
      hoverable
      cover={
        <div className={styles.nftImageContainer}>
          <img
            src={nft.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4='}
            alt={nft.name}
            className={styles.nftImage}
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4='
            }}
          />
        </div>
      }
    >
      <div className={styles.nftInfo}>
        <div className={styles.nftHeader}>
          <Text strong className={styles.nftName} ellipsis={{ tooltip: nft.name }}>
            {nft.name}
          </Text>
          <Tag 
            className={styles.chainTag}
            icon={chainIcon ? <Avatar src={chainIcon} size={14} /> : undefined}
          >
            {chainInfo?.name || nft.chainId}
          </Tag>
        </div>

        {nft.collectionName && (
          <Text type="secondary" className={styles.collectionName} ellipsis={{ tooltip: nft.collectionName }}>
            {nft.collectionName}
          </Text>
        )}

        {nft.description && (
          <Paragraph 
            className={styles.nftDescription}
            ellipsis={{ rows: 2, tooltip: nft.description }}
            type="secondary"
          >
            {nft.description}
          </Paragraph>
        )}

        <div className={styles.nftFooter}>
          <div className={styles.tokenId}>
            <Text type="secondary" className={styles.tokenIdLabel}>
              {t('profile.tokenId')}:
            </Text>
            <Text className={styles.tokenIdValue}>{nft.tokenId}</Text>
          </div>
          <Button 
            type="primary" 
            size="small" 
            onClick={handleViewDetail}
            className={styles.viewButton}
          >
            {t('profile.viewDetail')}
          </Button>
        </div>

        {nft.attributes && nft.attributes.length > 0 && (
          <div className={styles.nftAttributes}>
            {nft.attributes.slice(0, 2).map((attr, idx) => (
              <div key={idx} className={styles.attribute}>
                <Text type="secondary" className={styles.attributeLabel}>
                  {attr.trait_type}:
                </Text>
                <Text className={styles.attributeValue}>{attr.value}</Text>
              </div>
            ))}
            {nft.attributes.length > 2 && (
              <Text type="secondary" className={styles.moreAttributes}>
                +{nft.attributes.length - 2} 更多
              </Text>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}

export default NFTCard

