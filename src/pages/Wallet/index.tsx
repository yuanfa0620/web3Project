import React, { useState, useRef } from 'react'
import { Card, Row, Col, Typography, Button, Space, Tag, Divider, Modal, Alert, message, QRCode, Spin } from 'antd'
import { CopyOutlined, QrcodeOutlined, SendOutlined, SwapOutlined, DownloadOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { PageTitle } from '@/components/PageTitle'
import { useWallet } from '@/hooks/useWallet'
import { useNetworkInfo } from '@/hooks/useNetworkInfo'
import { CHAIN_INFO } from '@/constants/chains'
import styles from './index.module.less'

const { Title, Text, Paragraph } = Typography

const WalletPage: React.FC = () => {
  const { t } = useTranslation()
  const { address, chainId, isConnected, balance } = useWallet()
  const [receiveModalVisible, setReceiveModalVisible] = useState(false)
  const qrCodeRef = useRef<HTMLDivElement>(null)

  // 获取网络信息（区块高度和 Gas 价格）
  const { blockNumber, gasPrice, blockNumberLoading, gasPriceLoading } = useNetworkInfo(chainId)

  // 根据链 ID 获取代币符号
  const tokenSymbol = chainId 
    ? (CHAIN_INFO[chainId as keyof typeof CHAIN_INFO]?.symbol || 'ETH')
    : 'ETH'

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

  if (!isConnected) {
    return (
      <PageTitle title={t('pageTitle.wallet')}>
        <div className={styles.walletPage}>
          <Card className={styles.connectCard}>
            <div className={styles.connectContent}>
              <Title level={2}>{t('wallet.connectWallet')}</Title>
              <Paragraph>
                {t('wallet.connectWalletDescription')}
              </Paragraph>
            </div>
          </Card>
        </div>
      </PageTitle>
    )
  }

  return (
    <PageTitle title={t('pageTitle.wallet')}>
      <div className={styles.walletPage}>
        <Title level={2} className={styles.pageTitle}>
          {t('wallet.title')}
        </Title>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <Card title={t('wallet.assetOverview')} className={styles.assetCard}>
              <div className={styles.balanceSection}>
                <Text className={styles.balanceLabel}>{t('wallet.totalBalance')}</Text>
                <Title level={1} className={styles.balanceValue}>
                  {balance || '0.00'} {tokenSymbol}
                </Title>
              </div>
              
              <Divider />
              
              <div className={styles.addressSection}>
                <Text strong>{t('wallet.address')}</Text>
                <div className={styles.addressContainer}>
                  <Text code className={styles.addressText}>
                    {address}
                  </Text>
                  <Button 
                    type="text" 
                    icon={<CopyOutlined />}
                    onClick={() => navigator.clipboard.writeText(address || '')}
                  >
                    {t('common.copy')}
                  </Button>
                </div>
              </div>

              <div className={styles.chainSection}>
                <Text strong>{t('wallet.currentNetwork')}</Text>
                <div className={styles.chainInfo}>
                  <Tag color="blue">
                    Chain ID: {chainId}
                  </Tag>
                </div>
              </div>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card title={t('wallet.quickActions')} className={styles.actionCard}>
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <Button 
                  type="primary" 
                  block 
                  size="large"
                  icon={<SendOutlined />}
                >
                  {t('wallet.send')}
                </Button>
                <Button 
                  block 
                  size="large"
                  icon={<SwapOutlined />}
                >
                  {t('wallet.swap')}
                </Button>
                <Button 
                  block 
                  size="large"
                  icon={<QrcodeOutlined />}
                  onClick={() => setReceiveModalVisible(true)}
                >
                  {t('wallet.receive')}
                </Button>
              </Space>
            </Card>

            <Card title={t('wallet.networkInfo')} className={styles.networkCard}>
              <div className={styles.networkInfo}>
                <div className={styles.networkItem}>
                  <Text>{t('wallet.networkStatus')}</Text>
                  <Tag color="green">{t('wallet.connected')}</Tag>
                </div>
                <div className={styles.networkItem}>
                  <Text>{t('wallet.blockHeight')}</Text>
                  {blockNumberLoading ? (
                    <Spin size="small" />
                  ) : (
                    <Text>{blockNumber}</Text>
                  )}
                </div>
                <div className={styles.networkItem}>
                  <Text>{t('wallet.gasPrice')}</Text>
                  {gasPriceLoading ? (
                    <Spin size="small" />
                  ) : (
                    <Text>{gasPrice}</Text>
                  )}
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* 收款码弹窗 */}
        <Modal
          title={t('wallet.receiveModal.title')}
          open={receiveModalVisible}
          onCancel={() => setReceiveModalVisible(false)}
          footer={[
            <Button key="download" type="primary" icon={<DownloadOutlined />} onClick={handleDownloadQR}>
              {t('wallet.receiveModal.downloadQR')}
            </Button>,
            <Button key="close" onClick={() => setReceiveModalVisible(false)}>
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
              style={{ marginBottom: 24, borderRadius: '8px' }}
            />
            
            <div className={styles.networkInfo}>
              <Text strong>{t('wallet.receiveModal.currentNetwork')}: </Text>
              <Tag color="blue">
                {chainId ? (CHAIN_INFO[chainId as keyof typeof CHAIN_INFO]?.name || `Chain ${chainId}`) : 'Unknown'}
              </Tag>
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

            <div className={styles.addressInfo}>
              <Text strong>{t('wallet.receiveModal.walletAddress')}</Text>
              <div className={styles.addressContainer}>
                <Text code className={styles.addressText}>
                  {address}
                </Text>
                <Button 
                  type="text" 
                  icon={<CopyOutlined />}
                  onClick={() => {
                    navigator.clipboard.writeText(address || '')
                    message.success(t('common.copy') + ' ' + t('common.success'))
                  }}
                >
                  {t('common.copy')}
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </PageTitle>
  )
}

export default WalletPage
