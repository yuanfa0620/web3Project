/**
 * 质押池类型定义
 */

// LP代币对
export interface LPTokenPair {
  tokenA: {
    symbol: string
    name: string
    icon?: string
    address: string
  }
  tokenB: {
    symbol: string
    name: string
    icon?: string
    address: string
  }
}

// 质押池信息
export interface StakingPool {
  id: string
  lpPair: LPTokenPair
  stakedAmount: string // 质押数量
  apy: number // 年化收益率（百分比）
  totalRewards: string // 总奖励数量
  tvl: string // 总锁定价值
  rewardToken: {
    symbol: string
    name: string
    icon?: string
    address: string
  }
  lockPeriod?: number // 锁定期（天），可选
  isActive: boolean // 是否激活
}


