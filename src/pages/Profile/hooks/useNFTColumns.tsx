/**
 * NFT列表表格列定义 Hook
 */
import { useMemo } from 'react'
import type { ColumnsType } from 'antd/es/table'
import { Tag, Avatar, Button } from 'antd'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { CHAIN_INFO } from '@/config/network'
import type { UserNFT } from '../types'

export const useNFTColumns = (): ColumnsType<UserNFT> => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const columns: ColumnsType<UserNFT> = useMemo(
    () => [
      {
        title: t('profile.nftImage'),
        dataIndex: 'image',
        key: 'image',
        width: 100,
        render: (image: string) => <Avatar src={image} shape="square" size={64} />,
      },
      {
        title: t('profile.nftName'),
        dataIndex: 'name',
        key: 'name',
        width: 100,
      },
      {
        title: t('profile.collectionName'),
        dataIndex: 'collectionName',
        key: 'collectionName',
        width: 100,
      },
      {
        title: t('profile.network'),
        dataIndex: 'chainId',
        key: 'chainId',
        render: (chainId: number) => (
          <Tag>{CHAIN_INFO[chainId as keyof typeof CHAIN_INFO]?.name || chainId}</Tag>
        ),
        width: 100,
      },
      {
        title: t('profile.tokenId'),
        dataIndex: 'tokenId',
        key: 'tokenId',
        width: 100,
      },
      {
        title: t('profile.actions'),
        key: 'actions',
        render: (_: any, record: UserNFT) => (
          <Button type="link" onClick={() => navigate(`/profile/nft/${record.id}`)}>
            {t('profile.viewDetail')}
          </Button>
        ),
        width: 100,
      },
    ],
    [t, navigate]
  )

  return columns
}

