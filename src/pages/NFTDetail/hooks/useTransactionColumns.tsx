/**
 * NFT交易记录表格列定义 Hook
 */
import { useMemo } from 'react'
import type { ColumnsType } from 'antd/es/table'
import { Tag } from 'antd'
import { useTranslation } from 'react-i18next'
import { AddressWithCopy } from '@/components/AddressWithCopy'
import { openTransactionInExplorer, openAddressInExplorer } from '@/utils/blockExplorer'
import { formatTime } from '@/utils/date'
import type { NFTTransaction } from '@/pages/Profile/types'

export const useTransactionColumns = (): ColumnsType<NFTTransaction> => {
  const { t } = useTranslation()

  const columns: ColumnsType<NFTTransaction> = useMemo(
    () => [
      {
        title: t('profile.transactionHash'),
        dataIndex: 'hash',
        key: 'hash',
        render: (hash: string, record: NFTTransaction) => (
          <AddressWithCopy
            address={hash}
            onClick={() => openTransactionInExplorer(hash, record.chainId)}
          />
        ),
      },
      {
        title: t('profile.type'),
        dataIndex: 'type',
        key: 'type',
        render: (type: string) => <Tag>{t(`profile.transactionType.${type}`)}</Tag>,
      },
      {
        title: t('profile.from'),
        dataIndex: 'from',
        key: 'from',
        render: (from: string, record: NFTTransaction) => (
          <AddressWithCopy
            address={from}
            onClick={() => openAddressInExplorer(from, record.chainId)}
          />
        ),
      },
      {
        title: t('profile.to'),
        dataIndex: 'to',
        key: 'to',
        render: (to: string, record: NFTTransaction) => (
          <AddressWithCopy
            address={to}
            onClick={() => openAddressInExplorer(to, record.chainId)}
          />
        ),
      },
      {
        title: t('profile.blockNumber'),
        dataIndex: 'blockNumber',
        key: 'blockNumber',
      },
      {
        title: t('profile.time'),
        dataIndex: 'timestamp',
        key: 'timestamp',
        render: (timestamp: number) => formatTime(timestamp),
      },
    ],
    [t]
  )

  return columns
}

