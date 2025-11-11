import React from 'react'
import { Card, Spin, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import styles from './index.module.less'

const { Text } = Typography

export interface NFTData {
  index: number
  image?: string
  name?: string
  description?: string
  attributes?: Array<{
    trait_type: string
    value: string | number
  }>
  [key: string]: any
}

interface NFTCardProps {
  nft: NFTData
  loading?: boolean
}

const NFTCard: React.FC<NFTCardProps> = ({ nft, loading = false }) => {
  const { t } = useTranslation()

  if (loading) {
    return (
      <Card className={styles.nftCard} loading={true}>
        <div className={styles.nftImageContainer}>
          <Spin size="large" />
        </div>
      </Card>
    )
  }

  // 使用从元数据中获取的image字段，如果没有则使用备用方案
  const imageUrl = nft.image || `https://ipfs.io/ipfs/QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/${nft.index}.png`
  const name = nft.name || `NFT #${nft.index}`
  const description = nft.description || ''

  return (
    <Card
      className={styles.nftCard}
      hoverable
      cover={
        <div className={styles.nftImageContainer}>
          <img
            src={imageUrl}
            alt={name}
            className={styles.nftImage}
            onError={(e) => {
              // 如果图片加载失败，显示占位符
              const target = e.target as HTMLImageElement
              target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4='
            }}
          />
        </div>
      }
    >
      <div className={styles.nftInfo}>
        <Text strong className={styles.nftName}>
          {name}
        </Text>
        {description && (
          <Text type="secondary" className={styles.nftDescription} ellipsis>
            {description}
          </Text>
        )}
        {nft.attributes && nft.attributes.length > 0 && (
          <div className={styles.nftAttributes}>
            {nft.attributes.slice(0, 3).map((attr, idx) => (
              <div key={idx} className={styles.attribute}>
                <Text type="secondary" className={styles.attributeLabel}>
                  {attr.trait_type}:
                </Text>
                <Text className={styles.attributeValue}>{attr.value}</Text>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}

export default NFTCard

