/**
 * 地址格式化工具函数
 */

/**
 * 格式化地址（显示前6位和后4位）
 * @param address 地址字符串
 * @returns 格式化后的地址字符串
 */
export const formatAddress = (address: string): string => {
  if (address.length <= 10) return address
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

