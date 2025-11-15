import React, { useState, useEffect, useMemo } from 'react'
import { Modal, Form, Input, Button, Select, Typography, Tag, Alert, message, Space, Spin } from 'antd'
import { SendOutlined, WalletOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useAccount, useSendTransaction, useWriteContract, useWaitForTransactionReceipt, useBalance } from 'wagmi'
import { parseUnits, formatUnits, isAddress } from 'viem'
import type { Address } from 'viem'
import { CHAIN_INFO } from '@/constants/chains'
import { createERC20Service } from '@/contracts/erc20'
import ERC20_ABI from '@/contracts/abi/ERC20.json'
import { createAddressValidator, createAmountValidator, createTokenAddressValidator } from '@/utils/validation'
import styles from './index.module.less'

const { Text, Title } = Typography
const { Option } = Select

interface SendTokenProps {
  open: boolean
  onCancel: () => void
  onSuccess?: (hash: string) => void
  chainId?: number
  address?: string
}

type TokenType = 'native' | 'erc20'

interface TokenOption {
  type: TokenType
  address?: string
  symbol: string
  decimals: number
  balance: string
}

const SendToken: React.FC<SendTokenProps> = ({ open, onCancel, onSuccess, chainId, address: userAddress }) => {
  const { t } = useTranslation()
  const { address } = useAccount()
  const [form] = Form.useForm()
  const [tokenType, setTokenType] = useState<TokenType>('native')
  const [selectedTokenAddress, setSelectedTokenAddress] = useState<string>('')
  const [tokenBalance, setTokenBalance] = useState<string>('0')
  const [balanceLoading, setBalanceLoading] = useState(false)
  const [tokenDecimals, setTokenDecimals] = useState(18)
  const [tokenSymbol, setTokenSymbol] = useState('ETH')

  // 获取主网币余额
  const { data: nativeBalance, isLoading: nativeBalanceLoading } = useBalance({
    address: (tokenType === 'native' && address ? address : undefined) as Address | undefined,
  })

  // 发送主网币交易
  const {
    data: sendHash,
    isPending: isSending,
    error: sendError,
    sendTransaction,
  } = useSendTransaction()

  // 发送ERC20代币交易
  const {
    data: erc20Hash,
    isPending: isErc20Sending,
    error: erc20Error,
    writeContract,
  } = useWriteContract()

  // 等待交易确认
  const transactionHash = sendHash || erc20Hash
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: transactionHash,
  })

  // 当前网络信息
  const networkInfo = useMemo(() => {
    if (!chainId) return null
    return CHAIN_INFO[chainId as keyof typeof CHAIN_INFO]
  }, [chainId])

  // 更新主网币余额
  useEffect(() => {
    if (tokenType === 'native' && nativeBalance) {
      setTokenBalance(nativeBalance.formatted)
      setTokenDecimals(nativeBalance.decimals)
      setTokenSymbol(nativeBalance.symbol)
    }
  }, [tokenType, nativeBalance])

  // 获取ERC20代币余额和信息
  useEffect(() => {
    if (tokenType === 'erc20' && selectedTokenAddress && address && chainId) {
      const fetchTokenInfo = async () => {
        setBalanceLoading(true)
        try {
          const erc20Service = createERC20Service(selectedTokenAddress, chainId)
          const result = await erc20Service.getTokenInfo(address)

          if (result.success && result.data) {
            const { balance, decimals, symbol } = result.data
            setTokenBalance(formatUnits(BigInt(balance), decimals))
            setTokenDecimals(decimals)
            setTokenSymbol(symbol)
          } else {
            message.error(result.error || t('wallet.sendToken.getTokenInfoFailed'))
            setTokenBalance('0')
          }
        } catch (error) {
          console.error('获取代币信息失败:', error)
          message.error(t('wallet.sendToken.getTokenInfoFailed'))
          setTokenBalance('0')
        } finally {
          setBalanceLoading(false)
        }
      }

      fetchTokenInfo()
    } else if (tokenType === 'erc20' && !selectedTokenAddress) {
      setTokenBalance('0')
    }
  }, [tokenType, selectedTokenAddress, address, chainId])

  // 交易成功后的处理
  useEffect(() => {
    if (isConfirmed && transactionHash) {
      message.success(t('wallet.sendToken.transactionSuccess'))
      form.resetFields()
      onSuccess?.(transactionHash)
      onCancel()
    }
  }, [isConfirmed, transactionHash, form, onSuccess, onCancel, t])

  // 错误处理
  useEffect(() => {
    if (sendError) {
      message.error(sendError.message || t('wallet.sendToken.sendFailed'))
    }
    if (erc20Error) {
      message.error(erc20Error.message || t('wallet.sendToken.sendFailed'))
    }
  }, [sendError, erc20Error, t])

  // 处理发送
  const handleSend = async () => {
    try {
      const values = await form.validateFields()
      const { to, amount } = values

          if (!isAddress(to)) {
        message.error(t('wallet.sendToken.toAddressInvalid'))
        return
      }

      if (!address) {
        message.error(t('wallet.sendToken.connectWalletFirst'))
        return
      }

      const amountInWei = parseUnits(amount, tokenDecimals)

      if (tokenType === 'native') {
        // 发送主网币
        sendTransaction({
          to: to as Address,
          value: amountInWei,
        })
      } else {
        // 发送ERC20代币
        if (!selectedTokenAddress) {
          message.error(t('wallet.sendToken.selectToken'))
          return
        }

        writeContract({
          address: selectedTokenAddress as Address,
          abi: ERC20_ABI,
          functionName: 'transfer',
          args: [to as Address, amountInWei],
        })
      }
    } catch (error) {
      console.error('发送失败:', error)
    }
  }

  // 填充最大余额
  const handleMax = () => {
    if (tokenBalance && parseFloat(tokenBalance) > 0) {
      // 对于主网币，需要保留一些作为gas费
      if (tokenType === 'native') {
        const maxAmount = (parseFloat(tokenBalance) * 0.99).toFixed(6)
        form.setFieldsValue({ amount: maxAmount })
      } else {
        form.setFieldsValue({ amount: tokenBalance })
      }
    }
  }

  // 创建验证器
  const validateAmount = useMemo(
    () => createAmountValidator(t, tokenBalance),
    [t, tokenBalance]
  )

  const validateAddress = useMemo(
    () => createAddressValidator(t, address),
    [t, address]
  )

  const validateTokenAddress = useMemo(
    () => createTokenAddressValidator(t, (value) => {
      setSelectedTokenAddress(value)
    }),
    [t]
  )

  const isLoading = isSending || isErc20Sending || isConfirming
  const currentBalance = tokenType === 'native' ? nativeBalance?.formatted : tokenBalance
  const currentBalanceLoading = tokenType === 'native' ? nativeBalanceLoading : balanceLoading

  return (
    <Modal
      title={
        <Space>
          <SendOutlined />
          <span>{t('wallet.sendToken.title')}</span>
        </Space>
      }
      open={open}
      onCancel={onCancel}
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
              onChange={(value) => {
                setTokenType(value)
                setSelectedTokenAddress('')
                form.setFieldsValue({ tokenAddress: undefined, amount: undefined })
              }}
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
                onChange={(e) => {
                  const value = e.target.value.trim()
                  // 实时更新地址，用于触发代币信息获取
                  if (isAddress(value)) {
                    setSelectedTokenAddress(value)
                  } else {
                    setSelectedTokenAddress('')
                  }
                }}
              />
            </Form.Item>
          )}

          <Form.Item
            label={
              <Space>
                <span>{t('wallet.sendToken.balance')}:</span>
                {currentBalanceLoading ? (
                  <Spin size="small" />
                ) : (
                  <Text strong style={{ color: '#1890ff' }}>
                    {currentBalance || '0'} {tokenSymbol}
                  </Text>
                )}
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
                    disabled={!currentBalance || parseFloat(currentBalance) <= 0}
                  >
                    {t('wallet.sendToken.max')}
                  </Button>
                </Space>
              }
            />
          </Form.Item>

          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={onCancel}>
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

