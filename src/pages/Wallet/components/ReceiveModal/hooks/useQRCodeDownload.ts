import { useRef, useCallback } from 'react'
import { getMessage } from '@/utils/message'
import { useTranslation } from 'react-i18next'

/**
 * 二维码下载 Hook
 */
export const useQRCodeDownload = (address?: string) => {
  const { t } = useTranslation()
  const qrCodeRef = useRef<HTMLDivElement>(null)

  // 下载二维码
  const handleDownloadQR = useCallback(() => {
    if (!qrCodeRef.current || !address) {
      return
    }

    const canvas = qrCodeRef.current.querySelector('canvas')
    if (!canvas) {
      return
    }

    // 将 canvas 转换为图片并下载
    canvas.toBlob((blob) => {
      if (!blob) {
        return
      }

      const downloadUrl = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = `wallet-qrcode-${address.slice(0, 8)}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(downloadUrl)
      getMessage().success(t('wallet.receiveModal.downloadSuccess'))
    })
  }, [address, t])

  return {
    qrCodeRef,
    handleDownloadQR,
  }
}

