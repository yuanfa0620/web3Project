/**
 * 个人资产页面
 */
import React, { useState, useMemo } from 'react'
import { Typography, Tabs, Empty, Space } from 'antd'
import { useTranslation } from 'react-i18next'
import { useAccount } from 'wagmi'
import { PageTitle } from '@/components/PageTitle'
import { useProfileData } from '../hooks/useProfileData'
import { useTokenData } from '@/pages/Tokens/hooks/useTokenData'
import { useNFTColumns } from '../hooks/useNFTColumns'
import { useTokenColumns } from '@/pages/Tokens/hooks/useTokenColumns'
import { Table, Card } from 'antd'
import { useMobile } from '@/utils/useMobile'
import { NetworkFilter } from './components/NetworkFilter'
import type { UserNFT } from '../types'
import type { TokenItem } from '@/pages/Tokens/types'
import styles from './index.module.less'

const { Title } = Typography

const AssetsPage: React.FC = () => {
  const { t } = useTranslation()
  const { address, isConnected } = useAccount()
  const { nfts } = useProfileData(address)
  const { tokenList } = useTokenData()
  const nftColumns = useNFTColumns()
  const { columns: tokenColumns } = useTokenColumns()
  const isMobile = useMobile()
  const [activeTab, setActiveTab] = useState<string>('nft')
  const [selectedChainIds, setSelectedChainIds] = useState<number[]>([])

  // 过滤NFT列表
  const filteredNFTs = useMemo(() => {
    if (selectedChainIds.length === 0) {
      return nfts
    }
    return nfts.filter((nft: UserNFT) => selectedChainIds.includes(nft.chainId))
  }, [nfts, selectedChainIds])

  // 过滤Token列表（由于TokenItem没有chainId，暂时显示所有Token）
  const filteredTokens = useMemo(() => {
    // TODO: 如果TokenItem添加了chainId字段，可以在这里实现过滤逻辑
    return tokenList
  }, [tokenList, selectedChainIds])

  if (!isConnected) {
    return (
      <PageTitle title={t('pageTitle.assets')}>
        <div className={styles.assetsPage}>
          <Empty description={t('assets.connectWallet')} />
        </div>
      </PageTitle>
    )
  }

  const tabItems = useMemo(() => [
    {
      key: 'nft',
      label: t('assets.nft'),
      children: (
        <Card className={styles.tabContent}>
          {filteredNFTs.length > 0 ? (
            <Table
              columns={nftColumns}
              dataSource={filteredNFTs}
              rowKey="id"
              pagination={{ pageSize: 10 }}
              scroll={{ x: isMobile ? true : 1000 }}
            />
          ) : (
            <Empty description={t('assets.noNFTs')} />
          )}
        </Card>
      ),
    },
    {
      key: 'token',
      label: t('assets.token'),
      children: (
        <Card className={styles.tabContent}>
          {filteredTokens.length > 0 ? (
            <Table
              columns={tokenColumns}
              dataSource={filteredTokens}
              rowKey="key"
              pagination={false}
              scroll={{ x: isMobile ? true : true }}
            />
          ) : (
            <Empty description={t('assets.noTokens')} />
          )}
        </Card>
      ),
    },
  ], [t, filteredNFTs, filteredTokens, nftColumns, tokenColumns, isMobile])

  return (
    <PageTitle title={t('pageTitle.assets')}>
      <div className={styles.assetsPage}>
        <div className={styles.pageHeader}>
          <Title level={2} className={styles.pageTitle}>
            {t('assets.title')}
          </Title>
          <Space className={styles.filterContainer}>
            <NetworkFilter
              value={selectedChainIds}
              onChange={setSelectedChainIds}
              placeholder={t('assets.filterByNetwork')}
            />
          </Space>
        </div>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          className={styles.tabs}
        />
      </div>
    </PageTitle>
  )
}

export default AssetsPage

