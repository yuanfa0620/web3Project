import React from 'react'
import { Card, Row, Col, Typography, Button, Space, Tag, Divider } from 'antd'
import { CopyOutlined, QrcodeOutlined, SendOutlined, SwapOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { PageTitle } from '@/components/PageTitle'
import { useWallet } from '@/hooks/useWallet'
import styles from './index.module.less'

const { Title, Text, Paragraph } = Typography

const WalletPage: React.FC = () => {
  const { t } = useTranslation()
  const { address, chainId, isConnected, balance } = useWallet()

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
                  {balance || '0.00'} ETH
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
                  <Text>18,234,567</Text>
                </div>
                <div className={styles.networkItem}>
                  <Text>{t('wallet.gasPrice')}</Text>
                  <Text>20 Gwei</Text>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </PageTitle>
  )
}

export default WalletPage
