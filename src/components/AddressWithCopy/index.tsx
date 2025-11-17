/**
 * 带复制功能的地址组件
 */
import React, { useState, useCallback } from 'react'
import { Button, Space, message } from 'antd'
import { CopyOutlined, CheckOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { copyToClipboard } from '@/utils/clipboard'
import { formatAddress } from '@/utils/address'

export interface AddressWithCopyProps {
  /**
   * 地址
   */
  address: string
  /**
   * 点击地址时的回调（如跳转到浏览器）
   */
  onClick?: () => void
  /**
   * 自定义样式
   */
  style?: React.CSSProperties
  /**
   * 是否显示复制按钮
   */
  showCopyButton?: boolean
  /**
   * 复制成功后恢复图标的时间（毫秒）
   */
  resetIconDelay?: number
}

/**
 * 带复制功能的地址组件
 */
export const AddressWithCopy: React.FC<AddressWithCopyProps> = ({
  address,
  onClick,
  style,
  showCopyButton = true,
  resetIconDelay = 2000,
}) => {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation() // 阻止事件冒泡，避免触发onClick

      const success = await copyToClipboard(address)
      if (success) {
        setCopied(true)
        message.success(t('common.copySuccess'))
        setTimeout(() => {
          setCopied(false)
        }, resetIconDelay)
      } else {
        message.error(t('common.copyFailed'))
      }
    },
    [address, resetIconDelay, t]
  )

  return (
    <Space size="small">
      {onClick ? (
        <Button type="link" onClick={onClick} style={{ padding: 0, ...style }}>
          {formatAddress(address)}
        </Button>
      ) : (
        <span style={style}>{formatAddress(address)}</span>
      )}
      {showCopyButton && (
        <Button
          type="text"
          size="small"
          icon={copied ? <CheckOutlined style={{ color: '#52c41a' }} /> : <CopyOutlined />}
          onClick={handleCopy}
          style={{ padding: 0, height: 'auto', minWidth: 'auto' }}
        />
      )}
    </Space>
  )
}

export default AddressWithCopy

