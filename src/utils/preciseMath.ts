/**
 * 精确数学计算工具
 * 避免 JavaScript 浮点数精度问题（如：0.1 + 0.2 !== 0.3）
 */

/**
 * 将数字字符串转换为整数（乘以 10^precision）
 * @param value 数字字符串
 * @param precision 精度（小数位数）
 * @returns BigInt
 */
function toBigInt(value: string | number, precision: number = 18): bigint {
  const str = typeof value === 'string' ? value : value.toString()
  if (!str || str === '' || str === '-') return BigInt(0)
  
  // 处理符号
  const isNegative = str.startsWith('-')
  const absStr = isNegative ? str.slice(1) : str
  
  // 处理科学计数法
  if (absStr.includes('e') || absStr.includes('E')) {
    const num = parseFloat(absStr)
    if (isNaN(num)) return BigInt(0)
    const result = BigInt(Math.floor(num * Math.pow(10, precision)))
    return isNegative ? -result : result
  }
  
  const parts = absStr.split('.')
  const integerPart = parts[0] || '0'
  const decimalPart = parts[1] || ''
  
  // 补齐小数部分到指定精度
  const paddedDecimal = decimalPart.padEnd(precision, '0').slice(0, precision)
  
  // 组合整数部分和小数部分
  const fullNumber = integerPart + paddedDecimal
  
  const result = BigInt(fullNumber)
  return isNegative ? -result : result
}

/**
 * 将 BigInt 转换回数字字符串（除以 10^precision）
 * @param value BigInt 值
 * @param precision 精度（小数位数）
 * @returns 数字字符串
 */
function fromBigInt(value: bigint, precision: number = 18): string {
  if (value === BigInt(0)) return '0'
  
  const isNegative = value < BigInt(0)
  const absValue = isNegative ? -value : value
  
  const divisor = BigInt(10) ** BigInt(precision)
  const quotient = absValue / divisor
  const remainder = absValue % divisor
  
  let result: string
  
  if (remainder === BigInt(0)) {
    result = quotient.toString()
  } else {
    // 将余数转换为小数部分
    const remainderStr = remainder.toString().padStart(precision, '0')
    // 去掉末尾的0
    const trimmedRemainder = remainderStr.replace(/0+$/, '')
    
    if (trimmedRemainder === '') {
      result = quotient.toString()
    } else {
      result = `${quotient}.${trimmedRemainder}`
    }
  }
  
  return isNegative ? '-' + result : result
}

/**
 * 精确乘法
 * @param a 被乘数（字符串或数字）
 * @param b 乘数（字符串或数字）
 * @param precision 精度（默认18位小数）
 * @returns 乘积的字符串表示
 */
export function preciseMultiply(
  a: string | number,
  b: string | number,
  precision: number = 18
): string {
  if (!a || !b) return '0'
  
  const aBigInt = toBigInt(a, precision)
  const bBigInt = toBigInt(b, precision)
  
  // 乘法：需要除以 10^precision 来保持精度
  const result = (aBigInt * bBigInt) / (BigInt(10) ** BigInt(precision))
  
  return fromBigInt(result, precision)
}

/**
 * 精确除法
 * @param a 被除数（字符串或数字）
 * @param b 除数（字符串或数字）
 * @param precision 精度（默认18位小数）
 * @returns 商的字符串表示
 */
export function preciseDivide(
  a: string | number,
  b: string | number,
  precision: number = 18
): string {
  if (!a || !b || b === '0' || b === 0) return '0'
  
  const aBigInt = toBigInt(a, precision)
  const bBigInt = toBigInt(b, precision)
  
  // 除法：需要乘以 10^precision 来保持精度
  const result = (aBigInt * (BigInt(10) ** BigInt(precision))) / bBigInt
  
  return fromBigInt(result, precision)
}

/**
 * 精确加法
 * @param a 加数（字符串或数字）
 * @param b 加数（字符串或数字）
 * @param precision 精度（默认18位小数）
 * @returns 和的字符串表示
 */
export function preciseAdd(
  a: string | number,
  b: string | number,
  precision: number = 18
): string {
  if (!a && !b) return '0'
  if (!a) return typeof b === 'string' ? b : b.toString()
  if (!b) return typeof a === 'string' ? a : a.toString()
  
  const aBigInt = toBigInt(a, precision)
  const bBigInt = toBigInt(b, precision)
  
  const result = aBigInt + bBigInt
  
  return fromBigInt(result, precision)
}

