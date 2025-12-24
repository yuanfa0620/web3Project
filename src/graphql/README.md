# GraphQL API 使用说明

本项目使用 The Graph 子图来查询 NFT 市场数据。GraphQL API 封装在 `src/graphql` 目录下。

## 配置

GraphQL 端点配置在 `src/config/constants.ts` 中：

```typescript
GRAPHQL: {
  ENDPOINT: import.meta.env.VITE_GRAPHQL_ENDPOINT || 'https://api.studio.thegraph.com/query/1713860/web-3-project/version/latest',
  DEPLOYMENT_ID: import.meta.env.VITE_GRAPHQL_DEPLOYMENT_ID || 'QmTHTJT3EiBEGV9BupWkzWtU5b2LR6vZuaC3AbtFTh6EPm',
  CHAIN_ID: 11155111, // Ethereum Sepolia
}
```

可以通过环境变量 `VITE_GRAPHQL_ENDPOINT` 来覆盖默认的 GraphQL 端点。

## 使用方法

### 导入 API

```typescript
import { graphqlApi } from '@/api'
// 或者
import { graphqlApi } from '@/graphql'
```

### 白名单 NFT API

#### 获取白名单 NFT 列表

```typescript
// 获取所有活跃的白名单 NFT
const whitelistedNFTs = await graphqlApi.getWhitelistedNFTs({
  isActive: true,
  first: 100,
  skip: 0,
  orderBy: 'addedAt',
  orderDirection: 'desc',
})

console.log(whitelistedNFTs.items) // WhitelistedNFT[]
console.log(whitelistedNFTs.total) // 总数
console.log(whitelistedNFTs.hasNextPage()) // 是否有下一页
```

#### 获取白名单 NFT 详情

```typescript
// 根据 ID 获取
const nft = await graphqlApi.getWhitelistedNFT('0x...')

// 根据合约地址获取
const nft = await graphqlApi.getWhitelistedNFTByContract('0x...')
```

### 订单 API

#### 获取订单列表

```typescript
// 获取所有订单
const orders = await graphqlApi.getOrders({
  first: 100,
  skip: 0,
  orderBy: 'createdAt',
  orderDirection: 'desc',
})

// 按条件筛选订单
const orders = await graphqlApi.getOrders({
  nftContract: '0x...',
  depositor: '0x...',
  status: 0, // 0: Listed, 1: Cancelled, 2: Sold, 3: Withdrawn
  minPrice: '1000000000000000000', // 1 ETH (wei)
  maxPrice: '10000000000000000000', // 10 ETH (wei)
  first: 50,
  skip: 0,
})
```

#### 获取订单详情

```typescript
const order = await graphqlApi.getOrder('订单ID')
console.log(order?.getStatusText()) // 获取状态文本
console.log(order?.getFormattedPrice()) // 获取格式化的价格
```

### 活跃订单 API

#### 获取活跃订单列表

```typescript
const activeOrders = await graphqlApi.getActiveOrders({
  nftContract: '0x...',
  first: 100,
  skip: 0,
})
```

#### 根据 NFT 获取活跃订单

```typescript
const order = await graphqlApi.getActiveOrderByNFT('0x...', '123')
```

### 已售出订单 API

#### 获取已售出订单列表

```typescript
const soldOrders = await graphqlApi.getSoldOrders({
  buyer: '0x...',
  first: 100,
  skip: 0,
})
```

### 事件 API

#### 获取 NFT 存入事件

```typescript
const events = await graphqlApi.getNFTDepositedEvents({
  nftContract: '0x...',
  tokenId: '123',
  first: 100,
  skip: 0,
})
```

#### 获取 NFT 售出事件

```typescript
const events = await graphqlApi.getNFTSoldEvents({
  buyer: '0x...',
  first: 100,
  skip: 0,
})
```

#### 获取其他事件

```typescript
// NFT 撤回事件
const events = await graphqlApi.getNFTWithdrawnEvents({ ... })

// NFT 加入白名单事件
const events = await graphqlApi.getNFTWhitelistedEvents({ ... })

// NFT 从白名单移除事件
const events = await graphqlApi.getNFTRemovedFromWhitelistEvents({ ... })

// 订单状态更新事件
const events = await graphqlApi.getOrderStatusUpdatedEvents({ ... })

// 价格设置事件
const events = await graphqlApi.getPriceSetEvents({ ... })
```

## 类型定义

所有类型定义在 `src/graphql/types.ts` 中：

- `WhitelistedNFT` - 白名单 NFT 合约
- `Order` - 订单
- `ActiveOrder` - 活跃订单
- `SoldOrder` - 已售出订单
- `NFTDeposited` - NFT 存入事件
- `NFTSold` - NFT 售出事件
- `NFTWithdrawn` - NFT 撤回事件
- `NFTWhitelisted` - NFT 加入白名单事件
- `NFTRemovedFromWhitelist` - NFT 从白名单移除事件
- `OrderStatusUpdated` - 订单状态更新事件
- `PriceSet` - 价格设置事件
- `PaginatedList<T>` - 分页列表

## 查询参数

### PaginationParams

- `first?: number` - 返回的记录数（默认 100）
- `skip?: number` - 跳过的记录数（默认 0）
- `orderBy?: string` - 排序字段
- `orderDirection?: 'asc' | 'desc'` - 排序方向

### FilterParams

- `nftContract?: string` - NFT 合约地址
- `tokenId?: string` - Token ID
- `depositor?: string` - 卖家地址
- `buyer?: string` - 买家地址
- `status?: number` - 订单状态
- `minPrice?: string` - 最小价格（wei）
- `maxPrice?: string` - 最大价格（wei）

## 注意事项

1. The Graph 使用 `first` 和 `skip` 进行分页，而不是 `limit` 和 `offset`
2. 地址参数会自动转换为小写
3. 价格以 wei 为单位（BigInt 字符串）
4. 所有时间戳以秒为单位
5. 分页列表的 `total` 可能不准确，建议使用 `hasMore` 判断是否有更多数据

