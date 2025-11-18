/**
 * NFT市场页面
 */
import React, { useState, useMemo } from 'react'
import { Card, Typography, Input, Row, Col } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { PageTitle } from '@/components/PageTitle'
import nftMarketplaceData from 'mock/nftMarketplace.json'
import { FilterBar } from './components/FilterBar'
import { NFTCardItem } from './components/NFTCardItem'
import { PurchaseModal } from './components/PurchaseModal'
import styles from './index.module.less'

const { Title } = Typography
const { Search } = Input

export interface NFTMarketplaceItem {
  id: string
  name: string
  collection: string
  image: string
  price: string
  priceUnit: string
  owner: string
  rarity: string
  attributes: Array<{
    trait_type: string
    value: string
  }>
  lastSale: string
  volume: string
  listed: boolean
}

const NFTMarketplacePage: React.FC = () => {
  const { t } = useTranslation()
  const [searchText, setSearchText] = useState('')
  const [selectedCollection, setSelectedCollection] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('price-low')
  const [favoriteNFTs, setFavoriteNFTs] = useState<string[]>([])
  const [selectedNFT, setSelectedNFT] = useState<NFTMarketplaceItem | null>(null)

  // 获取所有收藏
  const collections = useMemo(() => {
    const uniqueCollections = new Set<string>()
    nftMarketplaceData.forEach((item: any) => {
      uniqueCollections.add(item.collection)
    })
    return Array.from(uniqueCollections)
  }, [])

  // 筛选和排序NFT
  const filteredNFTs = useMemo(() => {
    let filtered = [...nftMarketplaceData] as NFTMarketplaceItem[]

    // 搜索筛选
    if (searchText) {
      filtered = filtered.filter(
        (nft) =>
          nft.name.toLowerCase().includes(searchText.toLowerCase()) ||
          nft.collection.toLowerCase().includes(searchText.toLowerCase())
      )
    }

    // 收藏筛选
    if (selectedCollection !== 'all') {
      filtered = filtered.filter((nft) => nft.collection === selectedCollection)
    }

    // 排序
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return parseFloat(a.price) - parseFloat(b.price)
        case 'price-high':
          return parseFloat(b.price) - parseFloat(a.price)
        case 'volume-high':
          return parseFloat(b.volume.replace(' ETH', '')) - parseFloat(a.volume.replace(' ETH', ''))
        case 'name':
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

    return filtered
  }, [searchText, selectedCollection, sortBy])

  // 获取稀有度颜色
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Legendary':
        return 'gold'
      case 'Epic':
        return 'purple'
      case 'Rare':
        return 'blue'
      case 'Common':
        return 'default'
      default:
        return 'default'
    }
  }

  return (
    <PageTitle title={t('pageTitle.nftMarketplace')}>
      <div className={styles.nftMarketplacePage}>
        <div className={styles.pageHeader}>
          <Title level={2} className={styles.pageTitle}>
            {t('nftMarketplace.title')}
          </Title>
          <Search
            placeholder={t('nftMarketplace.searchPlaceholder')}
            allowClear
            className={styles.searchInput}
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onSearch={setSearchText}
          />
        </div>

        {/* 筛选栏 */}
        <FilterBar
          t={t}
          collections={collections}
          selectedCollection={selectedCollection}
          onCollectionChange={setSelectedCollection}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onReset={() => {
            setSearchText('')
            setSelectedCollection('all')
            setSortBy('price-low')
          }}
        />

        {/* NFT列表 */}
        <div className={styles.nftGrid}>
          {filteredNFTs.length === 0 ? (
            <Card className={styles.emptyCard}>
              <div className={styles.emptyContent}>
                <p>{t('nftMarketplace.noResults')}</p>
              </div>
            </Card>
          ) : (
            <Row gutter={[16, 16]} className={styles.responsiveRow}>
              {filteredNFTs.map((nft) => (
                <Col xs={24} sm={12} md={8} lg={6} xl={4} xxl={4} key={nft.id}>
                  <NFTCardItem
                    nft={nft}
                    isFavorite={favoriteNFTs.includes(nft.id)}
                    onToggleFavorite={(id) =>
                      setFavoriteNFTs((prev) =>
                        prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
                      )
                    }
                    onBuy={setSelectedNFT}
                    getRarityColor={getRarityColor}
                    t={t}
                  />
                </Col>
              ))}
            </Row>
          )}
        </div>
        <PurchaseModal
          nft={selectedNFT}
          onCancel={() => setSelectedNFT(null)}
          t={t}
          getRarityColor={getRarityColor}
        />
      </div>
    </PageTitle>
  )
}

export default NFTMarketplacePage

