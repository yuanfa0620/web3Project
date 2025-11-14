/**
 * 质押池卡片组件
 */
import React from 'react'
import { Card, Typography, Button, Space, Avatar, Tag } from 'antd'
import { ArrowRightOutlined, TrophyOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { AnimatedNumber } from '@/components/AnimatedNumber'
import type { StakingPool } from '../../types'
import styles from './index.module.less'

const { Text, Title } = Typography

interface PoolCardProps {
  pool: StakingPool
  onViewDetail: (poolId: string) => void
}

export const PoolCard: React.FC<PoolCardProps> = ({ pool, onViewDetail }) => {
  const { t } = useTranslation()

  return (
    <Card className={styles.poolCard} hoverable>
      <div className={styles.cardHeader}>
        <div className={styles.tokenPair}>
          <div className={styles.tokenIcons}>
            <Avatar
              src={pool.lpPair.tokenA.icon}
              size={40}
              className={styles.tokenIcon}
            >
              {pool.lpPair.tokenA.symbol[0]}
            </Avatar>
            <Avatar
              src={pool.lpPair.tokenB.icon}
              size={40}
              className={styles.tokenIcon}
            >
              {pool.lpPair.tokenB.symbol[0]}
            </Avatar>
          </div>
          <div className={styles.tokenInfo}>
            <Title level={5} className={styles.poolName}>
              {pool.lpPair.tokenA.symbol} + {pool.lpPair.tokenB.symbol}
            </Title>
            <Text type="secondary" className={styles.poolType}>
              LP Token
            </Text>
          </div>
        </div>
        {pool.isActive && (
          <Tag color="green" className={styles.statusTag}>
            {t('staking.active')}
          </Tag>
        )}
      </div>

      <div className={styles.cardBody}>
        <div className={styles.statRow}>
          <Text type="secondary" className={styles.statLabel}>
            {t('staking.apy')}
          </Text>
          <Text strong className={styles.apyValue}>
            <AnimatedNumber
              value={pool.apy.toString()}
              suffix="%"
              decimals={2}
              enableAnimation={true}
            />
          </Text>
        </div>

        <div className={styles.statRow}>
          <Text type="secondary" className={styles.statLabel}>
            {t('staking.stakedAmount')}
          </Text>
          <Text strong>
            <AnimatedNumber
              value={pool.stakedAmount.replace(/,/g, '')}
              decimals={2}
              enableAnimation={true}
            />
          </Text>
        </div>

        <div className={styles.statRow}>
          <Text type="secondary" className={styles.statLabel}>
            {t('staking.totalRewards')}
          </Text>
          <Text strong>
            <AnimatedNumber
              value={pool.totalRewards.replace(/,/g, '')}
              decimals={2}
              enableAnimation={true}
            />
          </Text>
        </div>

        <div className={styles.statRow}>
          <Text type="secondary" className={styles.statLabel}>
            TVL
          </Text>
          <Text strong>
            <AnimatedNumber
              value={pool.tvl.replace(/,/g, '')}
              decimals={2}
              enableAnimation={true}
            />
          </Text>
        </div>

        {pool.lockPeriod && (
          <div className={styles.statRow}>
            <Text type="secondary" className={styles.statLabel}>
              {t('staking.lockPeriod')}
            </Text>
            <Text>{pool.lockPeriod} {t('staking.days')}</Text>
          </div>
        )}
      </div>

      <div className={styles.cardFooter}>
        <Button
          type="primary"
          icon={<ArrowRightOutlined />}
          onClick={() => onViewDetail(pool.id)}
          block
        >
          {t('staking.viewDetail')}
        </Button>
      </div>
    </Card>
  )
}

