/**
 * Tokens 页面相关的类型定义
 */

export interface TokenItem {
  key: string
  symbol: string
  name: string
  balance: string
  value: string
  change: string
  changeType: 'positive' | 'negative'
}

