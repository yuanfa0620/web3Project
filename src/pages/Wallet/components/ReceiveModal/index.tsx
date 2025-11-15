import React, { useRef } from 'react'
import { Modal, Button, Alert, Typography, Tag, QRCode, message } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { CHAIN_INFO } from '@/constants/chains'
import styles from './index.module.less'

const { Text } = Typography

interface ReceiveModalProps {
  open: boolean
  onCancel: () => void
  address?: string
  chainId?: number
}

const ReceiveModal: React.FC<ReceiveModalProps> = ({ open, onCancel, address, chainId }) => {
  const { t } = useTranslation()
  const qrCodeRef = useRef<HTMLDivElement>(null)

  // 下载二维码
  const handleDownloadQR = () => {
    if (!qrCodeRef.current || !address) return

    const canvas = qrCodeRef.current.querySelector('canvas')
    if (!canvas) return

    // 将 canvas 转换为图片并下载
    canvas.toBlob((blob) => {
      if (!blob) return
      const downloadUrl = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = `wallet-qrcode-${address.slice(0, 8)}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(downloadUrl)
      message.success(t('wallet.receiveModal.downloadSuccess'))
    })
  }

  const networkName = chainId
    ? (CHAIN_INFO[chainId as keyof typeof CHAIN_INFO]?.name || `Chain ${chainId}`)
    : 'Unknown'

  return (
    <Modal
      title={t('wallet.receiveModal.title')}
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="download" type="primary" icon={<DownloadOutlined />} onClick={handleDownloadQR}>
          {t('wallet.receiveModal.downloadQR')}
        </Button>,
        <Button key="close" onClick={onCancel}>
          {t('common.close')}
        </Button>,
      ]}
      width={400}
    >
      <div className={styles.receiveModalContent}>
        <Alert
          message={t('wallet.receiveModal.networkWarning')}
          type="warning"
          showIcon
        />

        <div className={styles.networkInfo}>
          <Text strong>{t('wallet.receiveModal.currentNetwork')}: </Text>
          <Tag color="blue">{networkName}</Tag>
        </div>

        <div className={styles.qrCodeContainer} ref={qrCodeRef}>
          {address && (
            <QRCode
              value={address}
              size={256}
              errorLevel="H"
              status="active"
            />
          )}
        </div>
      </div>
    </Modal>
  )
}

export default ReceiveModal

