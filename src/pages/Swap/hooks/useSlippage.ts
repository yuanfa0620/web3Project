import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { getSlippage, setSlippage, getExpertMode, setExpertMode } from '@/utils/slippageStorage'

// 默认滑点值（百分比）
const DEFAULT_SLIPPAGE = 0.5

// 常用滑点选项（百分比）
export const SLIPPAGE_PRESETS = [0.1, 0.5, 1, 3] as const

export const useSlippage = () => {
  const { t } = useTranslation()
  const [slippage, setSlippageValue] = useState<number>(DEFAULT_SLIPPAGE)
  const [expertMode, setExpertModeValue] = useState<boolean>(false)
  const [customSlippage, setCustomSlippage] = useState<string>('')

  // 初始化：从缓存加载
  useEffect(() => {
    const cachedSlippage = getSlippage()
    const cachedExpertMode = getExpertMode()
    setSlippageValue(cachedSlippage)
    setExpertModeValue(cachedExpertMode)
    if (cachedSlippage !== DEFAULT_SLIPPAGE && !SLIPPAGE_PRESETS.includes(cachedSlippage as any)) {
      setCustomSlippage(cachedSlippage.toString())
    }
  }, [])

  // 设置预设滑点
  const setPresetSlippage = useCallback((value: number) => {
    setSlippageValue(value)
    setSlippage(value)
    setCustomSlippage('')
  }, [])

  // 设置自定义滑点
  const setCustomSlippageValue = useCallback((value: string) => {
    setCustomSlippage(value)
    const numValue = parseFloat(value)
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
      setSlippageValue(numValue)
      setSlippage(numValue)
    }
  }, [])

  // 切换专家模式
  const toggleExpertMode = useCallback((enabled: boolean) => {
    setExpertModeValue(enabled)
    setExpertMode(enabled)
  }, [])

  // 获取滑点警告级别
  const getSlippageWarning = useCallback((): { level: 'none' | 'low' | 'medium' | 'high'; message: string } => {
    if (expertMode) {
      return { level: 'none', message: '' }
    }

    if (slippage >= 10) {
      return {
        level: 'high',
        message: t('swap.slippageSettings.warning.high'),
      }
    } else if (slippage >= 5) {
      return {
        level: 'high',
        message: t('swap.slippageSettings.warning.high'),
      }
    } else if (slippage >= 3) {
      return {
        level: 'medium',
        message: t('swap.slippageSettings.warning.medium'),
      }
    } else if (slippage >= 1) {
      return {
        level: 'low',
        message: t('swap.slippageSettings.warning.low'),
      }
    }

    return { level: 'none', message: '' }
  }, [slippage, expertMode, t])

  return {
    slippage,
    expertMode,
    customSlippage,
    setPresetSlippage,
    setCustomSlippageValue,
    toggleExpertMode,
    getSlippageWarning,
  }
}

