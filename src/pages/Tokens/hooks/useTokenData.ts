import { useMemo } from 'react'
import tokens from 'mock/tokens.json'
import type { TokenItem } from '../types'

/**
 * Tokens 数据管理 Hook
 */
export const useTokenData = () => {
  // 将 mock 数据转换为 TokenItem 类型
  const tokenList: TokenItem[] = useMemo(() => {
    return (tokens as TokenItem[]).map((token) => ({
      ...token,
      // 确保所有必需字段都存在
      key: token.key || token.symbol,
    }))
  }, [])

  return {
    tokenList,
  }
}

