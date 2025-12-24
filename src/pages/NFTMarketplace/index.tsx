/**
 * NFT市场页面
 */
import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { Card, Typography, Input, Row, Col, Spin, Pagination, message } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useAccount } from 'wagmi'
import { PageTitle } from '@/components/PageTitle'
import { activeOrderApi, type ActiveOrder } from '@/graphql/modules/activeOrder'
import { alchemyNFTApi } from '@/api/modules/alchemy'
import type { AlchemyNFTMetadata } from '@/api/modules/alchemy/types'
import { formatAddress } from '@/utils/address'
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
  // 新增字段
  activeOrder: ActiveOrder
  nftContract: string
  tokenId: string
  chainId?: number
  metadata?: AlchemyNFTMetadata
}

interface NFTMarketplaceFilters {
  searchText: string
  nftContract: string
  tokenId: string
  depositor: string
  status: number | undefined
  sortBy: string
}

const NFTMarketplacePage: React.FC = () => {
  const { t } = useTranslation()
  const { chainId } = useAccount()
  
  // 状态管理
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState<NFTMarketplaceFilters>({
    searchText: '',
    nftContract: '',
    tokenId: '',
    depositor: '',
    status: undefined,
    sortBy: 'price-low',
  })
  const [activeOrders, setActiveOrders] = useState<ActiveOrder[]>([])
  const [nftItems, setNftItems] = useState<NFTMarketplaceItem[]>([])
  const [favoriteNFTs, setFavoriteNFTs] = useState<string[]>([])
  const [selectedNFT, setSelectedNFT] = useState<NFTMarketplaceItem | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [total, setTotal] = useState(0)
  const pageSize = 24

  // 获取活跃订单列表
  const fetchActiveOrders = useCallback(async () => {
    if (!chainId) {
      setNftItems([])
      setTotal(0)
      return
    }

    setLoading(true)
    try {
      const params: any = {
        first: pageSize,
        skip: (currentPage - 1) * pageSize,
        orderBy: 'createdAt',
        orderDirection: 'desc',
      }

      // 添加筛选条件
      if (filters.nftContract) {
        params.nftContract = filters.nftContract
      }
      if (filters.tokenId) {
        params.tokenId = filters.tokenId
      }
      if (filters.depositor) {
        params.depositor = filters.depositor
      }
      if (filters.status !== undefined) {
        params.status = filters.status
      }

      // 根据排序方式设置 orderBy
      if (filters.sortBy === 'price-low' || filters.sortBy === 'price-high') {
        params.orderBy = 'price'
        params.orderDirection = filters.sortBy === 'price-low' ? 'asc' : 'desc'
      } else if (filters.sortBy === 'createdAt-desc' || filters.sortBy === 'createdAt-asc') {
        params.orderBy = 'createdAt'
        params.orderDirection = filters.sortBy === 'createdAt-desc' ? 'desc' : 'asc'
      }

      const result = await activeOrderApi.getActiveOrders(params)
      setActiveOrders(result.items)
      setTotal(result.total)

      // 加载 NFT 元数据
      await loadNFTMetadata(result.items)
    } catch (error: any) {
      console.error('Failed to fetch active orders:', error)
      message.error(t('nftMarketplace.fetchError') || '获取订单列表失败')
      setNftItems([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [chainId, filters, currentPage, t])

  // 加载 NFT 元数据
  const loadNFTMetadata = useCallback(async (orders: ActiveOrder[]) => {
    if (!chainId) return

    const items: NFTMarketplaceItem[] = []

    // 并发加载所有 NFT 元数据
    const metadataPromises = orders.map(async (order) => {
      try {
        // 尝试使用 Alchemy API 获取元数据（如果链不支持会抛出错误）
        let metadata: AlchemyNFTMetadata | undefined
        try {
          metadata = await alchemyNFTApi.getNFTMetadata(chainId, {
            contractAddress: order.nftContract,
            tokenId: order.tokenId,
          })
        } catch (err) {
          // 静默处理错误，如果链不支持或 NFT 不存在，metadata 保持为 undefined
          console.debug(`Failed to load metadata for ${order.nftContract} #${order.tokenId}:`, err)
        }
        return { order, metadata }
      } catch (error) {
        console.error(`Error processing order ${order.id}:`, error)
        return { order, metadata: undefined }
      }
    })

    const results = await Promise.all(metadataPromises)

    for (const { order, metadata } of results) {
      try {

        // 构建 NFT 项目
        const nftName = metadata?.name || `NFT #${order.tokenId}`
        const collectionName = metadata?.contract.openSeaMetadata?.collectionName || 
          metadata?.contract.name || 
          formatAddress(order.nftContract)
        const imageUrl = metadata?.image?.cachedUrl || 
          metadata?.image?.originalUrl || 
          '/logo.ico'
        const attributes = metadata?.raw?.metadata?.attributes 
          ? (Array.isArray(metadata.raw.metadata.attributes) 
              ? metadata.raw.metadata.attributes.map((attr: any) => ({
                  trait_type: attr.trait_type || attr.traitType || 'Unknown',
                  value: attr.value || '',
                }))
              : [])
          : []

        const price = order.getFormattedPrice()
        const priceValue = parseFloat(price.replace(' ETH', ''))

        items.push({
          id: order.id,
          name: nftName,
          collection: collectionName,
          image: imageUrl,
          price: priceValue.toFixed(6),
          priceUnit: 'ETH',
          owner: formatAddress(order.depositor),
          rarity: attributes.length > 0 ? 'Rare' : 'Common', // 简化处理
          attributes,
          lastSale: '-',
          volume: '-',
          listed: order.status === 0,
          activeOrder: order,
          nftContract: order.nftContract,
          tokenId: order.tokenId,
          chainId,
          metadata,
        })
      } catch (error) {
        console.error(`Failed to process order ${order.id}:`, error)
        // 即使处理失败，也创建一个基础项
        const price = order.getFormattedPrice()
        const priceValue = parseFloat(price.replace(' ETH', ''))
        items.push({
          id: order.id,
          name: `NFT #${order.tokenId}`,
          collection: formatAddress(order.nftContract),
          image: '/logo.ico',
          price: priceValue.toFixed(6),
          priceUnit: 'ETH',
          owner: formatAddress(order.depositor),
          rarity: 'Common',
          attributes: [],
          lastSale: '-',
          volume: '-',
          listed: order.status === 0,
          activeOrder: order,
          nftContract: order.nftContract,
          tokenId: order.tokenId,
          chainId,
        })
      }
    }

    setNftItems(items)
  }, [chainId])

  // 获取所有唯一的合约地址作为收藏列表
  const collections = useMemo(() => {
    const uniqueContracts = new Set<string>()
    activeOrders.forEach((order) => {
      uniqueContracts.add(order.nftContract.toLowerCase())
    })
    return Array.from(uniqueContracts).map((addr) => formatAddress(addr))
  }, [activeOrders])

  // 筛选 NFT（基于搜索文本）
  const filteredNFTs = useMemo(() => {
    let filtered = [...nftItems]

    // 搜索筛选
    if (filters.searchText) {
      const searchLower = filters.searchText.toLowerCase()
      filtered = filtered.filter(
        (nft) =>
          nft.name.toLowerCase().includes(searchLower) ||
          nft.collection.toLowerCase().includes(searchLower) ||
          nft.nftContract.toLowerCase().includes(searchLower) ||
          nft.tokenId.toLowerCase().includes(searchLower)
      )
    }

    return filtered
  }, [nftItems, filters.searchText])

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

  // 当筛选条件或页码变化时重新获取数据
  useEffect(() => {
    fetchActiveOrders()
  }, [fetchActiveOrders])

  // 处理筛选条件变化
  const handleFilterChange = (key: keyof NFTMarketplaceFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setCurrentPage(1) // 重置到第一页
  }

  // 处理重置
  const handleReset = () => {
    setFilters({
      searchText: '',
      nftContract: '',
      tokenId: '',
      depositor: '',
      status: undefined,
      sortBy: 'price-low',
    })
    setCurrentPage(1)
  }

  return (
    <PageTitle title={t('pageTitle.nftMarketplace')}>
      <div className={styles.nftMarketplacePage}>
        <div className={styles.pageHeader}>
          <Title level={2} className={styles.pageTitle}>
            {t('nftMarketplace.title')}
          </Title>
          <Search
            placeholder={t('nftMarketplace.searchPlaceholder') || '搜索 NFT 名称、合约地址或 Token ID'}
            allowClear
            className={styles.searchInput}
            prefix={<SearchOutlined />}
            value={filters.searchText}
            onChange={(e) => handleFilterChange('searchText', e.target.value)}
            onSearch={(value) => handleFilterChange('searchText', value)}
          />
        </div>

        {/* 筛选栏 */}
        <FilterBar
          t={t}
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleReset}
        />

        {/* NFT列表 */}
        <Spin spinning={loading}>
          <div className={styles.nftGrid}>
            {!chainId ? (
              <Card className={styles.emptyCard}>
                <div className={styles.emptyContent}>
                  <p>{t('nftMarketplace.connectWallet') || '请连接钱包'}</p>
                </div>
              </Card>
            ) : filteredNFTs.length === 0 && !loading ? (
              <Card className={styles.emptyCard}>
                <div className={styles.emptyContent}>
                  <p>{t('nftMarketplace.noResults') || '没有找到 NFT'}</p>
                </div>
              </Card>
            ) : (
              <>
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
                {total > pageSize && (
                  <div style={{ marginTop: 24, textAlign: 'center' }}>
                    <Pagination
                      current={currentPage}
                      total={total}
                      pageSize={pageSize}
                      onChange={(page) => setCurrentPage(page)}
                      showSizeChanger={false}
                      showTotal={(total, range) =>
                        `${range[0]}-${range[1]} / ${total}`
                      }
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </Spin>

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
