/**
 * NFT详情页面
 */
import React from 'react'
import { Card, Typography, Empty } from 'antd'
import { useTranslation } from 'react-i18next'
import { useAccount } from 'wagmi'
import { useParams } from 'react-router-dom'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { PageTitle } from '@/components/PageTitle'
import { useNFTDetailData } from './hooks/useNFTDetailData'
import { useImageError } from './hooks/useImageError'
import { NFTInfoCard, TransactionTable } from './components'
import { PLACEHOLDER_IMAGE } from './constants'
import styles from './index.module.less'

const { Text } = Typography

const NFTDetailPage: React.FC = () => {
  const { t } = useTranslation()
  const { nftId } = useParams<{ nftId: string }>()
  const { isConnected } = useAccount()
  const { nft, transactions } = useNFTDetailData(nftId)
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
            <TransactionTable transactions={transactions} />
          </>
        )}
      </div>
    </PageTitle>
  )
}

export default NFTDetailPage

