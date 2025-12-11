import React from 'react'
import { Layout, Typography, Space, Divider, Flex } from 'antd'
import { GithubOutlined, TwitterOutlined, DiscordOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import styles from './index.module.less'

const { Footer: AntFooter } = Layout
const { Text, Link } = Typography

export const Footer: React.FC = () => {
  const { t } = useTranslation()

  return (
    <AntFooter className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerMain}>
          <div className={styles.footerSection}>
            <Text strong className={styles.footerTitle}>
              Web3
            </Text>
            <Text className={styles.footerDescription}>
              {t('footer.description')}
            </Text>
          </div>

          <div className={styles.footerSection}>
            <Text strong className={styles.footerTitle}>
              {t('footer.products')}
            </Text>
            <Flex vertical gap="small">
              <Link href="#" className={styles.footerLink}>
                {t('footer.walletManagement')}
              </Link>
              <Link href="#" className={styles.footerLink}>
                {t('footer.tokenTrading')}
              </Link>
              <Link href="#" className={styles.footerLink}>
                {t('footer.nftCollection')}
              </Link>
              <Link href="#" className={styles.footerLink}>
                {t('footer.defiProtocols')}
              </Link>
            </Flex>
          </div>

          <div className={styles.footerSection}>
            <Text strong className={styles.footerTitle}>
              {t('footer.support')}
            </Text>
            <Flex vertical gap="small">
              <Link href="#" className={styles.footerLink}>
                {t('footer.helpCenter')}
              </Link>
              <Link href="#" className={styles.footerLink}>
                {t('footer.documentation')}
              </Link>
              <Link href="#" className={styles.footerLink}>
                {t('footer.contactUs')}
              </Link>
              <Link href="#" className={styles.footerLink}>
                {t('footer.statusPage')}
              </Link>
            </Flex>
          </div>

          <div className={styles.footerSection}>
            <Text strong className={styles.footerTitle}>
              {t('footer.community')}
            </Text>
            <Space size="large">
              <Link href="#" className={styles.socialLink}>
                <GithubOutlined />
              </Link>
              <Link href="#" className={styles.socialLink}>
                <TwitterOutlined />
              </Link>
              <Link href="#" className={styles.socialLink}>
                <DiscordOutlined />
              </Link>
            </Space>
          </div>
        </div>

        <Divider className={styles.divider} />

        <div className={styles.footerBottom}>
          <Text className={styles.copyright}>
            {t('footer.copyright')}
          </Text>
          <Space size="large">
            <Link href="#" className={styles.footerLink}>
              {t('footer.privacyPolicy')}
            </Link>
            <Link href="#" className={styles.footerLink}>
              {t('footer.termsOfService')}
            </Link>
            <Link href="#" className={styles.footerLink}>
              {t('footer.cookiePolicy')}
            </Link>
          </Space>
        </div>
      </div>
    </AntFooter>
  )
}

