// 用户相关API的返回类型定义

export class UserInfo {
  id: string
  address: string
  nickname?: string
  avatar?: string
  createdAt: string
  updatedAt: string

  constructor(data: {
    id: string
    address: string
    nickname?: string
    avatar?: string
    createdAt: string
    updatedAt: string
  }) {
    this.id = data.id
    this.address = data.address
    this.nickname = data.nickname
    this.avatar = data.avatar
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }

  // 获取显示名称
  getDisplayName(): string {
    return this.nickname || this.address.slice(0, 6) + '...' + this.address.slice(-4)
  }

  // 检查是否有头像
  hasAvatar(): boolean {
    return !!this.avatar
  }
}

export class UserTransaction {
  id: string
  hash: string
  from: string
  to: string
  value: string
  tokenSymbol: string
  tokenAddress: string
  gasUsed: string
  gasPrice: string
  blockNumber: number
  timestamp: number
  status: 'pending' | 'success' | 'failed'
  type: 'send' | 'receive' | 'swap' | 'stake' | 'unstake'

  constructor(data: {
    id: string
    hash: string
    from: string
    to: string
    value: string
    tokenSymbol: string
    tokenAddress: string
    gasUsed: string
    gasPrice: string
    blockNumber: number
    timestamp: number
    status: 'pending' | 'success' | 'failed'
    type: 'send' | 'receive' | 'swap' | 'stake' | 'unstake'
  }) {
    this.id = data.id
    this.hash = data.hash
    this.from = data.from
    this.to = data.to
    this.value = data.value
    this.tokenSymbol = data.tokenSymbol
    this.tokenAddress = data.tokenAddress
    this.gasUsed = data.gasUsed
    this.gasPrice = data.gasPrice
    this.blockNumber = data.blockNumber
    this.timestamp = data.timestamp
    this.status = data.status
    this.type = data.type
  }

  // 获取格式化的交易金额
  getFormattedValue(): string {
    const numValue = parseFloat(this.value)
    if (numValue >= 1000000) {
      return (numValue / 1000000).toFixed(2) + 'M'
    } else if (numValue >= 1000) {
      return (numValue / 1000).toFixed(2) + 'K'
    }
    return numValue.toFixed(4)
  }

  // 获取状态显示文本
  getStatusText(): string {
    switch (this.status) {
      case 'pending': return '处理中'
      case 'success': return '成功'
      case 'failed': return '失败'
      default: return '未知'
    }
  }

  // 获取交易类型显示文本
  getTypeText(): string {
    switch (this.type) {
      case 'send': return '发送'
      case 'receive': return '接收'
      case 'swap': return '交换'
      case 'stake': return '质押'
      case 'unstake': return '解质押'
      default: return '未知'
    }
  }
}

export class UserTransactionList {
  transactions: UserTransaction[]
  total: number
  page: number
  limit: number
  hasMore: boolean

  constructor(data: {
    transactions: any[]
    total: number
    page: number
    limit: number
    hasMore: boolean
  }) {
    this.transactions = data.transactions.map(tx => new UserTransaction(tx))
    this.total = data.total
    this.page = data.page
    this.limit = data.limit
    this.hasMore = data.hasMore
  }

  // 获取总页数
  getTotalPages(): number {
    return Math.ceil(this.total / this.limit)
  }

  // 检查是否有下一页
  hasNextPage(): boolean {
    return this.hasMore
  }
}

// 用户API请求参数类型
export interface GetUserInfoParams {
  address: string
}

export interface UpdateUserInfoParams {
  nickname?: string
  avatar?: string
}

export interface GetUserTransactionsParams {
  address: string
  page?: number
  limit?: number
  status?: 'pending' | 'success' | 'failed'
  type?: 'send' | 'receive' | 'swap' | 'stake' | 'unstake'
}
