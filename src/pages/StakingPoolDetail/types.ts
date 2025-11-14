/**
 * 质押池详情页面类型定义
 */

// 用户质押记录
export interface UserStakingRecord {
  id: string
  poolId: string
  address: string
  stakedAmount: string // 质押数量
  stakedTime: number // 质押时间（时间戳）
  rewardAmount: string // 奖励数量
  claimedReward: string // 已领取奖励
  pendingReward: string // 待领取奖励
  unlockTime?: number // 解锁时间（时间戳），如果有锁定期
}

