/**
 * 质押池列表组件
 */
import React from 'react'
import { Row, Col, Empty } from 'antd'
import { useTranslation } from 'react-i18next'
import { PoolCard } from '../PoolCard'
import type { StakingPool } from '../../types'
import styles from './index.module.less'

interface PoolListProps {
  pools: StakingPool[]
  onViewDetail: (poolId: string) => void
}

export const PoolList: React.FC<PoolListProps> = ({ pools, onViewDetail }) => {
  const { t } = useTranslation()

  if (pools.length === 0) {
    return (
      <Empty
        description={t('staking.noPools')}
        className={styles.emptyState}
      />
    )
  }

  return (
    <div className={styles.poolList}>
      <Row gutter={[16, 16]}>
        {pools.map((pool) => (
          <Col
            key={pool.id}
            xs={24}
            sm={24}
            md={12}
            lg={8}
            xl={8}
            xxl={6}
          >
            <PoolCard pool={pool} onViewDetail={onViewDetail} />
          </Col>
        ))}
      </Row>
    </div>
  )
}

