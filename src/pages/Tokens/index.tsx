import React from 'react'
import { Card, Table, Typography, Tag, Button, Space, Input } from 'antd'
import { SearchOutlined, SwapOutlined, SendOutlined } from '@ant-design/icons'
import styles from './index.module.less'
import tokens from 'mock/tokens.json'

const { Title } = Typography
const { Search } = Input

const mockTokens = tokens

const TokensPage: React.FC = () => {
  const columns = [
    {
      title: '代币',
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
      title: '余额',
      dataIndex: 'balance',
      key: 'balance',
      render: (balance: string) => (
        <span className={styles.balance}>{balance}</span>
      ),
    },
    {
      title: '价值',
      dataIndex: 'value',
      key: 'value',
      render: (value: string) => (
        <span className={styles.value}>{value}</span>
      ),
    },
    {
      title: '24h 变化',
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
      title: '操作',
      key: 'action',
      render: () => (
        <Space>
          <Button type="link" icon={<SendOutlined />}>
            发送
          </Button>
          <Button type="link" icon={<SwapOutlined />}>
            兑换
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div className={styles.tokensPage}>
      <div className={styles.pageHeader}>
        <Title level={2} className={styles.pageTitle}>
          代币管理
        </Title>
        <Search
          placeholder="搜索代币"
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
  )
}

export default TokensPage
