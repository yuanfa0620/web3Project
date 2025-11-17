/**
 * NFT市场页面
 */
import React, { useState, useMemo } from 'react'
import { Card, Typography, Input, Select, Row, Col, Button, Tag, Space } from 'antd'
import { SearchOutlined, ShoppingCartOutlined, FireOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { PageTitle } from '@/components/PageTitle'
import { AnimatedNumber } from '@/components/AnimatedNumber'
import NFTCard from '@/components/NFTCard'
import nftMarketplaceData from 'mock/nftMarketplace.json'
import styles from './index.module.less'

const { Title } = Typography
const { Search } = Input
const { Option } = Select

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
  const [selectedRarity, setSelectedRarity] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('price-low')

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

    // 稀有度筛选
    if (selectedRarity !== 'all') {
      filtered = filtered.filter((nft) => nft.rarity === selectedRarity)
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
  }, [searchText, selectedCollection, selectedRarity, sortBy])

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
        <Card className={styles.filterCard}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={6}>
              <div className={styles.filterItem}>
                <span className={styles.filterLabel}>{t('nftMarketplace.collection')}:</span>
                <Select
                  value={selectedCollection}
                  onChange={setSelectedCollection}
                  className={styles.filterSelect}
                  style={{ width: '100%' }}
                >
                  <Option value="all">{t('nftMarketplace.allCollections')}</Option>
                  {collections.map((collection) => (
                    <Option key={collection} value={collection}>
                      {collection}
                    </Option>
                  ))}
                </Select>
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div className={styles.filterItem}>
                <span className={styles.filterLabel}>{t('nftMarketplace.rarity')}:</span>
                <Select
                  value={selectedRarity}
                  onChange={setSelectedRarity}
                  className={styles.filterSelect}
                  style={{ width: '100%' }}
                >
                  <Option value="all">{t('nftMarketplace.allRarities')}</Option>
                  <Option value="Legendary">{t('nftMarketplace.legendary')}</Option>
                  <Option value="Epic">{t('nftMarketplace.epic')}</Option>
                  <Option value="Rare">{t('nftMarketplace.rare')}</Option>
                  <Option value="Common">{t('nftMarketplace.common')}</Option>
                </Select>
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div className={styles.filterItem}>
                <span className={styles.filterLabel}>{t('nftMarketplace.sortBy')}:</span>
                <Select
                  value={sortBy}
                  onChange={setSortBy}
                  className={styles.filterSelect}
                  style={{ width: '100%' }}
                >
                  <Option value="price-low">{t('nftMarketplace.priceLowToHigh')}</Option>
                  <Option value="price-high">{t('nftMarketplace.priceHighToLow')}</Option>
                  <Option value="volume-high">{t('nftMarketplace.volumeHighToLow')}</Option>
                  <Option value="name">{t('nftMarketplace.name')}</Option>
                </Select>
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Button
                type="default"
                onClick={() => {
                  setSearchText('')
                  setSelectedCollection('all')
                  setSelectedRarity('all')
                  setSortBy('price-low')
                }}
              >
                {t('nftMarketplace.reset')}
              </Button>
            </Col>
          </Row>
        </Card>

        {/* NFT列表 */}
        <div className={styles.nftGrid}>
          {filteredNFTs.length === 0 ? (
            <Card className={styles.emptyCard}>
              <div className={styles.emptyContent}>
                <p>{t('nftMarketplace.noResults')}</p>
              </div>
            </Card>
          ) : (
            <Row gutter={[16, 16]}>
              {filteredNFTs.map((nft) => (
                <Col xs={12} sm={8} md={6} lg={4} xl={4} key={nft.id}>
                  <Card
                    className={styles.nftMarketCard}
                    hoverable
                    cover={
                      <div className={styles.nftImageContainer}>
                        <img src={nft.image} alt={nft.name} className={styles.nftImage} />
                        <Tag
                          color={getRarityColor(nft.rarity)}
                          className={styles.rarityTag}
                        >
                          {nft.rarity}
                        </Tag>
                      </div>
                    }
                    actions={[
                      <div key="price" className={styles.priceAction}>
                        <div className={styles.priceLabel}>{t('nftMarketplace.price')}</div>
                        <div className={styles.priceValue}>
                          <AnimatedNumber
                            value={nft.price}
                            decimals={2}
                            enableAnimation={true}
                          />
                          <span className={styles.priceUnit}> {nft.priceUnit}</span>
                        </div>
                      </div>,
                      <Button
                        key="buy"
                        type="primary"
                        icon={<ShoppingCartOutlined />}
                        className={styles.buyButton}
                        onClick={() => {
                          // TODO: 实现购买逻辑
                          console.log('Buy NFT:', nft.id)
                        }}
                      >
                        {t('nftMarketplace.buy')}
                      </Button>,
                    ]}
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
                          <span>{t('nftMarketplace.lastSale')}: {nft.lastSale}</span>
                        </div>
                      </Space>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </div>
      </div>
    </PageTitle>
  )
}

export default NFTMarketplacePage

