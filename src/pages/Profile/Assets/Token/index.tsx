/**
 * Token资产页面
 */
import React, { useState, useMemo, useEffect } from 'react'
import { Typography, Empty, Space } from 'antd'
import { useTranslation } from 'react-i18next'
import { useAccount } from 'wagmi'
import { PageTitle } from '@/components/PageTitle'
import { useTokenData } from '@/pages/Tokens/hooks/useTokenData'
import { useTokenColumns } from '@/pages/Tokens/hooks/useTokenColumns'
import { Table, Card } from 'antd'
import { useMobile } from '@/utils/useMobile'
import { NetworkFilter } from '../components/NetworkFilter'
import { setAssetsTab } from '@/utils/assetsStorage'
import styles from '../index.module.less'

const { Title } = Typography

const TokenAssetsPage: React.FC = () => {
  const { t } = useTranslation()
  const { isConnected } = useAccount()
  const { tokenList } = useTokenData()
  const { columns: tokenColumns } = useTokenColumns()
  const isMobile = useMobile()
  const [selectedChainIds, setSelectedChainIds] = useState<number[]>([])

  // 保存当前tab到缓存
  useEffect(() => {
    setAssetsTab('token')
  }, [])

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

  return (
    <PageTitle title={t('pageTitle.assets')}>
      <div className={styles.assetsPage}>
        <div className={styles.pageHeader}>
          <Title level={2} className={styles.pageTitle}>
            {t('assets.token')}
          </Title>
          <Space className={styles.filterContainer}>
            <NetworkFilter
              value={selectedChainIds}
              onChange={setSelectedChainIds}
              placeholder={t('assets.filterByNetwork')}
            />
          </Space>
        </div>

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
      </div>
    </PageTitle>
  )
}

export default TokenAssetsPage

