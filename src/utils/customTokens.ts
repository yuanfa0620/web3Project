import type { TokenConfig } from '@/types/swap'
import type { RootState } from '@/store'

// 从 Redux store 获取所有自定义代币
export const getCustomTokens = (state: RootState): Record<number, TokenConfig[]> => {
  return state.customTokens.tokens
}

// 获取指定链的自定义代币
export const getCustomTokensByChain = (state: RootState, chainId: number): TokenConfig[] => {
  return state.customTokens.tokens[chainId] || []
}

// 检查代币是否为自定义代币
export const isCustomToken = (state: RootState, chainId: number, tokenAddress: string): boolean => {
  const customTokens = getCustomTokensByChain(state, chainId)
  return customTokens.some(
    (t) => t.address.toLowerCase() === tokenAddress.toLowerCase()
  )
}

