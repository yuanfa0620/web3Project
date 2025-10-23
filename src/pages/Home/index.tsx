import React from 'react'
import { Card, Row, Col, Statistic, Typography, Button, Space } from 'antd'
import { WalletOutlined, SwapOutlined, TrophyOutlined, RiseOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import homeStats from 'mock/homeStats.json'
import { useWallet } from '@/hooks/useWallet'
import { PageTitle } from '@/components/PageTitle'
import styles from './index.module.less'

const { Title, Paragraph } = Typography

const HomePage: React.FC = () => {
  const { t } = useTranslation()
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
