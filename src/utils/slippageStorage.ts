/**
 * 滑点设置缓存工具（使用localStorage持久化）
 */

const SLIPPAGE_KEY = 'swap_slippage'
const EXPERT_MODE_KEY = 'swap_expert_mode'

// 默认滑点值（百分比）
const DEFAULT_SLIPPAGE = 0.5

/**
 * 获取滑点设置
 */
export const getSlippage = (): number => {
  try {
    const cached = localStorage.getItem(SLIPPAGE_KEY)
    if (cached !== null) {
      const value = parseFloat(cached)
      if (!isNaN(value) && value >= 0 && value <= 100) {
        return value
      }
    }
  } catch (error) {
    console.error('Failed to get slippage from localStorage:', error)
  }
  return DEFAULT_SLIPPAGE
}

/**
 * 保存滑点设置
 */
export const setSlippage = (slippage: number): void => {
  try {
    if (slippage >= 0 && slippage <= 100) {
      localStorage.setItem(SLIPPAGE_KEY, slippage.toString())
    }
  } catch (error) {
    console.error('Failed to save slippage to localStorage:', error)
  }
}

/**
 * 获取专家模式状态
 */
export const getExpertMode = (): boolean => {
  try {
    const cached = localStorage.getItem(EXPERT_MODE_KEY)
    return cached === 'true'
  } catch (error) {
    console.error('Failed to get expert mode from localStorage:', error)
  }
  return false
}

/**
 * 保存专家模式状态
 */
export const setExpertMode = (enabled: boolean): void => {
  try {
    localStorage.setItem(EXPERT_MODE_KEY, enabled.toString())
  } catch (error) {
    console.error('Failed to save expert mode to localStorage:', error)
  }
}

