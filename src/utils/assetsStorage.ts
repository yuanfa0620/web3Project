/**
 * 个人资产页面缓存工具（使用sessionStorage，浏览器关闭后清除）
 */

const ASSETS_TAB_KEY = 'assets_active_tab'

/**
 * 获取最近访问的资产tab
 */
export const getAssetsTab = (): 'nft' | 'token' => {
  try {
    const cached = sessionStorage.getItem(ASSETS_TAB_KEY)
    if (cached === 'nft' || cached === 'token') {
      return cached
    }
  } catch (error) {
    console.error('Failed to get assets tab from sessionStorage:', error)
  }
  return 'nft' // 默认返回nft
}

/**
 * 保存资产tab到sessionStorage
 */
export const setAssetsTab = (tab: 'nft' | 'token'): void => {
  try {
    sessionStorage.setItem(ASSETS_TAB_KEY, tab)
  } catch (error) {
    console.error('Failed to save assets tab to sessionStorage:', error)
  }
}

