/**
 * NFT资产页面
 */
import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { Typography, Empty, Space, Row, Col, Spin, Alert } from 'antd'
import { useTranslation } from 'react-i18next'
import { useAccount } from 'wagmi'
import { PageTitle } from '@/components/PageTitle'
import { useMobile } from '@/utils/useMobile'
import { NetworkFilter } from '../components/NetworkFilter'
import { setAssetsTab } from '@/utils/assetsStorage'
import { useAlchemyNFTs } from './hooks/useAlchemyNFTs'
import { ALCHEMY_NETWORK_MAP } from '@/api/modules/alchemy/types'
import NFTCard from './components/NFTCard'
import type { UserNFT } from '../../types'
import styles from '../index.module.less'

const { Title } = Typography

const NFTAssetsPage: React.FC = () => {
  const { t } = useTranslation()
  const { address, isConnected, chainId } = useAccount()
  const isMobile = useMobile()
  const [selectedChainIds, setSelectedChainIds] = useState<number[]>([])
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  // 保存当前tab到缓存
  useEffect(() => {
    setAssetsTab('nft')
  }, [])

  // 确定要查询的网络ID列表
  // 如果用户选择了网络，使用选择的网络；否则使用当前连接的网络（如果支持）
  const chainIdsToFetch = useMemo(() => {
    if (selectedChainIds.length > 0) {
      // 只获取Alchemy支持的网络
      return selectedChainIds.filter(id => ALCHEMY_NETWORK_MAP[id])
    }
    
    // 如果没有选择网络，使用当前连接的网络（如果支持）
    if (chainId && ALCHEMY_NETWORK_MAP[chainId]) {
      return [chainId]
    }
    
    // 如果当前网络不支持，返回所有支持的测试网
    return Object.keys(ALCHEMY_NETWORK_MAP).map(id => Number(id))
  }, [selectedChainIds, chainId])

  // 使用Alchemy API获取NFT数据（每页50条）
  const { nfts, loading, error, hasMore, loadMore, refetch } = useAlchemyNFTs({
    address: address || undefined,
    chainIds: chainIdsToFetch,
    enabled: isConnected && !!address,
    pageSize: 50,
  })

  // 过滤NFT列表（按选择的网络）
  const filteredNFTs = useMemo(() => {
    if (selectedChainIds.length === 0) {
      return nfts
    }
    return nfts.filter((nft: UserNFT) => selectedChainIds.includes(nft.chainId))
  }, [nfts, selectedChainIds])

  // 滚动加载处理
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries
      if (target.isIntersecting && hasMore && !loading) {
        loadMore()
      }
    },
    [hasMore, loading, loadMore]
  )

  // 设置 Intersection Observer
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '100px',
      threshold: 0.1,
    }

    observerRef.current = new IntersectionObserver(handleObserver, options)

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current)
    }

    return () => {
      if (observerRef.current && loadMoreRef.current) {
        observerRef.current.unobserve(loadMoreRef.current)
      }
    }
  }, [handleObserver])

  if (!isConnected) {
    return (
      <PageTitle title={t('pageTitle.assets')}>
        <div className={styles.assetsPage}>
          <Empty description={t('assets.connectWallet')} />
        </div>
      </PageTitle>
    )
  }

  return (
    <PageTitle title={t('pageTitle.assets')}>
      <div className={styles.assetsPage}>
        <div className={styles.pageHeader}>
          <Title level={2} className={styles.pageTitle}>
            {t('assets.nft')}
          </Title>
          <Space className={styles.filterContainer}>
            <NetworkFilter
              value={selectedChainIds}
              onChange={setSelectedChainIds}
              placeholder={t('assets.filterByNetwork')}
            />
          </Space>
        </div>

        <div className={styles.nftGridContainer}>
          {loading && filteredNFTs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <Spin size="large" />
              <div style={{ marginTop: 16, color: '#8c8c8c' }}>
                {t('common.loading')}
              </div>
            </div>
          ) : error ? (
            <Alert
              description={
                <Space direction="vertical" style={{ width: '100%' }}>
                  <span>{error}</span>
                  <a onClick={refetch}>{t('common.refresh')}</a>
                </Space>
              }
              type="error"
              showIcon
            />
          ) : filteredNFTs.length > 0 ? (
            <>
              <Row gutter={[16, 16]} className={styles.nftGrid}>
                {filteredNFTs.map((nft) => (
                  <Col 
                    xs={24} 
                    sm={12} 
                    md={8} 
                    lg={6} 
                    xl={6} 
                    xxl={4} 
                    key={nft.id}
                  >
                    <NFTCard nft={nft} />
                  </Col>
                ))}
              </Row>
              
              {/* 滚动加载触发器 */}
              <div ref={loadMoreRef} className={styles.loadMoreTrigger}>
                {loading && filteredNFTs.length > 0 && (
                  <div className={styles.loadingMore}>
                    <Spin />
                    <span>{t('common.loading')}</span>
                  </div>
                )}
                {!hasMore && filteredNFTs.length > 0 && (
                  <div className={styles.noMore}>
                    <p>已加载全部 {filteredNFTs.length} 个 NFT</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Empty description={t('assets.noNFTs')} />
          )}
        </div>
      </div>
    </PageTitle>
  )
}

export default NFTAssetsPage

