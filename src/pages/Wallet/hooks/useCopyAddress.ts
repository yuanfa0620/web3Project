import { useCallback } from 'react'
import { message } from 'antd'
import { useTranslation } from 'react-i18next'
import { copyToClipboard } from '@/utils/clipboard'

/**
 * 地址复制功能 Hook
 */
export const useCopyAddress = () => {
  const { t } = useTranslation()

  const handleCopyAddress = useCallback(async (address: string) => {
    if (!address) {
      return
    }

    const success = await copyToClipboard(address)
    if (success) {
      message.success(t('common.copySuccess'))
    } else {
      message.error(t('common.copyFailed'))
    }
  }, [t])

  return {
    handleCopyAddress,
  }
}

