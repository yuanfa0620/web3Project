import React, { useMemo, useRef, useEffect } from 'react'
import CountUp from 'react-countup'
import { Spin } from 'antd'

export interface AnimatedNumberProps {
  /**
   * 要显示的数字值（字符串格式，支持小数）
   */
  value: string | number | null | undefined
  /**
   * 后缀文本（如代币符号）
   */
  suffix?: string
  /**
   * 前缀文本
   */
  prefix?: string
  /**
   * 是否正在加载
   */
  loading?: boolean
  /**
   * 加载时显示的占位符
   */
  loadingPlaceholder?: string
  /**
   * 默认值（当 value 为空时显示）
   */
  defaultValue?: string
  /**
   * 小数位数
   */
  decimals?: number
  /**
   * 是否启用动画
   */
  enableAnimation?: boolean
  /**
   * 动画持续时间（秒）
   */
  duration?: number
  /**
   * 自定义样式类名
   */
  className?: string
  /**
   * 自定义样式
   */
  style?: React.CSSProperties
}

/**
 * 数字跳动动画组件
 * 用于显示代币余额等数字，支持平滑的数字跳动动画
 */
export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  suffix,
  prefix,
  loading = false,
  loadingPlaceholder = '...',
  defaultValue = '0.00',
  decimals = 2,
  enableAnimation = true,
  duration = 1.5,
  className,
  style,
}) => {
  // 保存上一次的值，用于动画起始值
  const prevValueRef = useRef<number | null>(null)

  // 解析数字值
  const numericValue = useMemo(() => {
    if (loading) return null
    if (value === null || value === undefined || value === '') return null
    
    const numValue = typeof value === 'string' ? parseFloat(value) : value
    if (isNaN(numValue)) return null
    
    return numValue
  }, [value, loading])

  // 更新上一次的值
  useEffect(() => {
    if (numericValue !== null) {
      prevValueRef.current = numericValue
    }
  }, [numericValue])

  // 格式化显示值
  const displayValue = useMemo(() => {
    if (loading) return loadingPlaceholder
    if (numericValue === null) return defaultValue
    
    return numericValue.toFixed(decimals)
  }, [numericValue, loading, loadingPlaceholder, defaultValue, decimals])

  // 如果正在加载，显示加载状态
  if (loading) {
    return (
      <span className={className} style={style}>
        {prefix}
        <Spin size="small" style={{ margin: '0 4px' }} />
        {suffix}
      </span>
    )
  }

  // 如果没有有效值，显示默认值
  if (numericValue === null) {
    return (
      <span className={className} style={style}>
        {prefix}
        {displayValue}
        {suffix && ` ${suffix}`}
      </span>
    )
  }

  // 如果禁用动画或值为0，直接显示
  if (!enableAnimation || numericValue === 0) {
    return (
      <span className={className} style={style}>
        {prefix}
        {displayValue}
        {suffix && ` ${suffix}`}
      </span>
    )
  }

  // 使用 CountUp 显示动画
  const startValue = prevValueRef.current !== null ? prevValueRef.current : 0
  
  return (
    <span className={className} style={style}>
      {prefix}
      <CountUp
        start={startValue}
        end={numericValue}
        decimals={decimals}
        duration={duration}
        separator=","
        decimal="."
        preserveValue
      />
      {suffix && ` ${suffix}`}
    </span>
  )
}

export default AnimatedNumber

