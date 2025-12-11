import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { copyToClipboard } from '@/utils/clipboard'
import { getMessage } from '@/utils/message'

/**
 * 地址复制功能 Hook
 */
export const useCopyAddress = () => {
  const { t } = useTranslation()
  const message = getMessage()

  const handleCopyAddress = useCallback(async (address: string) => {
    if (!address) {
      return false
    }

    const success = await copyToClipboard(address)
    if (success) {
      message.success(t('common.copySuccess'))
    } else {
      message.error(t('common.copyFailed'))
    }
    return success
  }, [t])

  return {
    handleCopyAddress,
  }
}

