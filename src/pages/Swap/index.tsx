import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Card, Button, Typography, Space, Modal, message } from 'antd'
import { SwapOutlined, ArrowDownOutlined } from '@ant-design/icons'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useTranslation } from 'react-i18next'
import { useAccount, useSwitchChain } from 'wagmi'
import { PageTitle } from '@/components/PageTitle'
import { SwapInput } from '@/components/SwapInput'
import { useWallet } from '@/hooks/useWallet'
import { useTokenBalance } from '@/hooks/useTokenBalance'
import { useSwapQuote } from '@/hooks/useSwapQuote'
import { useTokenAllowance } from '@/hooks/useTokenAllowance'
import { createERC20Service } from '@/contracts/erc20'
import type { TokenConfig } from '@/types/swap'
import styles from './index.module.less'

const { Title } = Typography

const SwapPage: React.FC = () => {
  const { t } = useTranslation()
  const { address, chainId, isConnected } = useAccount()
  const { switchChain } = useSwitchChain()
  const { isConnected: walletConnected } = useWallet()

  const [fromToken, setFromToken] = useState<TokenConfig | null>(null)
  const [toToken, setToToken] = useState<TokenConfig | null>(null)
  const [fromAmount, setFromAmount] = useState<string>('')
  const [toAmountInput, setToAmountInput] = useState<string>('') // to输入框的值
  const [fromTokenChainId, setFromTokenChainId] = useState<number | null>(null)
  const [toTokenChainId, setToTokenChainId] = useState<number | null>(null)
  // 共享的网络选择状态，用于两个代币选择框
  const [sharedChainId, setSharedChainId] = useState<number | null>(null)
  // 跟踪当前正在编辑的输入框：'from' | 'to' | null
  const [activeInput, setActiveInput] = useState<'from' | 'to' | null>(null)

  // 余额（使用token的chainId，而不是当前连接的chainId）
  const fromBalance = useTokenBalance(fromToken, fromTokenChainId)
  const toBalance = useTokenBalance(toToken, toTokenChainId)

  // 兑换数量（使用fromToken的chainId）- 从from计算to
  const { toAmount, loading: quoteLoading } = useSwapQuote(
    fromToken,
    toToken,
    fromAmount,
    fromTokenChainId
  )

  // 反向兑换数量（使用toToken的chainId）- 从to计算from
  const { toAmount: fromAmountFromTo, loading: reverseQuoteLoading } = useSwapQuote(
    toToken,
    fromToken,
    toAmountInput,
    toTokenChainId
  )

  // 根据activeInput决定使用哪个fromAmount进行授权检查
  const actualFromAmountForAllowance = activeInput === 'to' ? fromAmountFromTo : fromAmount
  
  // 授权检查（使用fromToken的chainId）
  const { needApprove, loading: allowanceLoading } = useTokenAllowance(
    fromToken,
    fromTokenChainId,
    actualFromAmountForAllowance || fromAmount
  )

  // 处理fromToken选择
  const handleFromTokenSelect = useCallback((token: TokenConfig, selectedChainId?: number) => {
    // 如果toToken和选择的token相同，清空toToken
    if (toToken && toToken.address === token.address && toTokenChainId === selectedChainId) {
      setToToken(null)
      setToTokenChainId(null)
    }
    setFromToken(token)
    const chainId = selectedChainId || token.chainId
    if (chainId) {
      setFromTokenChainId(chainId)
      setSharedChainId(chainId) // 更新共享网络状态
    }
    // 清空输入状态
    setFromAmount('')
    setToAmountInput('')
    setActiveInput(null)
    // 检查网络
    checkNetwork(token, chainId)
  }, [toToken, toTokenChainId])

  // 处理toToken选择
  const handleToTokenSelect = useCallback((token: TokenConfig, selectedChainId?: number) => {
    // 如果fromToken和选择的token相同，清空fromToken
    if (fromToken && fromToken.address === token.address && fromTokenChainId === selectedChainId) {
      setFromToken(null)
      setFromTokenChainId(null)
    }
    setToToken(token)
    const chainId = selectedChainId || token.chainId
    if (chainId) {
      setToTokenChainId(chainId)
      setSharedChainId(chainId) // 更新共享网络状态
    }
    // 清空输入状态
    setFromAmount('')
    setToAmountInput('')
    setActiveInput(null)
    // 检查网络
    checkNetwork(token, chainId)
  }, [fromToken, fromTokenChainId])

  // 处理to的chainId变化（当to修改网络时，清空fromToken）
  const handleToChainChange = useCallback((chainId: number) => {
    if (fromToken && fromTokenChainId !== chainId) {
      setFromToken(null)
      setFromTokenChainId(null)
      setFromAmount('')
    }
    setToTokenChainId(chainId)
    setSharedChainId(chainId) // 更新共享网络状态
  }, [fromToken, fromTokenChainId])

  // 处理from的chainId变化
  const handleFromChainChange = useCallback((chainId: number) => {
    if (toToken && toTokenChainId !== chainId) {
      setToToken(null)
      setToTokenChainId(null)
    }
    setFromTokenChainId(chainId)
    setSharedChainId(chainId) // 更新共享网络状态
  }, [toToken, toTokenChainId])

  // 检查网络
  const checkNetwork = (token: TokenConfig, tokenChainId?: number | null) => {
    const targetChainId = tokenChainId || token.chainId
    if (targetChainId && chainId && targetChainId !== chainId) {
      Modal.warning({
        title: t('swap.switchNetwork'),
        content: t('swap.switchNetworkTip', { chainName: `Chain ${targetChainId}` }),
        onOk: () => {
          if (switchChain) {
            switchChain({ chainId: targetChainId })
          }
        },
      })
    }
  }

  // Max按钮
  const handleMaxClick = useCallback(() => {
    if (fromBalance.balance) {
      setFromAmount(fromBalance.balance)
      setActiveInput('from')
    }
  }, [fromBalance.balance])

  // 处理from数量变化
  const handleFromAmountChange = useCallback((amount: string) => {
    setFromAmount(amount)
    setActiveInput('from')
    // 清空to输入框，让useSwapQuote自动计算
    if (amount === '') {
      setToAmountInput('')
    }
  }, [])

  // 处理to数量变化
  const handleToAmountChange = useCallback((amount: string) => {
    setToAmountInput(amount)
    setActiveInput('to')
    // 清空from输入框，让反向useSwapQuote自动计算
    if (amount === '') {
      setFromAmount('')
    }
  }, [])

  // 格式化数字，去掉小数点后末尾的0
  const formatAmount = useCallback((amount: string): string => {
    if (!amount || amount === '') return ''
    
    // 尝试转换为数字
    const num = parseFloat(amount)
    if (isNaN(num)) return amount
    
    // 转换为字符串，会自动去掉末尾的0
    // 例如：1.500000 -> "1.5", 1.230000 -> "1.23", 1.000000 -> "1"
    const formatted = num.toString()
    
    // 如果原字符串以小数点结尾（用户正在输入），保持小数点
    if (amount.endsWith('.') && !formatted.includes('.')) {
      return formatted + '.'
    }
    
    return formatted
  }, [])

  // 根据activeInput决定显示哪个值，并格式化
  const displayToAmount = useMemo(() => {
    const rawAmount = activeInput === 'to' ? toAmountInput : (toAmount || '')
    // 如果用户正在输入to，保持原样；否则格式化
    if (activeInput === 'to') {
      return rawAmount
    }
    return formatAmount(rawAmount)
  }, [activeInput, toAmountInput, toAmount, formatAmount])

  const displayFromAmount = useMemo(() => {
    const rawAmount = activeInput === 'to' ? (fromAmountFromTo || '') : fromAmount
    // 如果用户正在输入from，保持原样；否则格式化
    if (activeInput === 'from') {
      return rawAmount
    }
    return formatAmount(rawAmount)
  }, [activeInput, fromAmountFromTo, fromAmount, formatAmount])

  // 交换按钮
  const handleSwapClick = useCallback(() => {
    if (!walletConnected) {
      // 不显示消息，因为按钮会触发ConnectButton
      return
    }

    if (!fromToken || !toToken) {
      message.warning(t('swap.noTokenSelected'))
      return
    }

    // 使用实际输入的值（根据activeInput决定）
    const actualFromAmount = activeInput === 'to' ? fromAmountFromTo : fromAmount
    if (!actualFromAmount || parseFloat(actualFromAmount) <= 0) {
      message.warning(t('swap.enterAmount'))
      return
    }

    if (parseFloat(actualFromAmount) > parseFloat(fromBalance.balance || '0')) {
      message.error(t('swap.insufficientBalance'))
      return
    }

    if (needApprove && !fromToken.isNative) {
      handleApprove()
    } else {
      handleSwap()
    }
  }, [
    walletConnected,
    fromToken,
    toToken,
    fromAmount,
    fromBalance.balance,
    needApprove,
    t,
  ])

  // 授权
  const handleApprove = async () => {
    if (!fromToken || !fromTokenChainId || !address) return

    try {
      // 获取DEX Router地址
      const dexRoutersModule = await import('@/config/dexRouters.json')
      const routers = (dexRoutersModule.default || dexRoutersModule) as Record<string, {
        chainName: string
        routers: Array<{
          name: string
          type: string
          address: string
          factory?: string
          quoter?: string
          note: string
        }>
      }>
      const chainIdStr = fromTokenChainId.toString()
      const chainRouters = routers[chainIdStr as keyof typeof routers]
      if (!chainRouters || !chainRouters.routers || chainRouters.routers.length === 0) {
        message.error('未找到DEX Router配置')
        return
      }

      const routerAddress = chainRouters.routers[0].address
      const erc20Service = createERC20Service(fromToken.address, fromTokenChainId)
      
      // 授权最大额度
      const maxAmount = '115792089237316195423570985008687907853269984665640564039457'
      const result = await erc20Service.approve({
        spender: routerAddress,
        amount: maxAmount,
      })

      if (result.success && result.transactionHash) {
        message.loading(t('swap.approving'), 0)
        // 等待交易确认
        const waitResult = await erc20Service.waitForTransaction(result.transactionHash)
        message.destroy()
        if (waitResult.success) {
          message.success('授权成功')
        } else {
          message.error('授权确认失败')
        }
      } else {
        message.error(result.error || '授权失败')
      }
    } catch (error) {
      console.error('授权失败:', error)
      message.error('授权失败')
    }
  }

  // 执行交换
  const handleSwap = async () => {
    // TODO: 实现实际的交换逻辑
    message.info('交换功能开发中...')
  }

  // 获取按钮状态
  const getButtonState = () => {
    if (!walletConnected) {
      return {
        disabled: false,
        text: t('swap.connectWallet'),
        type: 'primary' as const,
        needApprove: false,
        needConnect: true,
        insufficientBalance: false,
      }
    }

    if (!fromToken || !toToken) {
      return {
        disabled: true,
        text: t('swap.noTokenSelected'),
        type: 'default' as const,
        needApprove: false,
        needConnect: false,
        insufficientBalance: false,
      }
    }

    // 使用实际输入的值（根据activeInput决定）
    const actualFromAmount = activeInput === 'to' ? fromAmountFromTo : fromAmount
    const actualToAmount = activeInput === 'to' ? toAmountInput : toAmount

    if (!actualFromAmount || parseFloat(actualFromAmount) <= 0) {
      return {
        disabled: true,
        text: t('swap.enterAmount'),
        type: 'default' as const,
        needApprove: false,
        needConnect: false,
        insufficientBalance: false,
      }
    }

    if (parseFloat(actualFromAmount) > parseFloat(fromBalance.balance || '0')) {
      return {
        disabled: true,
        text: t('swap.insufficientBalance'),
        type: 'default' as const,
        needApprove: false,
        needConnect: false,
        insufficientBalance: true,
      }
    }

    if (needApprove && !fromToken.isNative) {
      return {
        disabled: false,
        text: t('swap.approve'),
        type: 'primary' as const,
        needApprove: true,
        needConnect: false,
        insufficientBalance: false,
      }
    }

    return {
      disabled: false,
      text: t('swap.swap'),
      type: 'primary' as const,
      needApprove: false,
      needConnect: false,
      insufficientBalance: false,
    }
  }

  const buttonState = getButtonState()

  return (
    <PageTitle title={t('pageTitle.swap')}>
      <div className={styles.swapPage}>
        <div className={styles.swapContainer}>
          <Card className={styles.swapCard}>
            <div className={styles.swapHeader}>
              <Title level={4} className={styles.swapTitle}>
                {t('swap.title')}
              </Title>
            </div>

            <div className={styles.swapBody}>
              <SwapInput
                label={t('swap.from')}
                token={fromToken}
                amount={displayFromAmount}
                balance={fromBalance.balance}
                loading={fromBalance.loading || (activeInput === 'to' && reverseQuoteLoading)}
                onTokenSelect={handleFromTokenSelect}
                onAmountChange={handleFromAmountChange}
                onMaxClick={handleMaxClick}
                showMax={true}
                disabled={false}
                selectedChainId={fromTokenChainId}
                onChainSelect={setFromTokenChainId}
                defaultChainId={sharedChainId || toTokenChainId}
                onChainChange={handleFromChainChange}
              />

              <div className={styles.swapArrow}>
                <Button
                  type="text"
                  icon={<ArrowDownOutlined />}
                  className={styles.swapButton}
                  onClick={() => {
                    // 交换from和to
                    const tempToken = fromToken
                    const tempAmount = fromAmount
                    const tempChainId = fromTokenChainId
                    setFromToken(toToken)
                    setToToken(tempToken)
                    // 交换时，根据activeInput决定交换的值
                    if (activeInput === 'to') {
                      setFromAmount(toAmountInput)
                      setToAmountInput(fromAmount)
                    } else {
                      setFromAmount(toAmount || '')
                      setToAmountInput(fromAmount)
                    }
                    setFromTokenChainId(toTokenChainId)
                    setToTokenChainId(tempChainId)
                    // 交换activeInput
                    setActiveInput(activeInput === 'from' ? 'to' : 'from')
                    // 更新共享网络状态为当前有效的网络
                    if (toTokenChainId) {
                      setSharedChainId(toTokenChainId)
                    } else if (fromTokenChainId) {
                      setSharedChainId(fromTokenChainId)
                    }
                  }}
                />
              </div>

              <SwapInput
                label={t('swap.to')}
                token={toToken}
                amount={displayToAmount}
                balance={toBalance.balance}
                loading={toBalance.loading || (activeInput === 'from' && quoteLoading)}
                onTokenSelect={handleToTokenSelect}
                onAmountChange={handleToAmountChange}
                disabled={false}
                showMax={false}
                selectedChainId={toTokenChainId}
                onChainSelect={setToTokenChainId}
                defaultChainId={sharedChainId || fromTokenChainId}
                onChainChange={handleToChainChange}
              />

              {!walletConnected ? (
                <div className={styles.connectButtonWrapper}>
                  <ConnectButton
                    chainStatus="icon"
                    accountStatus={{
                      smallScreen: 'avatar',
                      largeScreen: 'full',
                    }}
                    showBalance={{
                      smallScreen: false,
                      largeScreen: true,
                    }}
                  />
                </div>
              ) : (
                <Button
                  type={buttonState.type}
                  size="large"
                  block
                  icon={<SwapOutlined />}
                  disabled={buttonState.disabled}
                  loading={allowanceLoading}
                  onClick={handleSwapClick}
                  className={styles.actionButton}
                >
                  {buttonState.text}
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </PageTitle>
  )
}

export default SwapPage
