import React from 'react'
import { Card, Row, Col, Statistic, Typography, Button, Space } from 'antd'
import { WalletOutlined, SwapOutlined, TrophyOutlined, RiseOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import homeStats from 'mock/homeStats.json'
import { useWallet } from '@/hooks/useWallet'
import { CHAIN_INFO } from '@/config/network'
import { PageTitle } from '@/components/PageTitle'
import { AnimatedNumber } from '@/components/AnimatedNumber'
import styles from './index.module.less'

const { Title, Paragraph } = Typography

const HomePage: React.FC = () => {
  const { t } = useTranslation()
  const { isConnected, address, balance, chainId } = useWallet()

  // 根据链 ID 获取代币符号
  const tokenSymbol = chainId 
    ? (CHAIN_INFO[chainId as keyof typeof CHAIN_INFO]?.symbol || 'ETH')
    : 'ETH'

  const iconMap: Record<string, React.ReactNode> = {
    WalletOutlined: <WalletOutlined />,
    SwapOutlined: <SwapOutlined />,
    TrophyOutlined: <TrophyOutlined />,
    RiseOutlined: <RiseOutlined />,
  }

  const stats = homeStats.map((s: any) => {
    const isBalanceStat = s.title === '总资产'
    // 如果是总资产且已连接钱包，使用实际余额；否则使用 mock 数据
    const displayValue = isBalanceStat 
      ? (isConnected && balance ? balance : s.value)
      : s.value
    
    // 如果是总资产，使用当前网络的主网币符号；否则使用原来的 suffix
    const suffix = isBalanceStat ? tokenSymbol : s.suffix
    
    // 确定小数位数：总资产和收益率使用2位小数，其他使用0位小数
    const decimals = isBalanceStat || s.suffix === '%' ? 2 : 0
    
    return {
      ...s,
      displayValue,
      suffix,
      decimals,
      icon: iconMap[s.icon] || null,
    }
  })

  return (
    <PageTitle title={t('pageTitle.home')}>
      <div className={styles.homePage}>
        <div className={styles.hero}>
          <Title level={1} className={styles.heroTitle}>
            {t('home.title')}
          </Title>
          <Paragraph className={styles.heroDescription}>
            {t('home.description')}
          </Paragraph>
          {!isConnected && (
            <Space size="large">
              <Button type="primary" size="large">
                {t('home.connectWallet')}
              </Button>
              <Button size="large">
                {t('home.learnMore')}
              </Button>
            </Space>
          )}
        </div>

        <div className={styles.statsSection}>
          <Title level={2} className={styles.sectionTitle}>
            {t('home.assetOverview')}
          </Title>
          <Row gutter={[24, 24]}>
            {stats.map((stat, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <Card className={styles.statCard}>
                  <div className={styles.statisticWrapper}>
                    <div
                      className={styles.statIcon}
                      style={{ color: stat.color }}
                    >
                      {stat.icon}
                    </div>
                    <div className={styles.statisticContent}>
                      <div className={styles.statisticTitle}>{stat.title}</div>
                      <div className={styles.statisticValue}>
                        <AnimatedNumber
                          value={stat.displayValue}
                          suffix={stat.suffix}
                          defaultValue={typeof stat.displayValue === 'number' ? stat.displayValue.toString() : stat.displayValue || "0"}
                          decimals={stat.decimals}
                          enableAnimation={true}
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        <div className={styles.featuresSection}>
          <Title level={2} className={styles.sectionTitle}>
            {t('home.mainFeatures')}
          </Title>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              <Card className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <WalletOutlined />
                </div>
                <Title level={4}>{t('home.walletManagement.title')}</Title>
                <Paragraph>
                  {t('home.walletManagement.description')}
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <SwapOutlined />
                </div>
                <Title level={4}>{t('home.tokenTrading.title')}</Title>
                <Paragraph>
                  {t('home.tokenTrading.description')}
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <TrophyOutlined />
                </div>
                <Title level={4}>{t('home.nftCollection.title')}</Title>
                <Paragraph>
                  {t('home.nftCollection.description')}
                </Paragraph>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </PageTitle>
  )
}

export default HomePage
