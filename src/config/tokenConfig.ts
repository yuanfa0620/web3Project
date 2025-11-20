import type { TokenConfig } from '@/types/swap'
import { store } from '@/store'
import { getCustomTokensByChain } from '@/utils/customTokens'
import { BASE_TOKEN_CONFIGS, MAINNET_CHAIN_IDS, TESTNET_CHAIN_IDS } from '@/config/network'

// 加载token配置（合并自定义代币）
export const loadTokenConfig = async (chainId: number): Promise<TokenConfig[]> => {
  try {
    const config = BASE_TOKEN_CONFIGS[chainId]
    const baseTokens: TokenConfig[] = config && config.tokens ? config.tokens : []
    
    // 从 Redux store 获取自定义代币
    const state = store.getState()
    const customTokens = getCustomTokensByChain(state, chainId)
    
    // 合并代币列表，自定义代币放在后面
    // 使用Map去重，优先保留基础配置中的代币
    const tokenMap = new Map<string, TokenConfig>()
    
    // 先添加基础代币
    baseTokens.forEach(token => {
      tokenMap.set(token.address.toLowerCase(), { ...token, chainId })
    })
    
    // 再添加自定义代币（如果地址不存在）
    customTokens.forEach(token => {
      const key = token.address.toLowerCase()
      if (!tokenMap.has(key)) {
        tokenMap.set(key, { ...token, chainId, isCustom: true })
      }
    })
    
    return Array.from(tokenMap.values())
  } catch (error) {
    console.warn(`Token config for chain ${chainId} not found:`, error)
    return []
  }
}

// 获取所有支持的链ID
export const getSupportedChainIds = (): number[] => {
  return [...MAINNET_CHAIN_IDS]
}

// 获取测试网链ID（如果需要）
export const getTestnetChainIds = (): number[] => {
  return [...TESTNET_CHAIN_IDS]
}

