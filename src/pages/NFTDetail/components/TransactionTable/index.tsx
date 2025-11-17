/**
 * NFT交易记录表格组件
 */
import React from 'react'
import { Card, Table, Empty } from 'antd'
import { useTranslation } from 'react-i18next'
import { useTransactionColumns } from '../../hooks/useTransactionColumns.tsx'
import type { NFTTransaction } from '@/pages/Profile/types'
import styles from '../TransactionTable/index.module.less'

export interface TransactionTableProps {
  transactions: NFTTransaction[]
}

export const TransactionTable: React.FC<TransactionTableProps> = ({ transactions }) => {
  const { t } = useTranslation()
  const columns = useTransactionColumns()

  return (
    <Card title={t('profile.transactionHistory')} className={styles.card}>
      {transactions.length > 0 ? (
        <Table
          columns={columns}
          dataSource={transactions}
          rowKey="hash"
          pagination={{ pageSize: 10 }}
          scroll={{ x: true }}
        />
      ) : (
        <Empty description={t('profile.noTransactions')} />
      )}
    </Card>
  )
}

