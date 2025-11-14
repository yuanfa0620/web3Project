/**
 * 质押池列表页面数据加载工具
 */
// @ts-ignore - JSON 文件导入
import stakingPoolsData from '../../../../mock/stakingPools.json'
import type { StakingPool } from '../types'

// 格式化数字，添加千位分隔符
const formatNumber = (num: number | string): string => {
  const numStr = typeof num === 'string' ? num : num.toString()
  const parts = numStr.split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts.join('.')
}

// 加载所有质押池
export const loadStakingPools = (): StakingPool[] => {
  return (stakingPoolsData as any[]).map((pool) => ({
    ...pool,
    stakedAmount: formatNumber(pool.stakedAmount),
    totalRewards: formatNumber(pool.totalRewards),
    tvl: formatNumber(pool.tvl),
  }))
}

