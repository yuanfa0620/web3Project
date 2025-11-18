/**
 * 横幅关闭状态管理
 * 使用 sessionStorage 存储关闭状态
 */

const BANNER_CLOSED_KEY = 'banner_closed'

/**
 * 检查横幅是否已关闭
 * @returns boolean
 */
export const isBannerClosed = (): boolean => {
  try {
    const closed = sessionStorage.getItem(BANNER_CLOSED_KEY)
    return closed === 'true'
  } catch (error) {
    console.error('Failed to read from sessionStorage:', error)
    return false
  }
}

/**
 * 设置横幅为已关闭状态
 */
export const setBannerClosed = (): void => {
  try {
    sessionStorage.setItem(BANNER_CLOSED_KEY, 'true')
  } catch (error) {
    console.error('Failed to write to sessionStorage:', error)
  }
}

/**
 * 清除横幅关闭状态（用于测试或重置）
 */
export const clearBannerClosed = (): void => {
  try {
    sessionStorage.removeItem(BANNER_CLOSED_KEY)
  } catch (error) {
    console.error('Failed to clear sessionStorage:', error)
  }
}

