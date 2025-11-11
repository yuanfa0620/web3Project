import React, { useEffect, useRef, useCallback } from 'react'
import { Typography, Row, Col, Spin, Empty } from 'antd'
import { useTranslation } from 'react-i18next'
import { PageTitle } from '@/components/PageTitle'
import NFTCard from '@/components/NFTCard'
import { useNFTLoader } from '@/hooks/useNFTLoader'
import styles from './index.module.less'

const { Title } = Typography

const NFTsPage: React.FC = () => {
  const { t } = useTranslation()
  const { nfts, loading, hasMore, loadMore } = useNFTLoader()
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)

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

  return (
    <PageTitle title={t('pageTitle.nfts')}>
      <div className={styles.nftsPage}>
        <Title level={2} className={styles.pageTitle}>
          {t('nfts.title')}
        </Title>

        {nfts.length === 0 && loading ? (
          <div className={styles.loadingContainer}>
            <Spin size="large" />
            <p>{t('common.loading')}</p>
          </div>
        ) : nfts.length === 0 ? (
          <Empty description={t('nfts.noCollections')} />
        ) : (
          <>
            <div className={styles.nftsGrid}>
              <Row gutter={[16, 16]}>
                {nfts.map((nft) => (
                  <Col xs={12} sm={8} md={6} lg={4} xl={4} key={nft.index}>
                    <NFTCard nft={nft} />
                  </Col>
                ))}
              </Row>
            </div>

            {/* 滚动加载触发器 */}
            <div ref={loadMoreRef} className={styles.loadMoreTrigger}>
              {loading && (
                <div className={styles.loadingMore}>
                  <Spin />
                  <span>{t('common.loading')}</span>
                </div>
              )}
              {!hasMore && nfts.length > 0 && (
                <div className={styles.noMore}>
                  <p>已加载全部 {nfts.length} 个 NFT</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </PageTitle>
  )
}

export default NFTsPage
