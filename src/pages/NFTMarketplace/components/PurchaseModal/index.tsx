import React from 'react'
import { Modal, Tag, Divider, Button } from 'antd'
import { ShoppingCartOutlined } from '@ant-design/icons'
import type { TFunction } from 'i18next'
import type { NFTMarketplaceItem } from '../../index'
import styles from './index.module.less'

interface PurchaseModalProps {
  nft: NFTMarketplaceItem | null
  onCancel: () => void
  t: TFunction
  getRarityColor: (rarity: string) => string
}

export const PurchaseModal: React.FC<PurchaseModalProps> = ({
  nft,
  onCancel,
  t,
  getRarityColor,
}) => {
  return (
    <Modal
      open={!!nft}
      title={nft?.name}
      className={styles.buyModal}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          {t('nftMarketplace.cancel')}
        </Button>,
        <Button key="confirm" type="primary" icon={<ShoppingCartOutlined />}>
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
                  {nft.price} {nft.priceUnit}
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

