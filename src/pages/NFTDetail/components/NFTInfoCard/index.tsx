/**
 * NFT信息卡片组件
 */
import React, { useState } from 'react'
import { Card, Tag, Typography, Space, Button, Descriptions, Image, Modal, Input, Alert, message } from 'antd'
import { useTranslation } from 'react-i18next'
import { useAccount } from 'wagmi'
import { AddressWithCopy } from '@/components/AddressWithCopy'
import { CHAIN_INFO } from '@/config/network'
import { openAddressInExplorer, openNFTInExplorer } from '@/utils/blockExplorer'
import { useIsWhitelisted, useDepositNFT } from '@/contracts/nftMarketplace/hooks'
import { getNFTMarketplaceAddress } from '@/config/constants'
import { parseEther } from 'viem'
import type { UserNFT } from '@/pages/Profile/types'
import styles from './index.module.less'

const { Title, Text } = Typography

export interface NFTInfoCardProps {
  nft: UserNFT
  imageUrl: string
  onImageError: () => void
}

export const NFTInfoCard: React.FC<NFTInfoCardProps> = ({ nft, imageUrl, onImageError }) => {
  const { t } = useTranslation()
  const { address, chainId } = useAccount()
  const [listModalVisible, setListModalVisible] = useState(false)
  const [price, setPrice] = useState('')
  const [isWhitelisted, setIsWhitelisted] = useState<boolean | null>(null)

  const marketplaceAddress = chainId ? getNFTMarketplaceAddress(chainId) : ''

  const { checkWhitelisted, loading: checkingWhitelist } = useIsWhitelisted({
    onSuccess: (whitelisted) => {
      setIsWhitelisted(whitelisted)
      if (whitelisted) {
        setListModalVisible(true)
      }
    },
  })

  const { depositNFT, loading: listingLoading, approving, depositing } = useDepositNFT({
    marketplaceAddress,
    chainId: chainId || 0,
    onSuccess: () => {
      message.success(t('profile.nftMarketplace.listNFTSuccess'))
      setListModalVisible(false)
      setPrice('')
    },
    onError: (error) => {
      message.error(error)
    },
  })

  const handleCheckWhitelist = () => {
    if (!chainId) {
      return
    }
    checkWhitelisted(nft.contractAddress)
  }

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    // 只允许数字和小数点，参考swap页面的输入限制
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      // 限制18位小数（ETH的精度）
      if (value.includes('.')) {
        const parts = value.split('.')
        if (parts[1] && parts[1].length > 18) {
          return // 超过18位小数，不更新
        }
      }
      setPrice(value)
    }
  }

  const handleListNFT = () => {
    if (!chainId || !marketplaceAddress) {
      return
    }

    // 尝试解析价格，如果失败则使用 '0'，让合约调用来处理错误
    let priceInWei: bigint
    try {
      priceInWei = parseEther(price || '0')
    } catch (error) {
      // parseEther 失败，使用 '0'，让合约调用来处理错误并显示提示
      priceInWei = parseEther('0')
    }

    depositNFT({
      nftContract: nft.contractAddress,
      tokenId: nft.tokenId,
      price: priceInWei.toString(),
    })
  }

  return (
    <Card className={styles.nftInfoCard}>
      <div className={styles.nftHeader}>
        <Image
          src={imageUrl}
          alt={nft.name}
          className={styles.nftImage}
          preview={false}
          onError={onImageError}
        />
        <div className={styles.nftInfo}>
          <Title level={3}>{nft.name}</Title>
          <Text type="secondary">{nft.description}</Text>
          <Descriptions column={1} style={{ marginTop: 16 }}>
            <Descriptions.Item label={t('profile.collectionName')}>
              {nft.collectionName}
            </Descriptions.Item>
            <Descriptions.Item label={t('profile.tokenId')}>{nft.tokenId}</Descriptions.Item>
            <Descriptions.Item label={t('profile.network')}>
              <Tag>
                {CHAIN_INFO[nft.chainId as keyof typeof CHAIN_INFO]?.name || nft.chainId}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label={t('profile.contractAddress')}>
              <AddressWithCopy
                address={nft.contractAddress}
                onClick={() => openAddressInExplorer(nft.contractAddress, nft.chainId)}
              />
            </Descriptions.Item>
            {nft.owner && (
            <Descriptions.Item label={t('profile.owner')}>
              <AddressWithCopy
                address={nft.owner}
                onClick={() => openAddressInExplorer(nft.owner, nft.chainId)}
              />
            </Descriptions.Item>
            )}
            <Descriptions.Item label={t('profile.viewOnExplorer')}>
              <Button
                type="link"
                onClick={() => openNFTInExplorer(nft.contractAddress, nft.tokenId, nft.chainId)}
                style={{ padding: 0 }}
              >
                {t('profile.openInExplorer')}
              </Button>
            </Descriptions.Item>
          </Descriptions>

          {/* 操作按钮 */}
          {address && chainId && (
            <Space style={{ marginTop: 16 }} wrap>
              <Button
                type="default"
                loading={checkingWhitelist}
                onClick={handleCheckWhitelist}
              >
                {t('profile.nftMarketplace.checkWhitelist')}
              </Button>
              {isWhitelisted && (
                <Button
                  type="primary"
                  onClick={() => setListModalVisible(true)}
                >
                  {t('profile.nftMarketplace.listNFT')}
                </Button>
              )}
            </Space>
          )}
        </div>
      </div>

      {/* 属性 */}
      {nft.attributes && nft.attributes.length > 0 && (
        <div className={styles.attributes}>
          <Title level={4}>{t('profile.attributes')}</Title>
          <Space wrap>
            {nft.attributes.map((attr, index) => (
              <Tag key={index} color="blue">
                {attr.trait_type}: {attr.value}
              </Tag>
            ))}
          </Space>
        </div>
      )}

      {/* 上架 Modal */}
      <Modal
        title={t('profile.nftMarketplace.listNFT')}
        open={listModalVisible}
        onOk={handleListNFT}
        onCancel={() => {
          setListModalVisible(false)
          setPrice('')
        }}
        confirmLoading={listingLoading}
        okText={t('profile.nftMarketplace.listNFT')}
        cancelText={t('common.cancel')}
        centered
        okButtonProps={{
          disabled: !price || price === '' || parseFloat(price) < 0,
        }}
      >
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <div>
            <Text strong>{t('profile.nftMarketplace.price')}</Text>
            <Input
              type="text"
              placeholder={t('profile.nftMarketplace.pricePlaceholder')}
              value={price}
              onChange={handlePriceChange}
              style={{ marginTop: 8 }}
              addonAfter="ETH"
            />
          </div>
          {approving && (
            <Alert
              message={t('profile.nftMarketplace.approving')}
              type="info"
              showIcon
            />
          )}
          {depositing && (
            <Alert
              message={t('profile.nftMarketplace.depositing')}
              type="info"
              showIcon
            />
          )}
        </Space>
      </Modal>
    </Card>
  )
}

