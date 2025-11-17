/**
 * 质押池列表页面数据加载工具
 */
// @ts-ignore - JSON 文件导入
import stakingPoolsData from '../../../../mock/stakingPools.json'
import type { StakingPool } from '../types'
import { formatNumber } from '@/utils/number'

// 加载所有质押池
export const loadStakingPools = (): StakingPool[] => {
  return (stakingPoolsData as any[]).map((pool) => ({
    ...pool,
    stakedAmount: formatNumber(pool.stakedAmount),
    totalRewards: formatNumber(pool.totalRewards),
    tvl: formatNumber(pool.tvl),
  }))
}

