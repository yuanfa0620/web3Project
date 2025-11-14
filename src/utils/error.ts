/**
 * 提取错误信息（优先使用 shortMessage）
 * 
 * 该函数用于从各种错误对象中提取友好的错误信息。
 * 优先使用 viem/wagmi 错误对象的 shortMessage 属性，
 * 如果没有则使用 message 属性，最后才使用字符串转换。
 * 
 * @param error 错误对象（可以是 Error、viem 错误对象或其他类型）
 * @returns 错误信息字符串
 * 
 * @example
 * ```typescript
 * try {
 *   await someContractCall()
 * } catch (error) {
 *   const message = getErrorMessage(error)
 *   console.error(message)
 * }
 * ```
 */
export function getErrorMessage(error: unknown): string {
  if (error && typeof error === 'object') {
    // 优先使用 shortMessage（viem/wagmi 错误对象）
    if ('shortMessage' in error && typeof error.shortMessage === 'string') {
      return error.shortMessage
    }
    // 其次使用 message
    if ('message' in error && typeof error.message === 'string') {
      return error.message
    }
  }
  // 最后使用字符串转换
  return String(error)
}

