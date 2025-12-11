import React from 'react'
import { Modal, Button, Alert, Typography, Tag, QRCode } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useQRCodeDownload } from './hooks/useQRCodeDownload'
import { useNetworkInfo } from './hooks/useNetworkInfo'
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

  // 二维码下载
  const { qrCodeRef, handleDownloadQR } = useQRCodeDownload(address)

  // 网络信息
  const { networkName } = useNetworkInfo(chainId)

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
          description={t('wallet.receiveModal.networkWarning')}
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
