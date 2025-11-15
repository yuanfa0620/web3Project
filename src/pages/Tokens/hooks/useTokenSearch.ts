import { useState, useMemo, useCallback } from 'react'
import type { TokenItem } from '../types'

/**
 * Tokens 搜索功能 Hook
 */
export const useTokenSearch = (tokens: TokenItem[]) => {
  const [searchText, setSearchText] = useState<string>('')

  // 处理搜索输入变化
  const handleSearchChange = useCallback((value: string) => {
    setSearchText(value)
  }, [])

  // 过滤代币列表
  const filteredTokens = useMemo(() => {
    if (!searchText.trim()) {
      return tokens
    }

    const lowerSearchText = searchText.toLowerCase().trim()
    return tokens.filter(
      (token) =>
        token.symbol.toLowerCase().includes(lowerSearchText) ||
        token.name.toLowerCase().includes(lowerSearchText)
    )
  }, [tokens, searchText])

  return {
    searchText,
    filteredTokens,
    handleSearchChange,
  }
}

