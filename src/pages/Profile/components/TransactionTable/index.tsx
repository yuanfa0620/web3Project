/**
 * 交易记录表格组件
 */
import React from 'react'
import { Card, Table, Empty } from 'antd'
import { useTranslation } from 'react-i18next'
import { useTransactionColumns } from '../../hooks/useTransactionColumns.tsx'
import type { Transaction } from '../../types'
import styles from './index.module.less'

export interface TransactionTableProps {
  transactions: Transaction[]
  isMobile: boolean
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  isMobile,
}) => {
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
          scroll={{ x: !isMobile ? true : 1000 }}
        />
      ) : (
        <Empty description={t('profile.noTransactions')} />
      )}
    </Card>
  )
}

