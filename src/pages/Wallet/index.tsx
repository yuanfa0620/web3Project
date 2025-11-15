import React, { useState } from 'react'
import { Card, Row, Col, Typography, Button, Space, Tag, Divider, Spin } from 'antd'
import { CopyOutlined, QrcodeOutlined, SendOutlined, SwapOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { PageTitle } from '@/components/PageTitle'
import { useWallet } from '@/hooks/useWallet'
import { useNetworkInfo } from '@/hooks/useNetworkInfo'
import { CHAIN_INFO } from '@/constants/chains'
import { AnimatedNumber } from '@/components/AnimatedNumber'
import ReceiveModal from './components/ReceiveModal'
import SendToken from './components/SendToken'
import styles from './index.module.less'

const { Title, Text, Paragraph } = Typography

const WalletPage: React.FC = () => {
  const { t } = useTranslation()
  const { address, chainId, isConnected, balance } = useWallet()
  const [receiveModalVisible, setReceiveModalVisible] = useState(false)
  const [sendTokenVisible, setSendTokenVisible] = useState(false)

  // 获取网络信息（区块高度和 Gas 价格）
  const { blockNumber, gasPrice, blockNumberLoading, gasPriceLoading } = useNetworkInfo(chainId)

  // 根据链 ID 获取代币符号
  const tokenSymbol = chainId
    ? (CHAIN_INFO[chainId as keyof typeof CHAIN_INFO]?.symbol || 'ETH')
    : 'ETH'

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
                  <AnimatedNumber
                    value={balance}
                    suffix={tokenSymbol}
                    defaultValue="0.00"
                    decimals={2}
                    enableAnimation={true}
                  />
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
                  onClick={() => setSendTokenVisible(true)}
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
        <ReceiveModal
          open={receiveModalVisible}
          onCancel={() => setReceiveModalVisible(false)}
          address={address || undefined}
          chainId={chainId || undefined}
        />

        {/* 发送代币弹窗 */}
        <SendToken
          open={sendTokenVisible}
          onCancel={() => setSendTokenVisible(false)}
          chainId={chainId || undefined}
          address={address || undefined}
        />
      </div>
    </PageTitle>
  )
}

export default WalletPage
