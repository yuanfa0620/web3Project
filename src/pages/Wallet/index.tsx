import React from 'react'
import { Card, Row, Col, Typography, Button, Space, Tag, Divider } from 'antd'
import { CopyOutlined, QrcodeOutlined, SendOutlined, SwapOutlined } from '@ant-design/icons'
import { useWallet } from '@/hooks/useWallet'
import styles from './index.module.less'

const { Title, Text, Paragraph } = Typography

const WalletPage: React.FC = () => {
  const { address, chainId, isConnected, balance } = useWallet()

  if (!isConnected) {
    return (
      <div className={styles.walletPage}>
        <Card className={styles.connectCard}>
          <div className={styles.connectContent}>
            <Title level={2}>连接钱包</Title>
            <Paragraph>
              请先连接您的钱包以查看资产信息
            </Paragraph>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className={styles.walletPage}>
      <Title level={2} className={styles.pageTitle}>
        钱包管理
      </Title>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card title="资产概览" className={styles.assetCard}>
            <div className={styles.balanceSection}>
              <Text className={styles.balanceLabel}>总余额</Text>
              <Title level={1} className={styles.balanceValue}>
                {balance || '0.00'} ETH
              </Title>
            </div>
            
            <Divider />
            
            <div className={styles.addressSection}>
              <Text strong>钱包地址</Text>
              <div className={styles.addressContainer}>
                <Text code className={styles.addressText}>
                  {address}
                </Text>
                <Button 
                  type="text" 
                  icon={<CopyOutlined />}
                  onClick={() => navigator.clipboard.writeText(address || '')}
                >
                  复制
                </Button>
              </div>
            </div>

            <div className={styles.chainSection}>
              <Text strong>当前网络</Text>
              <div className={styles.chainInfo}>
                <Tag color="blue">
                  Chain ID: {chainId}
                </Tag>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="快速操作" className={styles.actionCard}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Button 
                type="primary" 
                block 
                size="large"
                icon={<SendOutlined />}
              >
                发送
              </Button>
              <Button 
                block 
                size="large"
                icon={<SwapOutlined />}
              >
                兑换
              </Button>
              <Button 
                block 
                size="large"
                icon={<QrcodeOutlined />}
              >
                收款码
              </Button>
            </Space>
          </Card>

          <Card title="网络信息" className={styles.networkCard}>
            <div className={styles.networkInfo}>
              <div className={styles.networkItem}>
                <Text>网络状态</Text>
                <Tag color="green">已连接</Tag>
              </div>
              <div className={styles.networkItem}>
                <Text>区块高度</Text>
                <Text>18,234,567</Text>
              </div>
              <div className={styles.networkItem}>
                <Text>Gas 价格</Text>
                <Text>20 Gwei</Text>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default WalletPage
