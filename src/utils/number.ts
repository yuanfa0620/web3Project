/**
 * 数字工具方法
 */

/**
 * 将数字格式化为带千位分隔符的字符串
 */
export const formatNumber = (num: number | string): string => {
  const numStr = typeof num === 'string' ? num : num.toString()
  const parts = numStr.split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts.join('.')
}


