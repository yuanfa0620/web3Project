import React from 'react'
import { Card, Table, Typography, Tag, Button, Space, Input } from 'antd'
import { SearchOutlined, SwapOutlined, SendOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { PageTitle } from '@/components/PageTitle'
import styles from './index.module.less'
import tokens from 'mock/tokens.json'

const { Title } = Typography
const { Search } = Input

const mockTokens = tokens

const TokensPage: React.FC = () => {
  const { t } = useTranslation()
  
  const columns = [
    {
      title: t('tokens.tokenList'),
      dataIndex: 'symbol',
      key: 'symbol',
      render: (symbol: string, record: any) => (
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
      render: (balance: string) => (
        <span className={styles.balance}>{balance}</span>
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
      render: (change: string, record: any) => (
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
      render: () => (
        <Space>
          <Button type="link" icon={<SendOutlined />}>
            {t('wallet.send')}
          </Button>
          <Button type="link" icon={<SwapOutlined />}>
            {t('wallet.swap')}
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <PageTitle title={t('pageTitle.tokens')}>
      <div className={styles.tokensPage}>
        <div className={styles.pageHeader}>
          <Title level={2} className={styles.pageTitle}>
            {t('tokens.title')}
          </Title>
          <Search
            placeholder={t('tokens.searchTokens')}
            allowClear
            style={{ width: 300 }}
            prefix={<SearchOutlined />}
          />
        </div>

        <Card className={styles.tokensCard}>
          <Table
            columns={columns}
            dataSource={mockTokens}
            pagination={false}
            className={styles.tokensTable}
          />
        </Card>
      </div>
    </PageTitle>
  )
}

export default TokensPage
