/**
 * NFT详情页面
 */
import React from 'react'
import { Card, Typography, Empty, Spin, Alert, Space } from 'antd'
import { useTranslation } from 'react-i18next'
import { useAccount } from 'wagmi'
import { useParams } from 'react-router-dom'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { PageTitle } from '@/components/PageTitle'
import { useNFTMetadata } from '../Profile/Assets/NFT/hooks/useNFTMetadata'
import { useImageError } from './hooks/useImageError'
import { NFTInfoCard, TransactionTable } from './components'
import { PLACEHOLDER_IMAGE } from './constants'
import styles from './index.module.less'

const { Text } = Typography

const NFTDetailPage: React.FC = () => {
  const { t } = useTranslation()
  const { nftId } = useParams<{ nftId: string }>()
  const { address, isConnected } = useAccount()
  const { nft, loading, error, refetch } = useNFTMetadata({ 
    nftId, 
    address: address || undefined 
  })
  const { imageError, setImageError } = useImageError(nftId)

  // 计算图片URL
  const imageUrl = imageError ? PLACEHOLDER_IMAGE : nft?.image || PLACEHOLDER_IMAGE

  if (!isConnected) {
    return (
      <PageTitle title={t('pageTitle.nftDetail')}>
        <div className={styles.nftDetailPage}>
          <Card className={styles.connectCard}>
            <div className={styles.connectContent}>
              <Text>{t('profile.connectWalletFirst')}</Text>
              <ConnectButton />
            </div>
          </Card>
        </div>
      </PageTitle>
    )
  }

  if (loading) {
    return (
      <PageTitle title={t('pageTitle.nftDetail')}>
        <div className={styles.nftDetailPage}>
          <Card>
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <Spin size="large" />
              <div style={{ marginTop: 16, color: '#8c8c8c' }}>
                {t('common.loading')}
              </div>
            </div>
          </Card>
        </div>
      </PageTitle>
    )
  }

  if (error) {
    return (
      <PageTitle title={t('pageTitle.nftDetail')}>
        <div className={styles.nftDetailPage}>
          <Alert
            description={
              <Space direction="vertical" style={{ width: '100%' }}>
                <span>{error}</span>
                <a onClick={refetch}>{t('common.refresh')}</a>
              </Space>
            }
            type="error"
            showIcon
          />
        </div>
      </PageTitle>
    )
  }

  if (!nft) {
    return (
      <PageTitle title={t('pageTitle.nftDetail')}>
        <div className={styles.nftDetailPage}>
          <Card>
            <Empty description={t('profile.nftNotFound')} />
          </Card>
        </div>
      </PageTitle>
    )
  }

  return (
    <PageTitle title={t('pageTitle.nftDetail')}>
      <div className={styles.nftDetailPage}>
        {nft && (
          <>
            <NFTInfoCard nft={nft} imageUrl={imageUrl} onImageError={() => setImageError(true)} />
            {/* 暂时隐藏交易记录，因为Alchemy API没有提供交易记录 */}
            {/* <TransactionTable transactions={[]} /> */}
          </>
        )}
      </div>
    </PageTitle>
  )
}

export default NFTDetailPage

