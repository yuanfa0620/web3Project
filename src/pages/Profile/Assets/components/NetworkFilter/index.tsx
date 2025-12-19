/**
 * 网络过滤器组件
 */
import React from 'react'
import { Select, Avatar, Tag } from 'antd'
import { useTranslation } from 'react-i18next'
import {
  CHAIN_INFO,
  SUPPORTED_CHAIN_IDS,
  TESTNET_CHAIN_IDS,
  supportedChains,
} from '@/config/network'
import { getChainIconUrl } from '@/utils/chainIcons'
import styles from './index.module.less'

const { Option } = Select

interface NetworkFilterProps {
  value?: number[]
  onChange?: (chainIds: number[]) => void
  placeholder?: string
}

// 创建链ID到链对象的映射
const chainMap = new Map(supportedChains.map(chain => [chain.id, chain]))

// 判断是否为测试网
const isTestnetChain = (chainId: number): boolean => {
  return (TESTNET_CHAIN_IDS as readonly number[]).includes(chainId)
}

export const NetworkFilter: React.FC<NetworkFilterProps> = ({
  value = [],
  onChange,
  placeholder,
}) => {
  const { t } = useTranslation()

  const handleChange = (chainIds: number[]) => {
    onChange?.(chainIds)
  }

  return (
    <Select
      mode="multiple"
      allowClear
      placeholder={placeholder || t('assets.selectNetwork')}
      value={value}
      onChange={handleChange}
      className={styles.networkFilter}
      maxTagCount="responsive"
      tagRender={(props) => {
        const { label, value: chainId, closable, onClose } = props
        const chainIcon = getChainIconUrl(Number(chainId))
        const chainInfo = CHAIN_INFO[Number(chainId) as keyof typeof CHAIN_INFO]
        
        return (
          <Tag
            closable={closable}
            onClose={onClose}
            className={styles.networkTag}
          >
            <Avatar
              src={chainIcon || chainInfo?.logoURI}
              size={16}
              className={styles.tagAvatar}
            >
              {String(label || '')[0] || '?'}
            </Avatar>
            <span>{label}</span>
          </Tag>
        )
      }}
    >
      {SUPPORTED_CHAIN_IDS.map((chainId) => {
        const chainIcon = getChainIconUrl(chainId)
        const chainInfo = CHAIN_INFO[chainId as keyof typeof CHAIN_INFO]
        const wagmiChain = chainMap.get(chainId as any)
        const chainName = wagmiChain?.name || chainInfo?.name || `Chain ${chainId}`
        const isTestnet = isTestnetChain(chainId)

        return (
          <Option key={chainId} value={chainId} label={chainName}>
            <div className={styles.optionItem}>
              <Avatar
                src={chainIcon || chainInfo?.logoURI}
                size={20}
                className={styles.chainAvatar}
              >
                {chainName[0] || '?'}
              </Avatar>
              <span className={styles.chainName}>{chainName}</span>
              {isTestnet && (
                <Tag color="orange" className={styles.testnetTag}>
                  {t('assets.testnet')}
                </Tag>
              )}
            </div>
          </Option>
        )
      })}
    </Select>
  )
}

