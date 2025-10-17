# API 接口使用说明

本项目已重构API接口结构，按功能类型分类到不同目录下，每个接口都有对应的Class类型定义。

## 目录结构

```
src/api/
├── user/           # 用户相关API
│   ├── index.ts    # 用户API接口
│   └── types.ts    # 用户相关类型定义
├── token/          # 代币相关API
│   ├── index.ts    # 代币API接口
│   └── types.ts    # 代币相关类型定义
├── transaction/    # 交易相关API
│   ├── index.ts    # 交易API接口
│   └── types.ts    # 交易相关类型定义
├── data/           # 基础类型定义
│   └── types.ts    # 通用API类型
├── request.ts      # 请求封装
└── index.ts        # 统一导出
```

## 使用方式

### 1. 用户API

```typescript
import { userApi, UserInfo, UserTransactionList } from '@/api'

// 获取用户信息
const userInfo: UserInfo = await userApi.getUserInfo({ address: '0x...' })
console.log(userInfo.getDisplayName()) // 获取显示名称
console.log(userInfo.hasAvatar())      // 检查是否有头像

// 更新用户信息
const updatedUser = await userApi.updateUserInfo({
  nickname: '新昵称',
  avatar: 'https://example.com/avatar.jpg'
})

// 获取用户交易记录
const transactions: UserTransactionList = await userApi.getUserTransactions({
  address: '0x...',
  page: 1,
  limit: 20,
  status: 'success'
})

// 使用交易记录的方法
console.log(transactions.getTotalPages())  // 获取总页数
console.log(transactions.hasNextPage())    // 检查是否有下一页

// 遍历交易记录
transactions.transactions.forEach(tx => {
  console.log(tx.getFormattedValue())  // 格式化金额
  console.log(tx.getStatusText())      // 状态文本
  console.log(tx.getTypeText())        // 类型文本
})
```

### 2. 代币API

```typescript
import { tokenApi, TokenInfo, TokenList, TokenSearchResult } from '@/api'

// 获取代币列表
const tokenList: TokenList = await tokenApi.getTokenList({
  chainId: 1,
  page: 1,
  limit: 20,
  sortBy: 'marketCap',
  sortOrder: 'desc'
})

// 使用代币列表的方法
const sortedByPrice = tokenList.sortByPrice(false)  // 按价格降序
const sortedByMarketCap = tokenList.sortByMarketCap(false)  // 按市值降序

// 获取代币详情
const tokenInfo: TokenInfo = await tokenApi.getTokenDetail({
  address: '0x...',
  chainId: 1
})

// 使用代币信息的方法
console.log(tokenInfo.getFormattedPrice())        // 格式化价格
console.log(tokenInfo.getPriceChangePercent())    // 价格变化百分比
console.log(tokenInfo.getPriceChangeColor())      // 价格变化颜色类名
console.log(tokenInfo.getFormattedMarketCap())    // 格式化市值
console.log(tokenInfo.getFormattedVolume24h())    // 格式化24小时交易量

// 搜索代币
const searchResult: TokenSearchResult = await tokenApi.searchTokens({
  keyword: 'ETH',
  chainId: 1,
  limit: 10
})

// 使用搜索结果的方法
const bestMatch = searchResult.getBestMatch()  // 获取最佳匹配
const sortedByRelevance = searchResult.sortByRelevance()  // 按相关度排序

// 获取热门代币
const popularTokens = await tokenApi.getPopularTokens(1, 10)

// 获取价格历史
const priceHistory = await tokenApi.getTokenPriceHistory('0x...', 1, 7)
```

### 3. 交易API

```typescript
import { transactionApi, TransactionInfo, TransactionList } from '@/api'

// 获取交易详情
const transaction: TransactionInfo = await transactionApi.getTransactionDetail({
  hash: '0x...'
})

// 使用交易信息的方法
console.log(transaction.getFormattedValue())    // 格式化金额
console.log(transaction.getStatusText())        // 状态文本
console.log(transaction.getStatusColor())       // 状态颜色类名
console.log(transaction.getTypeText())          // 类型文本
console.log(transaction.getFormattedGasFee())   // 格式化Gas费用
console.log(transaction.getFormattedTime())     // 格式化时间
console.log(transaction.isTokenTransaction())   // 是否为代币交易

// 获取交易列表
const transactionList: TransactionList = await transactionApi.getTransactionList({
  address: '0x...',
  page: 1,
  limit: 20,
  status: 'success',
  type: 'transfer'
})

// 使用交易列表的方法
const sortedByTime = transactionList.sortByTime(false)  // 按时间排序
const pendingTxs = transactionList.filterByStatus('pending')  // 过滤待确认交易
const transferTxs = transactionList.filterByType('transfer')  // 过滤转账交易

// 提交交易
const result = await transactionApi.submitTransaction({
  to: '0x...',
  value: '1000000000000000000', // 1 ETH
  gasLimit: '21000'
})
console.log('交易哈希:', result.hash)

// 获取待确认交易
const pendingTransactions = await transactionApi.getPendingTransactions('0x...')

// 获取交易状态
const status = await transactionApi.getTransactionStatus('0x...')
console.log('状态:', status.status)
console.log('确认数:', status.confirmations)

// 估算Gas费用
const gasEstimate = await transactionApi.estimateGas({
  to: '0x...',
  value: '1000000000000000000'
})
console.log('Gas限制:', gasEstimate.gasLimit)
console.log('Gas价格:', gasEstimate.gasPrice)
console.log('Gas费用:', gasEstimate.gasFee)

// 获取交易统计
const stats = await transactionApi.getTransactionStats('0x...', 30)
console.log('总交易数:', stats.totalTransactions)
console.log('成功交易数:', stats.successfulTransactions)
console.log('失败交易数:', stats.failedTransactions)

// 监听交易状态变化
const unwatch = transactionApi.watchTransactionStatus('0x...', (status) => {
  console.log('交易状态变化:', status)
  if (status === 'success') {
    console.log('交易成功！')
    unwatch() // 取消监听
  }
})
```

## 类型定义特点

1. **Class定义**: 所有返回类型都使用Class定义，提供实例方法
2. **格式化方法**: 提供各种格式化方法，如价格、时间、金额等
3. **状态方法**: 提供状态相关的显示文本和颜色类名
4. **过滤排序**: 列表类型提供过滤和排序方法
5. **类型安全**: 完整的TypeScript类型支持

## 向后兼容

原有的API调用方式仍然支持，但建议使用新的Class-based API以获得更好的开发体验。

```typescript
// 旧方式（仍然支持）
import { userApiService } from '@/api'
const userInfo = await userApiService.get('/info/0x...')

// 新方式（推荐）
import { userApi } from '@/api'
const userInfo = await userApi.getUserInfo({ address: '0x...' })
```
