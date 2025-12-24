// GraphQL 公共类型定义

// 分页信息
export interface PaginationInfo {
  total: number
  page: number
  limit: number
  hasMore: boolean
}

// 带分页的列表
export class PaginatedList<T> {
  items: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean

  constructor(data: {
    items: T[]
    total: number
    page: number
    limit: number
    hasMore: boolean
  }) {
    this.items = data.items
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

  // 检查是否有上一页
  hasPrevPage(): boolean {
    return this.page > 1
  }
}

// 基础分页参数
export interface PaginationParams {
  first?: number // The Graph 使用 first 而不是 limit
  skip?: number // The Graph 使用 skip 而不是 offset
  orderBy?: string
  orderDirection?: 'asc' | 'desc'
}

// 筛选参数
export interface FilterParams {
  nftContract?: string
  tokenId?: string
  depositor?: string
  buyer?: string
  status?: number
  minPrice?: string
  maxPrice?: string
}

