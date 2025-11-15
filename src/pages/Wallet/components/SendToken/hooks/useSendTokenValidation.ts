import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { createAddressValidator, createAmountValidator, createTokenAddressValidator } from '@/utils/validation'

interface UseSendTokenValidationParams {
  tokenBalance: string
  address?: string
  onTokenAddressChange: (address: string) => void
}

/**
 * SendToken 组件的表单验证 Hook
 */
export const useSendTokenValidation = ({
  tokenBalance,
  address,
  onTokenAddressChange,
}: UseSendTokenValidationParams) => {
  const { t } = useTranslation()

  // 创建验证器
  const validateAmount = useMemo(
    () => createAmountValidator(t, tokenBalance),
    [t, tokenBalance]
  )

  const validateAddress = useMemo(
    () => createAddressValidator(t, address),
    [t, address]
  )

  const validateTokenAddress = useMemo(
    () => createTokenAddressValidator(t, onTokenAddressChange),
    [t, onTokenAddressChange]
  )

  return {
    validateAmount,
    validateAddress,
    validateTokenAddress,
  }
}

