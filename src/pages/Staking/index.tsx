/**
 * 质押页面 - 列表页
 */
import React from 'react'
import { Typography } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PageTitle } from '@/components/PageTitle'
import { PoolList } from './components/PoolList'
import { loadStakingPools } from './utils/dataLoader'
import styles from './index.module.less'

const { Title } = Typography

const StakingPage: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  // 加载所有池子
  const pools = React.useMemo(() => loadStakingPools(), [])

  // 处理查看详情
  const handleViewDetail = (poolId: string) => {
    navigate(`/staking/${poolId}`)
  }

  return (
    <PageTitle title={t('pageTitle.staking')}>
      <div className={styles.stakingPage}>
        <Title level={2} className={styles.pageTitle}>
          {t('staking.title')}
        </Title>
        <PoolList
          pools={pools}
          onViewDetail={handleViewDetail}
        />
      </div>
    </PageTitle>
  )
}

export default StakingPage
