import React from 'react'
import { Layout, Typography, Space, Divider } from 'antd'
import { GithubOutlined, TwitterOutlined, DiscordOutlined } from '@ant-design/icons'
import styles from './index.module.less'

const { Footer: AntFooter } = Layout
const { Text, Link } = Typography

export const Footer: React.FC = () => {
  return (
    <AntFooter className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerMain}>
          <div className={styles.footerSection}>
            <Text strong className={styles.footerTitle}>
              Web3
            </Text>
            <Text className={styles.footerDescription}>
              专业的区块链管理平台，提供钱包管理、代币交易、NFT 收藏等一站式服务。
            </Text>
          </div>

          <div className={styles.footerSection}>
            <Text strong className={styles.footerTitle}>
              产品
            </Text>
            <Space direction="vertical" size="small">
              <Link href="#" className={styles.footerLink}>
                钱包管理
              </Link>
              <Link href="#" className={styles.footerLink}>
                代币交易
              </Link>
              <Link href="#" className={styles.footerLink}>
                NFT 收藏
              </Link>
              <Link href="#" className={styles.footerLink}>
                DeFi 协议
              </Link>
            </Space>
          </div>

          <div className={styles.footerSection}>
            <Text strong className={styles.footerTitle}>
              支持
            </Text>
            <Space direction="vertical" size="small">
              <Link href="#" className={styles.footerLink}>
                帮助中心
              </Link>
              <Link href="#" className={styles.footerLink}>
                文档
              </Link>
              <Link href="#" className={styles.footerLink}>
                联系我们
              </Link>
              <Link href="#" className={styles.footerLink}>
                状态页面
              </Link>
            </Space>
          </div>

          <div className={styles.footerSection}>
            <Text strong className={styles.footerTitle}>
              社区
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
            © 2024 Web3. All rights reserved.
          </Text>
          <Space size="large">
            <Link href="#" className={styles.footerLink}>
              隐私政策
            </Link>
            <Link href="#" className={styles.footerLink}>
              服务条款
            </Link>
            <Link href="#" className={styles.footerLink}>
              Cookie 政策
            </Link>
          </Space>
        </div>
      </div>
    </AntFooter>
  )
}
