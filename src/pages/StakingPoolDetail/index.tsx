/**
 * 质押池详情页面
 */
import React, { useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Result, Button, Card, Typography, Avatar, Tag, Divider, Row, Col } from 'antd'
import { TrophyOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { PageTitle } from '@/components/PageTitle'
import { AnimatedNumber } from '@/components/AnimatedNumber'
import { UserStakingTable } from './components/UserStakingTable'
import { loadStakingPoolById, loadUserStakingRecords } from './utils/dataLoader'
import type { StakingPool } from '@/pages/Staking/types'
import styles from './index.module.less'

const { Title, Text } = Typography

const StakingPoolDetailPage: React.FC = () => {
  const { t } = useTranslation()
  const { poolId } = useParams<{ poolId: string }>()
  const navigate = useNavigate()

  // 加载池子数据
  const pool = useMemo(() => {
    if (!poolId) return null
    return loadStakingPoolById(poolId)
  }, [poolId])

  // 加载用户记录
  const userRecords = useMemo(() => {
    if (!poolId) return []
    return loadUserStakingRecords(poolId)
  }, [poolId])

  if (!poolId || !pool) {
    return (
      <PageTitle title={t('pageTitle.staking')}>
        <div className={styles.stakingPage}>
          <Result
            status="404"
            title="404"
            subTitle={t('staking.poolNotFound')}
            extra={
              <Button type="primary" onClick={() => navigate('/staking')}>
                {t('staking.backToList')}
              </Button>
            }
          />
        </div>
      </PageTitle>
    )
  }

  return (
    <PageTitle title={`${pool.lpPair.tokenA.symbol} + ${pool.lpPair.tokenB.symbol} - ${t('pageTitle.staking')}`}>
      <div className={styles.stakingPage}>
        <div className={styles.poolDetail}>
          <div className={styles.header}>
            <Title level={2} className={styles.pageTitle}>
              {t('staking.poolDetail')}
            </Title>
          </div>

          {/* 池子信息卡片 */}
          <Card className={styles.poolInfoCard}>
            <div className={styles.poolHeader}>
              <div className={styles.tokenPair}>
                <div className={styles.tokenIcons}>
                  <Avatar
                    src={pool.lpPair.tokenA.icon}
                    size={64}
                    className={styles.tokenIcon}
                  >
                    {pool.lpPair.tokenA.symbol[0]}
                  </Avatar>
                  <Avatar
                    src={pool.lpPair.tokenB.icon}
                    size={64}
                    className={styles.tokenIcon}
                  >
                    {pool.lpPair.tokenB.symbol[0]}
                  </Avatar>
                </div>
                <div className={styles.tokenInfo}>
                  <Title level={3} className={styles.poolName}>
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

            <Divider />

            <Row gutter={[16, 16]} className={styles.statisticsRow}>
              <Col xs={24} sm={12} md={6}>
                <div className={styles.statisticItem}>
                  <div className={styles.statisticTitle}>
                    <TrophyOutlined style={{ marginRight: 8, color: '#52c41a' }} />
                    {t('staking.apy')}
                  </div>
                  <div className={styles.statisticValue} style={{ color: '#52c41a' }}>
                    <AnimatedNumber
                      value={pool.apy.toString()}
                      suffix="%"
                      decimals={2}
                      enableAnimation={true}
                    />
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <div className={styles.statisticItem}>
                  <div className={styles.statisticTitle}>
                    {t('staking.stakedAmount')}
                  </div>
                  <div className={styles.statisticValue}>
                    <AnimatedNumber
                      value={pool.stakedAmount.replace(/,/g, '')}
                      decimals={2}
                      enableAnimation={true}
                    />
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <div className={styles.statisticItem}>
                  <div className={styles.statisticTitle}>
                    {t('staking.totalRewards')}
                  </div>
                  <div className={styles.statisticValue}>
                    <AnimatedNumber
                      value={pool.totalRewards.replace(/,/g, '')}
                      decimals={2}
                      enableAnimation={true}
                    />
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <div className={styles.statisticItem}>
                  <div className={styles.statisticTitle}>
                    TVL
                  </div>
                  <div className={styles.statisticValue}>
                    <AnimatedNumber
                      value={pool.tvl.replace(/,/g, '')}
                      decimals={2}
                      enableAnimation={true}
                    />
                  </div>
                </div>
              </Col>
            </Row>

            {pool.lockPeriod && (
              <div className={styles.lockPeriodInfo}>
                <Text type="secondary">{t('staking.lockPeriod')}: </Text>
                <Text strong>{pool.lockPeriod} {t('staking.days')}</Text>
              </div>
            )}
          </Card>

          {/* 用户质押记录 */}
          <Card className={styles.recordsCard}>
            <Title level={4} className={styles.sectionTitle}>
              {t('staking.userStakingRecords')}
            </Title>
            <UserStakingTable records={userRecords} />
          </Card>
        </div>
      </div>
    </PageTitle>
  )
}

export default StakingPoolDetailPage

