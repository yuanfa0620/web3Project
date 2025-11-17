/**
 * 个人中心页面
 */
import React from 'react'
import { Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { useAccount } from 'wagmi'
import { PageTitle } from '@/components/PageTitle'
import { useProfileData } from './hooks/useProfileData'
import { useMobile } from './hooks/useMobile'
import { ConnectWalletCard, TransactionTable, NFTTable } from './components'
import styles from './index.module.less'

const { Title } = Typography

const ProfilePage: React.FC = () => {
  const { t } = useTranslation()
  const { address, isConnected } = useAccount()
  const { transactions, nfts } = useProfileData(address)
  const isMobile = useMobile()

  if (!isConnected) {
    return (
      <PageTitle title={t('pageTitle.profile')}>
        <div className={styles.profilePage}>
          <ConnectWalletCard />
        </div>
      </PageTitle>
    )
  }

  return (
    <PageTitle title={t('pageTitle.profile')}>
      <div className={styles.profilePage}>
        <Title level={2} className={styles.pageTitle}>
          {t('profile.title')}
        </Title>

        <TransactionTable transactions={transactions} isMobile={isMobile} />
        <NFTTable nfts={nfts} isMobile={isMobile} />
      </div>
    </PageTitle>
  )
}

export default ProfilePage

