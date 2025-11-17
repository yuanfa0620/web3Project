/**
 * 交易记录表格列定义 Hook
 */
import { useMemo } from 'react'
import type { ColumnsType } from 'antd/es/table'
import { Tag, Space } from 'antd'
import { useTranslation } from 'react-i18next'
import { AnimatedNumber } from '@/components/AnimatedNumber'
import { AddressWithCopy } from '@/components/AddressWithCopy'
import { CHAIN_INFO } from '@/constants/chains'
import { openTransactionInExplorer } from '@/utils/blockExplorer'
import { formatTime } from '@/utils/date'
import type { Transaction } from '../types'

export const useTransactionColumns = (): ColumnsType<Transaction> => {
  const { t } = useTranslation()

  const columns: ColumnsType<Transaction> = useMemo(
    () => [
      {
        title: t('profile.transactionHash'),
        dataIndex: 'hash',
        key: 'hash',
        render: (hash: string, record: Transaction) => (
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
        title: t('profile.network'),
        dataIndex: 'chainId',
        key: 'chainId',
        render: (chainId: number) => (
          <Tag>{CHAIN_INFO[chainId as keyof typeof CHAIN_INFO]?.name || chainId}</Tag>
        ),
      },
      {
        title: t('profile.amount'),
        dataIndex: 'value',
        key: 'value',
        width: 180,
        render: (value: string, record: Transaction) => {
          const decimals = record.tokenDecimals || 18
          const amount = parseFloat(value) / Math.pow(10, decimals)
          return (
            <Space>
              <AnimatedNumber value={amount} decimals={4} />
              <span>{record.tokenSymbol || 'ETH'}</span>
            </Space>
          )
        },
      },
      {
        title: t('profile.statusLabel'),
        dataIndex: 'status',
        key: 'status',
        render: (status: string) => {
          const colorMap: Record<string, string> = {
            success: 'green',
            failed: 'red',
            pending: 'orange',
          }
          return <Tag color={colorMap[status]}>{t(`profile.status.${status}`)}</Tag>
        },
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

