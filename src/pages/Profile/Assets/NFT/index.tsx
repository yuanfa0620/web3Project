/**
 * NFT资产页面
 */
import React, { useState, useMemo, useEffect } from 'react'
import { Typography, Empty, Space, Row, Col, Pagination } from 'antd'
import { useTranslation } from 'react-i18next'
import { useAccount } from 'wagmi'
import { PageTitle } from '@/components/PageTitle'
import { useProfileData } from '../../hooks/useProfileData'
import { useMobile } from '@/utils/useMobile'
import { NetworkFilter } from '../components/NetworkFilter'
import { setAssetsTab } from '@/utils/assetsStorage'
import NFTCard from './components/NFTCard'
import type { UserNFT } from '../../types'
import styles from '../index.module.less'

const { Title } = Typography

const NFTAssetsPage: React.FC = () => {
  const { t } = useTranslation()
  const { address, isConnected } = useAccount()
  const { nfts } = useProfileData(address)
  const isMobile = useMobile()
  const [selectedChainIds, setSelectedChainIds] = useState<number[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 12

  // 保存当前tab到缓存
  useEffect(() => {
    setAssetsTab('nft')
  }, [])

  // 过滤NFT列表
  const filteredNFTs = useMemo(() => {
    if (selectedChainIds.length === 0) {
      return nfts
    }
    return nfts.filter((nft: UserNFT) => selectedChainIds.includes(nft.chainId))
  }, [nfts, selectedChainIds])

  // 分页数据
  const paginatedNFTs = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    const end = start + pageSize
    return filteredNFTs.slice(start, end)
  }, [filteredNFTs, currentPage])

  // 重置到第一页当筛选条件改变时
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedChainIds])

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
          {filteredNFTs.length > 0 ? (
            <>
              <Row gutter={[16, 16]} className={styles.nftGrid}>
                {paginatedNFTs.map((nft) => (
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
              {filteredNFTs.length > pageSize && (
                <div className={styles.paginationContainer}>
                  <Pagination
                    current={currentPage}
                    total={filteredNFTs.length}
                    pageSize={pageSize}
                    onChange={setCurrentPage}
                    showSizeChanger={false}
                    showQuickJumper={!isMobile}
                    showTotal={(total) => `共 ${total} 项`}
                  />
                </div>
              )}
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

