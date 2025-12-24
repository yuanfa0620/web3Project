// GraphQL 查询语句定义
// graphql-request 支持字符串查询，不需要 gql 标签

// ==================== 业务实体 Fragment ====================

// 白名单 NFT Fragment
export const WHITELISTED_NFT_FRAGMENT = `
  fragment WhitelistedNFTFields on WhitelistedNFT {
    id
    nftContract
    name
    symbol
    platformFeeRate
    isActive
    addedAt
    removedAt
    addedBlockNumber
    removedBlockNumber
  }
`

// 订单 Fragment
export const ORDER_FRAGMENT = `
  fragment OrderFields on Order {
    id
    orderId
    nftContract
    tokenId
    depositor
    buyer
    price
    status
    platformFee
    sellerAmount
    createdAt
    updatedAt
    soldAt
    withdrawnAt
    createdBlockNumber
    updatedBlockNumber
    soldBlockNumber
    withdrawnBlockNumber
    createdTransactionHash
    soldTransactionHash
    withdrawnTransactionHash
  }
`

// 活跃订单 Fragment
export const ACTIVE_ORDER_FRAGMENT = `
  fragment ActiveOrderFields on ActiveOrder {
    id
    orderId
    nftContract
    tokenId
    depositor
    price
    status
    createdAt
    updatedAt
    withdrawnAt
    createdBlockNumber
    updatedBlockNumber
    withdrawnBlockNumber
    createdTransactionHash
    withdrawnTransactionHash
  }
`

// 已售出订单 Fragment
export const SOLD_ORDER_FRAGMENT = `
  fragment SoldOrderFields on SoldOrder {
    id
    orderId
    nftContract
    tokenId
    depositor
    buyer
    price
    platformFee
    sellerAmount
    createdAt
    soldAt
    createdBlockNumber
    soldBlockNumber
    createdTransactionHash
    soldTransactionHash
  }
`

// ==================== 事件实体 Fragment ====================

// NFT 存入事件 Fragment
export const NFT_DEPOSITED_FRAGMENT = `
  fragment NFTDepositedFields on NFTDeposited {
    id
    nftContract
    tokenId
    depositor
    price
    orderId
    blockNumber
    blockTimestamp
    transactionHash
  }
`

// NFT 售出事件 Fragment
export const NFT_SOLD_FRAGMENT = `
  fragment NFTSoldFields on NFTSold {
    id
    nftContract
    tokenId
    seller
    buyer
    price
    platformFee
    sellerAmount
    orderId
    blockNumber
    blockTimestamp
    transactionHash
  }
`

// NFT 撤回事件 Fragment
export const NFT_WITHDRAWN_FRAGMENT = `
  fragment NFTWithdrawnFields on NFTWithdrawn {
    id
    nftContract
    tokenId
    depositor
    orderId
    blockNumber
    blockTimestamp
    transactionHash
  }
`

// NFT 加入白名单事件 Fragment
export const NFT_WHITELISTED_FRAGMENT = `
  fragment NFTWhitelistedFields on NFTWhitelisted {
    id
    nftContract
    platformFeeRate
    blockNumber
    blockTimestamp
    transactionHash
  }
`

// NFT 从白名单移除事件 Fragment
export const NFT_REMOVED_FROM_WHITELIST_FRAGMENT = `
  fragment NFTRemovedFromWhitelistFields on NFTRemovedFromWhitelist {
    id
    nftContract
    blockNumber
    blockTimestamp
    transactionHash
  }
`

// 订单状态更新事件 Fragment
export const ORDER_STATUS_UPDATED_FRAGMENT = `
  fragment OrderStatusUpdatedFields on OrderStatusUpdated {
    id
    orderId
    status
    blockNumber
    blockTimestamp
    transactionHash
  }
`

// 价格设置事件 Fragment
export const PRICE_SET_FRAGMENT = `
  fragment PriceSetFields on PriceSet {
    id
    nftContract
    tokenId
    price
    blockNumber
    blockTimestamp
    transactionHash
  }
`

// ==================== 白名单 NFT 查询 ====================

// 获取白名单 NFT 列表
export const GET_WHITELISTED_NFTS = `
  ${WHITELISTED_NFT_FRAGMENT}
  query GetWhitelistedNFTs(
    $first: Int
    $skip: Int
    $orderBy: WhitelistedNFT_orderBy
    $orderDirection: OrderDirection
    $where: WhitelistedNFT_filter
  ) {
    whitelistedNFTs(
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: $where
    ) {
      ...WhitelistedNFTFields
    }
  }
`

// 获取白名单 NFT 详情
export const GET_WHITELISTED_NFT = `
  ${WHITELISTED_NFT_FRAGMENT}
  query GetWhitelistedNFT($id: ID!) {
    whitelistedNFT(id: $id) {
      ...WhitelistedNFTFields
    }
  }
`

// ==================== 订单查询 ====================

// 获取订单列表
export const GET_ORDERS = `
  ${ORDER_FRAGMENT}
  query GetOrders(
    $first: Int
    $skip: Int
    $orderBy: Order_orderBy
    $orderDirection: OrderDirection
    $where: Order_filter
  ) {
    orders(
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: $where
    ) {
      ...OrderFields
    }
  }
`

