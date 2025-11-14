/**
 * Promise 相关工具函数
 */

/**
 * 从 Promise.allSettled 的结果中提取值，失败时返回默认值
 * 
 * @template T 期望的返回类型
 * @param result Promise.allSettled 的结果
 * @param defaultValue 失败时返回的默认值
 * @param transform 可选的转换函数，用于将值转换为目标类型
 * @returns 成功时返回转换后的值，失败时返回默认值
 * 
 * @example
 * ```typescript
 * const [nameResult] = await Promise.allSettled([contract.name()])
 * const name = getSettledValue(nameResult, '', (v) => v as string)
 * 
 * const [decimalsResult] = await Promise.allSettled([contract.decimals()])
 * const decimals = getSettledValue(decimalsResult, 18, (v) => Number(v))
 * 
 * const [balanceResult] = await Promise.allSettled([contract.balanceOf(address)])
 * const balance = getSettledValue(balanceResult, BigInt(0), (v) => v as bigint)
 * ```
 */
export function getSettledValue<T>(
  result: PromiseSettledResult<unknown>,
  defaultValue: T,
  transform?: (value: unknown) => T
): T {
  if (result.status === 'fulfilled') {
    if (transform) {
      return transform(result.value)
    }
    return result.value as T
  }
  return defaultValue
}

/**
 * 从 Promise.allSettled 的结果中提取字符串值
 * 
 * @param result Promise.allSettled 的结果
 * @param defaultValue 失败时返回的默认值，默认为空字符串
 * @returns 成功时返回字符串值，失败时返回默认值
 */
export function getSettledString(
  result: PromiseSettledResult<unknown>,
  defaultValue: string = ''
): string {
  return getSettledValue(result, defaultValue, (v) => v as string)
}

/**
 * 从 Promise.allSettled 的结果中提取数字值
 * 
 * @param result Promise.allSettled 的结果
 * @param defaultValue 失败时返回的默认值，默认为 0
 * @returns 成功时返回数字值，失败时返回默认值
 */
export function getSettledNumber(
  result: PromiseSettledResult<unknown>,
  defaultValue: number = 0
): number {
  return getSettledValue(result, defaultValue, (v) => Number(v))
}

/**
 * 从 Promise.allSettled 的结果中提取 BigInt 值
 * 
 * @param result Promise.allSettled 的结果
 * @param defaultValue 失败时返回的默认值，默认为 BigInt(0)
 * @returns 成功时返回 BigInt 值，失败时返回默认值
 */
export function getSettledBigInt(
  result: PromiseSettledResult<unknown>,
  defaultValue: bigint = BigInt(0)
): bigint {
  return getSettledValue(result, defaultValue, (v) => v as bigint)
}

/**
 * 从 Promise.allSettled 的结果中提取布尔值
 * 
 * @param result Promise.allSettled 的结果
 * @param defaultValue 失败时返回的默认值，默认为 false
 * @returns 成功时返回布尔值，失败时返回默认值
 */
export function getSettledBoolean(
  result: PromiseSettledResult<unknown>,
  defaultValue: boolean = false
): boolean {
  return getSettledValue(result, defaultValue, (v) => Boolean(v))
}

