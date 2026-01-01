import React from 'react'
import { Modal, Tag, Divider, Button } from 'antd'
import { ShoppingCartOutlined } from '@ant-design/icons'
import type { TFunction } from 'i18next'
import { useAccount } from 'wagmi'
import { useBuyNFT } from '@/contracts/nftMarketplace/hooks/useBuyNFT'
import { getNFTMarketplaceAddress } from '@/config/constants'
import { AnimatedNumber } from '@/components/AnimatedNumber'
import type { NFTMarketplaceItem } from '../../index'
import styles from './index.module.less'

interface PurchaseModalProps {
  nft: NFTMarketplaceItem | null
  onCancel: () => void
  onPurchaseSuccess?: () => void
  t: TFunction
  getRarityColor: (rarity: string) => string
}

export const PurchaseModal: React.FC<PurchaseModalProps> = ({
  nft,
  onCancel,
  onPurchaseSuccess,
  t,
  getRarityColor,
}) => {
  const { chainId } = useAccount()
  const marketplaceAddress = chainId ? getNFTMarketplaceAddress(chainId) : ''

  const { buyNFT, loading: isBuying } = useBuyNFT({
    marketplaceAddress,
    chainId: chainId || 0,
    onSuccess: (hash) => {
      console.log('购买成功，交易哈希:', hash)
      onCancel() // 购买成功后关闭弹窗
      // 通知父组件刷新数据
      onPurchaseSuccess?.()
    },
    onError: (error) => {
      console.error('购买失败:', error)
    },
  })

  const handleConfirmPurchase = () => {
    if (!nft || !chainId || !marketplaceAddress) {
      return
    }

    // 调用购买方法
    buyNFT(
      { orderId: nft.activeOrder.orderId },
      nft.price
    )
  }

  return (
    <Modal
      open={!!nft}
      title={nft?.name}
      className={styles.buyModal}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel} disabled={isBuying}>
          {t('nftMarketplace.cancel')}
        </Button>,
        <Button
          key="confirm"
          type="primary"
          icon={<ShoppingCartOutlined />}
          onClick={handleConfirmPurchase}
          loading={isBuying}
          disabled={!nft || !chainId || !marketplaceAddress || isBuying}
        >
          {t('nftMarketplace.confirmPurchase')}
        </Button>,
      ]}
      width={720}
    >
      {nft && (
        <div className={styles.modalContent}>
          <div className={styles.modalTop}>
            <div className={styles.modalImageWrapper}>
              <img src={nft.image} alt={nft.name} />
              <Tag color={getRarityColor(nft.rarity)} className={styles.modalRarity}>
                {nft.rarity}
              </Tag>
            </div>
            <div className={styles.modalInfo}>
              <div className={styles.modalCollection}>
                <span>{t('nftMarketplace.collection')}</span>
                <strong>{nft.collection}</strong>
              </div>
              <div className={styles.modalPriceRow}>
                <span>{t('nftMarketplace.price')}</span>
                <strong>
                  <AnimatedNumber value={nft.price} decimals={6} enableAnimation />
                  <span> {nft.priceUnit}</span>
                </strong>
              </div>
              <div className={styles.modalStats}>
                <div className={styles.modalStatItem}>
                  <span>{t('nftMarketplace.owner')}</span>
                  <strong>{nft.owner}</strong>
                </div>
                <div className={styles.modalStatItem}>
                  <span>{t('nftMarketplace.volume')}</span>
                  <strong>{nft.volume}</strong>
                </div>
                <div className={styles.modalStatItem}>
                  <span>{t('nftMarketplace.lastSale')}</span>
                  <strong>{nft.lastSale}</strong>
                </div>
              </div>
            </div>
          </div>
          <Divider />
          <div className={styles.attributesSection}>
            <h4>{t('nftMarketplace.attributes')}</h4>
            <div className={styles.attributeList}>
              {nft.attributes.map((attr) => (
                <div key={attr.trait_type} className={styles.attributeItem}>
                  <span className={styles.attributeLabel}>{attr.trait_type}</span>
                  <span className={styles.attributeValue}>{attr.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Modal>
  )
}

