import React, { useMemo } from 'react'
import { Modal, Form, Input, Button, Select, Typography, Tag, Alert, message, Space, Spin } from 'antd'
import { SendOutlined, WalletOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useAccount } from 'wagmi'
import { isAddress } from 'viem'
import { CHAIN_INFO } from '@/constants/chains'
import { AnimatedNumber } from '@/components/AnimatedNumber'
import { useSendTokenState } from './hooks/useSendTokenState'
import { useSendTokenBalance } from './hooks/useSendTokenBalance'
import { useSendTokenTransaction } from './hooks/useSendTokenTransaction'
import { useSendTokenValidation } from './hooks/useSendTokenValidation'
import { useSendTokenActions } from './hooks/useSendTokenActions'
import styles from './index.module.less'

const { Text } = Typography
const { Option } = Select

interface SendTokenProps {
  open: boolean
  onCancel: () => void
  onSuccess?: (hash: string) => void
  chainId?: number
  address?: string
}

const SendToken: React.FC<SendTokenProps> = ({ open, onCancel, onSuccess, chainId, address: userAddress }) => {
  const { t } = useTranslation()
  const { address } = useAccount()
  const [form] = Form.useForm()

  // 状态管理
  const {
    tokenType,
    selectedTokenAddress,
    tokenBalance,
    balanceLoading,
    tokenDecimals,
    tokenSymbol,
    handleTokenTypeChange,
    handleTokenAddressChange,
    setTokenType,
    setSelectedTokenAddress,
    setTokenBalance,
    setBalanceLoading,
    setTokenDecimals,
    setTokenSymbol,
  } = useSendTokenState()

  // 余额管理
  const { nativeBalance, nativeBalanceLoading } = useSendTokenBalance({
    tokenType,
    selectedTokenAddress,
    chainId,
    setTokenBalance,
    setBalanceLoading,
    setTokenDecimals,
    setTokenSymbol,
  })

  // 重置所有状态和表单数据
  const resetAllData = () => {
    form.resetFields()
    setTokenType('native')
    setSelectedTokenAddress('')
    setTokenBalance('0')
    setTokenDecimals(18)
    setTokenSymbol('ETH')
  }

  // 当弹窗关闭时重置数据
  const handleModalCancel = () => {
    resetAllData()
    onCancel()
  }

  // 交易成功后重置数据并关闭弹窗
  const handleTransactionSuccess = (hash: string) => {
    resetAllData()
    onSuccess?.(hash)
    onCancel()
  }

  // 交易发送
  const { transactionHash, isLoading, isConfirming, isConfirmed, handleSend } = useSendTokenTransaction({
    tokenType,
    selectedTokenAddress,
    tokenDecimals,
    form,
    onSuccess: handleTransactionSuccess,
    onCancel: handleModalCancel,
  })

  // 表单验证
  const { validateAmount, validateAddress, validateTokenAddress } = useSendTokenValidation({
    tokenBalance,
    address,
    onTokenAddressChange: handleTokenAddressChange,
  })

  // 操作逻辑
  const { handleMax } = useSendTokenActions({
    tokenType,
    tokenBalance,
    form,
  })

  // 当前网络信息
  const networkInfo = useMemo(() => {
    if (!chainId) return null
    return CHAIN_INFO[chainId as keyof typeof CHAIN_INFO]
  }, [chainId])

  // 计算显示的余额和加载状态
  const displayBalance = tokenType === 'native' ? nativeBalance?.formatted : tokenBalance
  const displayBalanceLoading = tokenType === 'native' ? nativeBalanceLoading : balanceLoading

  // 处理代币类型变化
  const handleTokenTypeSelectChange = (value: 'native' | 'erc20') => {
    handleTokenTypeChange(value)
    form.setFieldsValue({ tokenAddress: undefined, amount: undefined })
  }

  // 处理代币地址输入变化
  const handleTokenAddressInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim()
    // 实时更新地址，用于触发代币信息获取
    if (isAddress(value)) {
      handleTokenAddressChange(value)
    } else {
      handleTokenAddressChange('')
    }
  }

  return (
    <Modal
      title={
        <Space>
          <SendOutlined />
          <span>{t('wallet.sendToken.title')}</span>
        </Space>
      }
      open={open}
      onCancel={handleModalCancel}
      footer={null}
      width={500}
      destroyOnHidden
    >
      <div className={styles.sendTokenContent}>
        {networkInfo && (
          <Alert
            message={
              <Space>
                <Text strong>{t('wallet.sendToken.currentNetwork')}:</Text>
                <Tag color="blue">{networkInfo.name}</Tag>
                <Text type="secondary">({networkInfo.symbol})</Text>
              </Space>
            }
            type="info"
            showIcon
            style={{ marginBottom: 24 }}
          />
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSend}
        >
          <Form.Item
            label={t('wallet.sendToken.tokenType')}
            name="tokenType"
            initialValue="native"
          >
            <Select
              value={tokenType}
              onChange={handleTokenTypeSelectChange}
            >
              <Option value="native">
                <Space>
                  <WalletOutlined />
                  <span>{networkInfo?.symbol || 'ETH'} ({t('wallet.sendToken.nativeToken')})</span>
                </Space>
              </Option>
              <Option value="erc20">{t('wallet.sendToken.erc20Token')}</Option>
            </Select>
          </Form.Item>

          {tokenType === 'erc20' && (
            <Form.Item
              label={t('wallet.sendToken.tokenAddress')}
              name="tokenAddress"
              rules={[
                { required: true, message: t('wallet.sendToken.tokenAddressRequired') },
                { validator: validateTokenAddress },
              ]}
            >
              <Input
                placeholder={t('wallet.sendToken.tokenAddressPlaceholder')}
                onChange={handleTokenAddressInputChange}
              />
            </Form.Item>
          )}

          <Form.Item
            label={
              <Space>
                <span>{t('wallet.sendToken.balance')}:</span>
                <AnimatedNumber
                  value={displayBalance || '0'}
                  suffix={tokenSymbol}
                  loading={displayBalanceLoading}
                  defaultValue="0"
                  decimals={6}
                  enableAnimation={true}
                  style={{ fontWeight: 'bold', color: '#1890ff' }}
                />
              </Space>
            }
          />

          <Form.Item
            label={t('wallet.sendToken.toAddress')}
            name="to"
            rules={[{ validator: validateAddress }]}
          >
            <Input
              placeholder={t('wallet.sendToken.toAddressPlaceholder')}
              allowClear
            />
          </Form.Item>

          <Form.Item
            label={t('wallet.sendToken.amount')}
            name="amount"
            rules={[{ validator: validateAmount }]}
          >
            <Input
              type="number"
              placeholder={t('wallet.sendToken.amountPlaceholder')}
              suffix={
                <Space>
                  <Text type="secondary">{tokenSymbol}</Text>
                  <Button
                    type="link"
                    size="small"
                    onClick={handleMax}
                    disabled={!displayBalance || parseFloat(displayBalance) <= 0}
                  >
                    {t('wallet.sendToken.max')}
                  </Button>
                </Space>
              }
            />
          </Form.Item>

          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={handleModalCancel}>
                {t('common.cancel')}
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                icon={<SendOutlined />}
              >
                {isLoading
                  ? isConfirming
                    ? t('wallet.sendToken.confirming')
                    : t('wallet.sendToken.sending')
                  : t('wallet.sendToken.send')}
              </Button>
            </Space>
          </Form.Item>
        </Form>

        {transactionHash && (
          <Alert
            message={
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <Text strong>{t('wallet.sendToken.transactionHash')}:</Text>
                <Text code copyable style={{ fontSize: 12 }}>
                  {transactionHash}
                </Text>
                {isConfirming && <Text type="secondary">{t('wallet.sendToken.waitingConfirm')}</Text>}
                {isConfirmed && <Text type="success">{t('wallet.sendToken.transactionConfirmed')}</Text>}
              </Space>
            }
            type={isConfirmed ? 'success' : 'info'}
            style={{ marginTop: 16 }}
          />
        )}
      </div>
    </Modal>
  )
}

export default SendToken
