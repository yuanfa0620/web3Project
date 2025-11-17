/**
 * NFT列表表格组件
 */
import React from 'react'
import { Card, Table, Empty } from 'antd'
import { useTranslation } from 'react-i18next'
import { useNFTColumns } from '../../hooks/useNFTColumns.tsx'
import type { UserNFT } from '../../types'
import styles from './index.module.less'

export interface NFTTableProps {
  nfts: UserNFT[]
  isMobile: boolean
}

export const NFTTable: React.FC<NFTTableProps> = ({ nfts, isMobile }) => {
  const { t } = useTranslation()
  const columns = useNFTColumns()

  return (
    <Card title={t('profile.myNFTs')} className={styles.card}>
      {nfts.length > 0 ? (
        <Table
          columns={columns}
          dataSource={nfts}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: isMobile ? true : 1000 }}
        />
      ) : (
        <Empty description={t('profile.noNFTs')} />
      )}
    </Card>
  )
}

