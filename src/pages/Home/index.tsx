import React from 'react'
import { Card, Row, Col, Statistic, Typography, Button, Space } from 'antd'
import { WalletOutlined, SwapOutlined, TrophyOutlined, RiseOutlined } from '@ant-design/icons'
import homeStats from 'mock/homeStats.json'
import { useWallet } from '@/hooks/useWallet'
import styles from './index.module.less'

const { Title, Paragraph } = Typography

const HomePage: React.FC = () => {
  const { isConnected, address, balance } = useWallet()

  const iconMap: Record<string, React.ReactNode> = {
    WalletOutlined: <WalletOutlined />,
    SwapOutlined: <SwapOutlined />,
    TrophyOutlined: <TrophyOutlined />,
    RiseOutlined: <RiseOutlined />,
  }

  const stats = homeStats.map((s: any) => ({
    ...s,
    // 如果是总资产，优先展示实时余额
    value: s.title === '总资产' ? (balance || s.value) : s.value,
    icon: iconMap[s.icon] || null,
  }))

  return (
    <div className={styles.homePage}>
      <div className={styles.hero}>
        <Title level={1} className={styles.heroTitle}>
          欢迎使用 Web3
        </Title>
        <Paragraph className={styles.heroDescription}>
          专业的区块链管理平台，提供钱包管理、代币交易、NFT 收藏等一站式服务。
        </Paragraph>
        {!isConnected && (
          <Space size="large">
            <Button type="primary" size="large">
              连接钱包
            </Button>
            <Button size="large">
              了解更多
            </Button>
          </Space>
        )}
      </div>

      <div className={styles.statsSection}>
        <Title level={2} className={styles.sectionTitle}>
          资产概览
        </Title>
        <Row gutter={[24, 24]}>
          {stats.map((stat, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <Card className={styles.statCard}>
                <Statistic
                  title={stat.title}
                  value={stat.value}
                  suffix={stat.suffix}
                  prefix={
                    <div 
                      className={styles.statIcon}
                      style={{ color: stat.color }}
                    >
                      {stat.icon}
                    </div>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      <div className={styles.featuresSection}>
        <Title level={2} className={styles.sectionTitle}>
          主要功能
        </Title>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={8}>
            <Card className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <WalletOutlined />
              </div>
              <Title level={4}>钱包管理</Title>
              <Paragraph>
                安全可靠的多链钱包管理，支持主流区块链网络，轻松管理您的数字资产。
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <SwapOutlined />
              </div>
              <Title level={4}>代币交易</Title>
              <Paragraph>
                便捷的代币交易功能，支持多种交易对，实时价格更新，交易更高效。
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <TrophyOutlined />
              </div>
              <Title level={4}>NFT 收藏</Title>
              <Paragraph>
                展示和管理您的 NFT 收藏，支持多种 NFT 标准，收藏更有序。
              </Paragraph>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default HomePage