// 获取订单详情
export const GET_ORDER = `
  ${ORDER_FRAGMENT}
  query GetOrder($id: ID!) {
    order(id: $id) {
      ...OrderFields
    }
  }
`

// 获取活跃订单列表
export const GET_ACTIVE_ORDERS = `
  ${ACTIVE_ORDER_FRAGMENT}
  query GetActiveOrders(
    $first: Int
    $skip: Int
    $orderBy: ActiveOrder_orderBy
    $orderDirection: OrderDirection
    $where: ActiveOrder_filter
  ) {
    activeOrders(
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: $where
    ) {
      ...ActiveOrderFields
    }
  }
`

// 获取活跃订单详情
export const GET_ACTIVE_ORDER = `
  ${ACTIVE_ORDER_FRAGMENT}
  query GetActiveOrder($id: ID!) {
    activeOrder(id: $id) {
      ...ActiveOrderFields
    }
  }
`

// 获取已售出订单列表
export const GET_SOLD_ORDERS = `
  ${SOLD_ORDER_FRAGMENT}
  query GetSoldOrders(
    $first: Int
    $skip: Int
    $orderBy: SoldOrder_orderBy
    $orderDirection: OrderDirection
    $where: SoldOrder_filter
  ) {
    soldOrders(
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: $where
    ) {
      ...SoldOrderFields
    }
  }
`

// 获取已售出订单详情
export const GET_SOLD_ORDER = `
  ${SOLD_ORDER_FRAGMENT}
  query GetSoldOrder($id: ID!) {
    soldOrder(id: $id) {
      ...SoldOrderFields
    }
  }
`

// ==================== 事件查询 ====================

// 获取 NFT 存入事件列表
export const GET_NFT_DEPOSITED_EVENTS = `
  ${NFT_DEPOSITED_FRAGMENT}
  query GetNFTDepositedEvents(
    $first: Int
    $skip: Int
    $orderBy: NFTDeposited_orderBy
    $orderDirection: OrderDirection
    $where: NFTDeposited_filter
  ) {
    nFTDepositeds(
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: $where
    ) {
      ...NFTDepositedFields
    }
  }
`

// 获取 NFT 售出事件列表
export const GET_NFT_SOLD_EVENTS = `
  ${NFT_SOLD_FRAGMENT}
  query GetNFTSoldEvents(
    $first: Int
    $skip: Int
    $orderBy: NFTSold_orderBy
    $orderDirection: OrderDirection
    $where: NFTSold_filter
  ) {
    nFTSolds(
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: $where
    ) {
      ...NFTSoldFields
    }
  }
`

// 获取 NFT 撤回事件列表
export const GET_NFT_WITHDRAWN_EVENTS = `
  ${NFT_WITHDRAWN_FRAGMENT}
  query GetNFTWithdrawnEvents(
    $first: Int
    $skip: Int
    $orderBy: NFTWithdrawn_orderBy
    $orderDirection: OrderDirection
    $where: NFTWithdrawn_filter
  ) {
    nFTWithdrawns(
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: $where
    ) {
      ...NFTWithdrawnFields
    }
  }
`

// 获取 NFT 加入白名单事件列表
export const GET_NFT_WHITELISTED_EVENTS = `
  ${NFT_WHITELISTED_FRAGMENT}
  query GetNFTWhitelistedEvents(
    $first: Int
    $skip: Int
    $orderBy: NFTWhitelisted_orderBy
    $orderDirection: OrderDirection
    $where: NFTWhitelisted_filter
  ) {
    nFTWhitelisteds(
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: $where
    ) {
      ...NFTWhitelistedFields
    }
  }
`

// 获取 NFT 从白名单移除事件列表
export const GET_NFT_REMOVED_FROM_WHITELIST_EVENTS = `
  ${NFT_REMOVED_FROM_WHITELIST_FRAGMENT}
  query GetNFTRemovedFromWhitelistEvents(
    $first: Int
    $skip: Int
    $orderBy: NFTRemovedFromWhitelist_orderBy
    $orderDirection: OrderDirection
    $where: NFTRemovedFromWhitelist_filter
  ) {
    nFTRemovedFromWhitelists(
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: $where
    ) {
      ...NFTRemovedFromWhitelistFields
    }
  }
`

// 获取订单状态更新事件列表
export const GET_ORDER_STATUS_UPDATED_EVENTS = `
  ${ORDER_STATUS_UPDATED_FRAGMENT}
  query GetOrderStatusUpdatedEvents(
    $first: Int
    $skip: Int
    $orderBy: OrderStatusUpdated_orderBy
    $orderDirection: OrderDirection
    $where: OrderStatusUpdated_filter
  ) {
    orderStatusUpdateds(
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: $where
    ) {
      ...OrderStatusUpdatedFields
    }
  }
`

// 获取价格设置事件列表
export const GET_PRICE_SET_EVENTS = `
  ${PRICE_SET_FRAGMENT}
  query GetPriceSetEvents(
    $first: Int
    $skip: Int
    $orderBy: PriceSet_orderBy
    $orderDirection: OrderDirection
    $where: PriceSet_filter
  ) {
    priceSets(
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: $where
    ) {
      ...PriceSetFields
    }
  }
`