/**
 * 精确减法
 * @param a 被减数（字符串或数字）
 * @param b 减数（字符串或数字）
 * @param precision 精度（默认18位小数）
 * @returns 差的字符串表示
 */
export function preciseSubtract(
  a: string | number,
  b: string | number,
  precision: number = 18
): string {
  if (!a && !b) return '0'
  if (!a) {
    const bStr = typeof b === 'string' ? b : b.toString()
    return '-' + bStr
  }
  if (!b) return typeof a === 'string' ? a : a.toString()
  
  const aBigInt = toBigInt(a, precision)
  const bBigInt = toBigInt(b, precision)
  
  const result = aBigInt - bBigInt
  
  return fromBigInt(result, precision)
}

/**
 * 应用滑点（减少滑点百分比）
 * 例如：滑点 1% 意味着得到 99% 的金额
 * 完全使用 BigInt 计算，避免浮点数精度损失
 * 公式：result = amount * (100 - slippagePercent) / 100
 * @param amount 原始金额
 * @param slippagePercent 滑点百分比（如 0.5 表示 0.5%）
 * @param precision 精度（默认18位小数）
 * @returns 应用滑点后的金额字符串
 */
export function applySlippageDecrease(
  amount: string | number,
  slippagePercent: number,
  precision: number = 18
): string {
  if (!amount || amount === '0' || amount === 0) return '0'
  if (slippagePercent <= 0) return typeof amount === 'string' ? amount : amount.toString()
  
  // 将金额转换为 BigInt（乘以 10^precision）
  const amountBigInt = toBigInt(amount, precision)
  
  // 将滑点百分比转换为字符串，然后转换为 BigInt
  // 例如：0.5 => "0.5" => toBigInt("0.5", precision)
  const slippageStr = slippagePercent.toString()
  const slippageBigInt = toBigInt(slippageStr, precision)
  
  // 100 转换为 BigInt: 100 * 10^precision
  const hundredBigInt = BigInt(100) * (BigInt(10) ** BigInt(precision))
  
  // 计算 (100 - slippagePercent) * 10^precision
  const multiplierBigInt = hundredBigInt - slippageBigInt
  
  // 计算：amount * (100 - slippagePercent) / 100
  // = (amountBigInt * multiplierBigInt) / hundredBigInt
  // = (amount * 10^precision * (100 - slippagePercent) * 10^precision) / (100 * 10^precision)
  // = amount * (100 - slippagePercent) * 10^precision / 100
  const result = (amountBigInt * multiplierBigInt) / hundredBigInt
  
  return fromBigInt(result, precision)
}

/**
 * 应用滑点（增加滑点百分比）
 * 例如：滑点 1% 意味着需要多付出 1% 的金额
 * 完全使用 BigInt 计算，避免浮点数精度损失
 * 公式：result = amount * (100 + slippagePercent) / 100
 * @param amount 原始金额
 * @param slippagePercent 滑点百分比（如 0.5 表示 0.5%）
 * @param precision 精度（默认18位小数）
 * @returns 应用滑点后的金额字符串
 */
export function applySlippageIncrease(
  amount: string | number,
  slippagePercent: number,
  precision: number = 18
): string {
  if (!amount || amount === '0' || amount === 0) return '0'
  if (slippagePercent <= 0) return typeof amount === 'string' ? amount : amount.toString()
  
  // 将金额转换为 BigInt（乘以 10^precision）
  const amountBigInt = toBigInt(amount, precision)
  
  // 将滑点百分比转换为字符串，然后转换为 BigInt
  // 例如：0.5 => "0.5" => toBigInt("0.5", precision)
  const slippageStr = slippagePercent.toString()
  const slippageBigInt = toBigInt(slippageStr, precision)
  
  // 100 转换为 BigInt: 100 * 10^precision
  const hundredBigInt = BigInt(100) * (BigInt(10) ** BigInt(precision))
  
  // 计算 (100 + slippagePercent) * 10^precision
  const multiplierBigInt = hundredBigInt + slippageBigInt
  
  // 计算：amount * (100 + slippagePercent) / 100
  // = (amountBigInt * multiplierBigInt) / hundredBigInt
  // = (amount * 10^precision * (100 + slippagePercent) * 10^precision) / (100 * 10^precision)
  // = amount * (100 + slippagePercent) * 10^precision / 100
  const result = (amountBigInt * multiplierBigInt) / hundredBigInt
  
  return fromBigInt(result, precision)
}

