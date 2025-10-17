// 交易相关API的返回类型定义

export class TransactionInfo {
  hash: string
  from: string
  to: string
  value: string
  gasUsed: string
  gasPrice: string
  blockNumber: number
  timestamp: number
  status: 'pending' | 'success' | 'failed'
  type: 'transfer' | 'swap' | 'stake' | 'unstake' | 'contract' | 'approve'
  tokenSymbol?: string
  tokenAddress?: string
  tokenDecimals?: number
  nonce: number
  input: string
  logs: TransactionLog[]

  constructor(data: {
    hash: string
    from: string
    to: string
    value: string
    gasUsed: string
    gasPrice: string
    blockNumber: number
    timestamp: number
    status: 'pending' | 'success' | 'failed'
    type: 'transfer' | 'swap' | 'stake' | 'unstake' | 'contract' | 'approve'
    tokenSymbol?: string
    tokenAddress?: string
    tokenDecimals?: number
    nonce: number
    input: string
    logs: any[]
  }) {
    this.hash = data.hash
    this.from = data.from
    this.to = data.to
    this.value = data.value
    this.gasUsed = data.gasUsed
    this.gasPrice = data.gasPrice
    this.blockNumber = data.blockNumber
    this.timestamp = data.timestamp
    this.status = data.status
    this.type = data.type
    this.tokenSymbol = data.tokenSymbol
    this.tokenAddress = data.tokenAddress
    this.tokenDecimals = data.tokenDecimals
    this.nonce = data.nonce
    this.input = data.input
    this.logs = data.logs.map(log => new TransactionLog(log))
  }

  // 获取格式化的交易金额
  getFormattedValue(): string {
    const numValue = parseFloat(this.value)
    if (this.tokenDecimals) {
      const adjustedValue = numValue / Math.pow(10, this.tokenDecimals)
      if (adjustedValue >= 1000000) {
        return adjustedValue.toFixed(2) + 'M'
      } else if (adjustedValue >= 1000) {
        return adjustedValue.toFixed(2) + 'K'
      }
      return adjustedValue.toFixed(4)
    }
    
    if (numValue >= 1000000000000000000) { // 1 ETH
      return (numValue / 1000000000000000000).toFixed(4) + ' ETH'
    } else if (numValue >= 1000000000000000) { // 0.001 ETH
      return (numValue / 1000000000000000).toFixed(2) + ' Gwei'
    }
    return numValue.toString()
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

  // 获取状态颜色类名
  getStatusColor(): string {
    switch (this.status) {
      case 'pending': return 'text-yellow-500'
      case 'success': return 'text-green-500'
      case 'failed': return 'text-red-500'
      default: return 'text-gray-500'
    }
  }

  // 获取交易类型显示文本
  getTypeText(): string {
    switch (this.type) {
      case 'transfer': return '转账'
      case 'swap': return '交换'
      case 'stake': return '质押'
      case 'unstake': return '解质押'
      case 'contract': return '合约调用'
      case 'approve': return '授权'
      default: return '未知'
    }
  }

  // 获取格式化的Gas费用
  getFormattedGasFee(): string {
    const gasUsedNum = parseFloat(this.gasUsed)
    const gasPriceNum = parseFloat(this.gasPrice)
    const feeInWei = gasUsedNum * gasPriceNum
    const feeInEth = feeInWei / 1000000000000000000
    
    if (feeInEth >= 0.001) {
      return feeInEth.toFixed(4) + ' ETH'
    } else {
      return (feeInEth * 1000).toFixed(2) + ' Gwei'
    }
  }

  // 获取交易时间
  getTransactionTime(): Date {
    return new Date(this.timestamp * 1000)
  }

  // 获取格式化的时间
  getFormattedTime(): string {
    const date = this.getTransactionTime()
    return date.toLocaleString('zh-CN')
  }

  // 检查是否为代币交易
  isTokenTransaction(): boolean {
    return !!this.tokenSymbol && !!this.tokenAddress
  }
}

export class TransactionLog {
  address: string
  topics: string[]
  data: string
  logIndex: number
  transactionIndex: number
  transactionHash: string
  blockNumber: number
  blockHash: string
  removed: boolean

  constructor(data: {
    address: string
    topics: string[]
    data: string
    logIndex: number
    transactionIndex: number
    transactionHash: string
    blockNumber: number
    blockHash: string
    removed: boolean
  }) {
    this.address = data.address
    this.topics = data.topics
    this.data = data.data
    this.logIndex = data.logIndex
    this.transactionIndex = data.transactionIndex
    this.transactionHash = data.transactionHash
    this.blockNumber = data.blockNumber
    this.blockHash = data.blockHash
    this.removed = data.removed
  }

  // 检查是否为ERC20 Transfer事件
  isERC20Transfer(): boolean {
    return this.topics[0] === '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
  }

  // 检查是否为ERC721 Transfer事件
  isERC721Transfer(): boolean {
    return this.topics[0] === '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
  }
}

export class TransactionList {
  transactions: TransactionInfo[]
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
    this.transactions = data.transactions.map(tx => new TransactionInfo(tx))
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

  // 按时间排序
  sortByTime(ascending = false): TransactionList {
    const sortedTransactions = [...this.transactions].sort((a, b) => {
      return ascending ? a.timestamp - b.timestamp : b.timestamp - a.timestamp
    })
    return new TransactionList({
      transactions: sortedTransactions,
      total: this.total,
      page: this.page,
      limit: this.limit,
      hasMore: this.hasMore
    })
  }

  // 按状态过滤
  filterByStatus(status: 'pending' | 'success' | 'failed'): TransactionList {
    const filteredTransactions = this.transactions.filter(tx => tx.status === status)
    return new TransactionList({
      transactions: filteredTransactions,
      total: filteredTransactions.length,
      page: this.page,
      limit: this.limit,
      hasMore: false
    })
  }

  // 按类型过滤
  filterByType(type: 'transfer' | 'swap' | 'stake' | 'unstake' | 'contract' | 'approve'): TransactionList {
    const filteredTransactions = this.transactions.filter(tx => tx.type === type)
    return new TransactionList({
      transactions: filteredTransactions,
      total: filteredTransactions.length,
      page: this.page,
      limit: this.limit,
      hasMore: false
    })
  }
}

// 交易API请求参数类型
export interface GetTransactionDetailParams {
  hash: string
}

export interface GetTransactionListParams {
  address?: string
  page?: number
  limit?: number
  status?: 'pending' | 'success' | 'failed'
  type?: 'transfer' | 'swap' | 'stake' | 'unstake' | 'contract' | 'approve'
  startTime?: number
  endTime?: number
}

export interface SubmitTransactionParams {
  to: string
  value: string
  data?: string
  gasLimit?: string
  gasPrice?: string
  nonce?: number
}
