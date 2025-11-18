import React from 'react'
import { Card, Tag, Space, Button, Typography } from 'antd'
import { FireOutlined, ShoppingCartOutlined, HeartOutlined, HeartFilled } from '@ant-design/icons'
import type { TFunction } from 'i18next'
import { AnimatedNumber } from '@/components/AnimatedNumber'
import type { NFTMarketplaceItem } from '../../index'
import styles from './index.module.less'

const { Title } = Typography

interface NFTCardItemProps {
  nft: NFTMarketplaceItem
  isFavorite: boolean
  onToggleFavorite: (id: string) => void
  onBuy: (nft: NFTMarketplaceItem) => void
  getRarityColor: (rarity: string) => string
  t: TFunction
}

export const NFTCardItem: React.FC<NFTCardItemProps> = ({
  nft,
  isFavorite,
  onToggleFavorite,
  onBuy,
  getRarityColor,
  t,
}) => {
  return (
    <Card
      className={styles.nftMarketCard}
      hoverable
      cover={
        <div className={styles.nftImageContainer}>
          <img src={nft.image} alt={nft.name} className={styles.nftImage} />
          <Tag color={getRarityColor(nft.rarity)} className={styles.rarityTag}>
            {nft.rarity}
          </Tag>
        </div>
      }
    >
      <div className={styles.nftInfo}>
        <Title level={5} className={styles.nftName} ellipsis>
          {nft.name}
        </Title>
        <div className={styles.collectionName}>{nft.collection}</div>
        <Space className={styles.nftStats} size="small">
          <div className={styles.statItem}>
            <FireOutlined />
            <span>{nft.volume}</span>
          </div>
          <div className={styles.statItem}>
            <span>
              {t('nftMarketplace.lastSale')}: {nft.lastSale}
            </span>
          </div>
        </Space>
      </div>
      <div className={styles.cardFooter}>
        <div className={styles.priceRow}>
          <span className={styles.priceLabel}>{t('nftMarketplace.price')}</span>
          <div className={styles.priceValue}>
            <AnimatedNumber value={nft.price} decimals={2} enableAnimation />
            <span className={styles.priceUnit}> {nft.priceUnit}</span>
          </div>
        </div>
        <div className={styles.actionButtons}>
          <Button
            type="default"
            className={styles.favoriteButton}
            icon={isFavorite ? <HeartFilled /> : <HeartOutlined />}
            onClick={() => onToggleFavorite(nft.id)}
          >
            {t('nftMarketplace.favorite')}
          </Button>
          <Button
            type="primary"
            className={styles.buyButton}
            icon={<ShoppingCartOutlined />}
            onClick={() => onBuy(nft)}
          >
            {t('nftMarketplace.buy')}
          </Button>
        </div>
      </div>
    </Card>
  )
}

