/**
 * 质押池详情页面数据加载工具
 */
// @ts-ignore - JSON 文件导入
import stakingRecordsData from '../../../../mock/stakingRecords.json'
import { loadStakingPools } from '@/pages/Staking/utils/dataLoader'
import type { StakingPool } from '@/pages/Staking/types'
import type { UserStakingRecord } from '../types'

// 格式化数字，添加千位分隔符
const formatNumber = (num: number | string): string => {
  const numStr = typeof num === 'string' ? num : num.toString()
  const parts = numStr.split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts.join('.')
}

// 根据ID加载单个质押池
export const loadStakingPoolById = (poolId: string): StakingPool | null => {
  const pools = loadStakingPools()
  return pools.find((pool) => pool.id === poolId) || null
}

// 加载用户质押记录
export const loadUserStakingRecords = (poolId: string): UserStakingRecord[] => {
  const records = (stakingRecordsData as Record<string, any[]>)[poolId] || []
  return records.map((record) => ({
    ...record,
    stakedAmount: formatNumber(record.stakedAmount),
    rewardAmount: formatNumber(record.rewardAmount),
    claimedReward: formatNumber(record.claimedReward),
    pendingReward: formatNumber(record.pendingReward),
  }))
}

