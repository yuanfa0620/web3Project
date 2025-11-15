import React, { useMemo } from 'react'
import type { ColumnsType } from 'antd/es/table'
import { Tag, Button, Space } from 'antd'
import { SwapOutlined, SendOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { AnimatedNumber } from '@/components/AnimatedNumber'
import type { TokenItem } from '../types'
import styles from '../index.module.less'

/**
 * Tokens 表格列定义 Hook
 */
export const useTokenColumns = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const columns: ColumnsType<TokenItem> = useMemo(
    () => [
      {
        title: t('tokens.tokenList'),
        dataIndex: 'symbol',
        key: 'symbol',
        render: (symbol: string, record: TokenItem) => (
          <div className={styles.tokenInfo}>
            <div className={styles.tokenSymbol}>{symbol}</div>
            <div className={styles.tokenName}>{record.name}</div>
          </div>
        ),
      },
      {
        title: t('wallet.balance'),
        dataIndex: 'balance',
        key: 'balance',
        width: 150,
        render: (balance: string) => (
          <span className={styles.balance}>
            <AnimatedNumber
              value={balance}
              defaultValue="0.00"
              decimals={2}
              enableAnimation={true}
            />
          </span>
        ),
      },
      {
        title: t('tokens.price'),
        dataIndex: 'value',
        key: 'value',
        render: (value: string) => (
          <span className={styles.value}>{value}</span>
        ),
      },
      {
        title: t('tokens.priceChange24h'),
        dataIndex: 'change',
        key: 'change',
        render: (change: string, record: TokenItem) => (
          <Tag
            color={record.changeType === 'positive' ? 'green' : 'red'}
            className={styles.changeTag}
          >
            {change}
          </Tag>
        ),
      },
      {
        title: t('common.settings'),
        key: 'action',
        render: (_: any, record: TokenItem) => (
          <Space>
            <Button
              type="link"
              icon={<SendOutlined />}
              onClick={() => {
                // TODO: 实现发送功能，可以导航到钱包页面并打开发送模态框
                navigate('/wallet')
              }}
            >
              {t('wallet.send')}
            </Button>
            <Button
              type="link"
              icon={<SwapOutlined />}
              onClick={() => {
                // TODO: 实现交换功能，可以导航到交换页面并预填代币
                navigate('/swap')
              }}
            >
              {t('wallet.swap')}
            </Button>
          </Space>
        ),
      },
    ],
    [t, navigate]
  )

  return {
    columns,
  }
}

