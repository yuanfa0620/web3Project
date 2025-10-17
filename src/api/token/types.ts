// 代币相关API的返回类型定义

export class TokenInfo {
  address: string
  symbol: string
  name: string
  decimals: number
  logoURI?: string
  chainId: number
  totalSupply?: string
  price?: number
  priceChange24h?: number
  volume24h?: number
  marketCap?: number

  constructor(data: {
    address: string
    symbol: string
    name: string
    decimals: number
    logoURI?: string
    chainId: number
    totalSupply?: string
    price?: number
    priceChange24h?: number
    volume24h?: number
    marketCap?: number
  }) {
    this.address = data.address
    this.symbol = data.symbol
    this.name = data.name
    this.decimals = data.decimals
    this.logoURI = data.logoURI
    this.chainId = data.chainId
    this.totalSupply = data.totalSupply
    this.price = data.price
    this.priceChange24h = data.priceChange24h
    this.volume24h = data.volume24h
    this.marketCap = data.marketCap
  }

  // 获取格式化的价格
  getFormattedPrice(): string {
    if (!this.price) return 'N/A'
    if (this.price < 0.01) {
      return '$' + this.price.toFixed(6)
    } else if (this.price < 1) {
      return '$' + this.price.toFixed(4)
    } else {
      return '$' + this.price.toFixed(2)
    }
  }

  // 获取价格变化百分比
  getPriceChangePercent(): string {
    if (this.priceChange24h === undefined) return 'N/A'
    const sign = this.priceChange24h >= 0 ? '+' : ''
    return sign + this.priceChange24h.toFixed(2) + '%'
  }

  // 获取价格变化颜色类名
  getPriceChangeColor(): string {
    if (this.priceChange24h === undefined) return 'text-gray-500'
    return this.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'
  }

  // 获取格式化的市值
  getFormattedMarketCap(): string {
    if (!this.marketCap) return 'N/A'
    if (this.marketCap >= 1000000000) {
      return '$' + (this.marketCap / 1000000000).toFixed(2) + 'B'
    } else if (this.marketCap >= 1000000) {
      return '$' + (this.marketCap / 1000000).toFixed(2) + 'M'
    } else if (this.marketCap >= 1000) {
      return '$' + (this.marketCap / 1000).toFixed(2) + 'K'
    }
    return '$' + this.marketCap.toFixed(2)
  }

  // 获取格式化的24小时交易量
  getFormattedVolume24h(): string {
    if (!this.volume24h) return 'N/A'
    if (this.volume24h >= 1000000000) {
      return '$' + (this.volume24h / 1000000000).toFixed(2) + 'B'
    } else if (this.volume24h >= 1000000) {
      return '$' + (this.volume24h / 1000000).toFixed(2) + 'M'
    } else if (this.volume24h >= 1000) {
      return '$' + (this.volume24h / 1000).toFixed(2) + 'K'
    }
    return '$' + this.volume24h.toFixed(2)
  }
}

export class TokenList {
  tokens: TokenInfo[]
  total: number
  page: number
  limit: number
  hasMore: boolean

  constructor(data: {
    tokens: any[]
    total: number
    page: number
    limit: number
    hasMore: boolean
  }) {
    this.tokens = data.tokens.map(token => new TokenInfo(token))
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

  // 按价格排序
  sortByPrice(ascending = false): TokenList {
    const sortedTokens = [...this.tokens].sort((a, b) => {
      const priceA = a.price || 0
      const priceB = b.price || 0
      return ascending ? priceA - priceB : priceB - priceA
    })
    return new TokenList({
      tokens: sortedTokens,
      total: this.total,
      page: this.page,
      limit: this.limit,
      hasMore: this.hasMore
    })
  }

  // 按市值排序
  sortByMarketCap(ascending = false): TokenList {
    const sortedTokens = [...this.tokens].sort((a, b) => {
      const marketCapA = a.marketCap || 0
      const marketCapB = b.marketCap || 0
      return ascending ? marketCapA - marketCapB : marketCapB - marketCapA
    })
    return new TokenList({
      tokens: sortedTokens,
      total: this.total,
      page: this.page,
      limit: this.limit,
      hasMore: this.hasMore
    })
  }
}

export class TokenSearchResult {
  tokens: TokenInfo[]
  total: number
  keyword: string

  constructor(data: {
    tokens: any[]
    total: number
    keyword: string
  }) {
    this.tokens = data.tokens.map(token => new TokenInfo(token))
    this.total = data.total
    this.keyword = data.keyword
  }

  // 获取匹配度最高的代币
  getBestMatch(): TokenInfo | null {
    return this.tokens.length > 0 ? this.tokens[0] : null
  }

  // 按匹配度排序
  sortByRelevance(): TokenSearchResult {
    const sortedTokens = [...this.tokens].sort((a, b) => {
      // 优先匹配symbol，然后匹配name
      const aSymbolMatch = a.symbol.toLowerCase().includes(this.keyword.toLowerCase())
      const bSymbolMatch = b.symbol.toLowerCase().includes(this.keyword.toLowerCase())
      const aNameMatch = a.name.toLowerCase().includes(this.keyword.toLowerCase())
      const bNameMatch = b.name.toLowerCase().includes(this.keyword.toLowerCase())
      
      if (aSymbolMatch && !bSymbolMatch) return -1
      if (!aSymbolMatch && bSymbolMatch) return 1
      if (aNameMatch && !bNameMatch) return -1
      if (!aNameMatch && bNameMatch) return 1
      return 0
    })
    
    return new TokenSearchResult({
      tokens: sortedTokens,
      total: this.total,
      keyword: this.keyword
    })
  }
}

// 代币API请求参数类型
export interface GetTokenListParams {
  chainId?: number
  page?: number
  limit?: number
  sortBy?: 'price' | 'marketCap' | 'volume24h' | 'name'
  sortOrder?: 'asc' | 'desc'
}

export interface GetTokenDetailParams {
  address: string
  chainId: number
}

export interface SearchTokensParams {
  keyword: string
  chainId?: number
  limit?: number
}
