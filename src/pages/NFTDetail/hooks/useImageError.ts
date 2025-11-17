/**
 * 图片加载错误处理 Hook
 */
import { useState, useEffect } from 'react'

export const useImageError = (resetKey?: string | number) => {
  const [imageError, setImageError] = useState(false)

  // 当 resetKey 改变时重置错误状态
  useEffect(() => {
    setImageError(false)
  }, [resetKey])

  return {
    imageError,
    setImageError,
  }
}

