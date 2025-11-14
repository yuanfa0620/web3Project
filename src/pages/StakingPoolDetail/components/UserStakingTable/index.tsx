/**
 * 用户质押记录表格组件
 */
import React, { useState, useEffect } from 'react'
import { Table, Typography, Tag, Avatar, Space } from 'antd'
import { CopyOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { AnimatedNumber } from '@/components/AnimatedNumber'
import { formatTime } from '@/utils/date'
import { formatAddress } from '@/utils/address'
import type { UserStakingRecord } from '../../types'
import styles from './index.module.less'

const { Text } = Typography

interface UserStakingTableProps {
  records: UserStakingRecord[]
  loading?: boolean
}

export const UserStakingTable: React.FC<UserStakingTableProps> = ({
  records,
  loading = false,
}) => {
  const { t } = useTranslation()


  // 判断是否为移动端（仅用于分页器配置）
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const columns = [
    {
      title: t('staking.time'),
      dataIndex: 'stakedTime',
      key: 'stakedTime',
      width: 220,
      render: (timestamp: number) => (
        <Text>{formatTime(timestamp)}</Text>
      ),
    },
    {
      title: t('staking.address'),
      dataIndex: 'address',
      key: 'address',
      width: 240,
      render: (address: string) => (
        <Space>
          <Avatar size="small" style={{ backgroundColor: '#1890ff' }}>
            {address.slice(2, 4).toUpperCase()}
          </Avatar>
          <Text copyable={{ text: address, icon: <CopyOutlined /> }}>
            {formatAddress(address)}
          </Text>
        </Space>
      ),
    },
    {
      title: t('staking.stakedAmount'),
      dataIndex: 'stakedAmount',
      key: 'stakedAmount',
      width: 180,
      align: 'right' as const,
      render: (amount: string) => (
        <Text strong>
          <AnimatedNumber
            value={amount.replace(/,/g, '')}
            decimals={2}
            enableAnimation={true}
          />
        </Text>
      ),
    },
    {
      title: t('staking.rewardAmount'),
      dataIndex: 'rewardAmount',
      key: 'rewardAmount',
      width: 180,
      align: 'right' as const,
      render: (amount: string) => (
        <Text strong style={{ color: '#52c41a' }}>
          <AnimatedNumber
            value={amount.replace(/,/g, '')}
            decimals={2}
            enableAnimation={true}
          />
        </Text>
      ),
    },
    {
      title: t('staking.claimedReward'),
      dataIndex: 'claimedReward',
      key: 'claimedReward',
      width: 180,
      align: 'right' as const,
      render: (amount: string) => (
        <Text>
          <AnimatedNumber
            value={amount.replace(/,/g, '')}
            decimals={2}
            enableAnimation={true}
          />
        </Text>
      ),
    },
    {
      title: t('staking.pendingReward'),
      dataIndex: 'pendingReward',
      key: 'pendingReward',
      width: 180,
      align: 'right' as const,
      render: (amount: string, record: UserStakingRecord) => {
        const pending = parseFloat(amount.replace(/,/g, ''))
        return (
          <Tag color={pending > 0 ? 'orange' : 'default'}>
            <AnimatedNumber
              value={amount.replace(/,/g, '')}
              decimals={2}
              enableAnimation={true}
            />
          </Tag>
        )
      },
    },
  ]

  return (
    <div className={styles.userStakingTable}>
      <Table
        columns={columns}
        dataSource={records}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total, range) => {
            return t('staking.totalRecords', { total })
          },
          showQuickJumper: !isMobile,
          hideOnSinglePage: false,
        }}
        scroll={{ x: true }}
        className={styles.table}
      />
    </div>
  )
}

