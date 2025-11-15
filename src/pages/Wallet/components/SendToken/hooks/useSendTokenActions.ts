import { useCallback } from 'react'
import type { FormInstance } from 'antd'
import type { TokenType } from './useSendTokenState'

interface UseSendTokenActionsParams {
  tokenType: TokenType
  tokenBalance: string
  form: FormInstance
}

/**
 * SendToken 组件的操作逻辑 Hook
 */
export const useSendTokenActions = ({
  tokenType,
  tokenBalance,
  form,
}: UseSendTokenActionsParams) => {
  // 填充最大余额
  const handleMax = useCallback(() => {
    if (tokenBalance && parseFloat(tokenBalance) > 0) {
      // 对于主网币，需要保留一些作为gas费
      if (tokenType === 'native') {
        const maxAmount = (parseFloat(tokenBalance) * 0.99).toFixed(6)
        form.setFieldsValue({ amount: maxAmount })
      } else {
        form.setFieldsValue({ amount: tokenBalance })
      }
    }
  }, [tokenType, tokenBalance, form])

  return {
    handleMax,
  }
}

