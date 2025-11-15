/**
 * Swap 页面相关的工具函数
 */

/**
 * 格式化数字，去掉小数点后末尾的0
 * @param amount 要格式化的数字字符串
 * @returns 格式化后的字符串
 */
export const formatAmount = (amount: string): string => {
  if (!amount || amount === '') return ''
  
  // 尝试转换为数字
  const num = parseFloat(amount)
  if (isNaN(num)) return amount
  
  // 转换为字符串，会自动去掉末尾的0
  // 例如：1.500000 -> "1.5", 1.230000 -> "1.23", 1.000000 -> "1"
  const formatted = num.toString()
  
  // 如果原字符串以小数点结尾（用户正在输入），保持小数点
  if (amount.endsWith('.') && !formatted.includes('.')) {
    return formatted + '.'
  }
  
  return formatted
}

