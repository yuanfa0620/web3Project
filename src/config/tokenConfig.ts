import type { TokenConfig } from '@/types/swap'
import { store } from '@/store'
import { getCustomTokensByChain } from '@/utils/customTokens'

// 预加载的token配置
import tokens1 from './tokens/1.json'
import tokens137 from './tokens/137.json'
import tokens56 from './tokens/56.json'
// import tokens42161 from './tokens/42161.json'
// import tokens10 from './tokens/10.json'
// import tokens43114 from './tokens/43114.json'
import tokens8453 from './tokens/8453.json'
// 测试网
import tokens11155111 from './tokens/11155111.json'
import tokens80001 from './tokens/80001.json'
import tokens97 from './tokens/97.json'
// import tokens421613 from './tokens/421613.json'
// import tokens420 from './tokens/420.json'
// import tokens43113 from './tokens/43113.json'
import tokens84532 from './tokens/84532.json'

const tokenConfigs: Record<number, any> = {
  // 主网
  1: tokens1,
  137: tokens137,
  56: tokens56,
  // 42161: tokens42161,
  // 10: tokens10,
  // 43114: tokens43114,
  8453: tokens8453,
  // 测试网
  11155111: tokens11155111, // Sepolia
  80001: tokens80001, // Polygon Mumbai
  97: tokens97, // BSC Testnet
  // 421613: tokens421613, // Arbitrum Sepolia
  // 420: tokens420, // Optimism Sepolia
  // 43113: tokens43113, // Avalanche Fuji
  84532: tokens84532, // Base Sepolia
}

// 加载token配置（合并自定义代币）
export const loadTokenConfig = async (chainId: number): Promise<TokenConfig[]> => {
  try {
    const config = tokenConfigs[chainId]
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
  return [1, 137, 56, 8453] // 主网
}

// 获取测试网链ID（如果需要）
export const getTestnetChainIds = (): number[] => {
  return [11155111, 80001, 97, 84532] // 测试网
}

