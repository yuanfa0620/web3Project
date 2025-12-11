import React, { useCallback } from 'react'
import { Card, Button, Typography } from 'antd'
import { SwapOutlined, ArrowDownOutlined } from '@ant-design/icons'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useTranslation } from 'react-i18next'
import { useAccount } from 'wagmi'
import { PageTitle } from '@/components/PageTitle'
import { SwapInput } from '@/components/SwapInput'
import { useWallet } from '@/hooks/useWallet'
import { useTokenBalance } from '@/hooks/useTokenBalance'
import { useSwapQuote } from '@/hooks/useSwapQuote'
import { useTokenAllowance } from '@/hooks/useTokenAllowance'
import { useSwapState } from './hooks/useSwapState'
import { useSwapActions } from './hooks/useSwapActions'
import { useSwapButtonState } from './hooks/useSwapButtonState'
import { useSwapDisplayAmount } from './hooks/useSwapDisplayAmount'
import { useMessage } from '@/hooks/useMessage'
import styles from './index.module.less'

const { Title } = Typography

const SwapPage: React.FC = () => {
  const { t } = useTranslation()
  const message = useMessage()
  const { chainId, isConnected } = useAccount()
  const { isConnected: walletConnected } = useWallet()

  // 状态管理
  const {
    fromToken,
    toToken,
    fromAmount,
    toAmountInput,
    fromTokenChainId,
    toTokenChainId,
    activeInput,
    getDefaultChainId,
    handleFromTokenSelect,
    handleToTokenSelect,
    handleFromChainChange,
    handleToChainChange,
    handleFromAmountChange,
    handleToAmountChange,
    handleMaxClick: handleMaxClickState,
    switchNetworkSilently,
    setFromToken,
    setToToken,
    setFromAmount,
    setToAmountInput,
    setFromTokenChainId,
    setToTokenChainId,
    setActiveInput,
  } = useSwapState()

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

  // 操作逻辑（授权、交换）
  const { handleApprove, handleSwap } = useSwapActions({
    fromToken,
    fromTokenChainId,
    fromAmount,
    fromAmountFromTo,
    activeInput,
    isConnected,
    chainId,
    switchNetworkSilently,
  })

  // 显示数量格式化
  const { displayFromAmount, displayToAmount } = useSwapDisplayAmount({
    activeInput,
    fromAmount,
    fromAmountFromTo,
    toAmount,
    toAmountInput,
  })

  // 按钮状态
  const buttonState = useSwapButtonState({
    walletConnected,
    fromToken,
    toToken,
    fromAmount,
    fromAmountFromTo,
    toAmount,
    toAmountInput,
    fromBalance: fromBalance.balance || '0',
    needApprove,
    activeInput,
  })

  // Max按钮
  const handleMaxClick = useCallback(() => {
    handleMaxClickState(fromBalance.balance || '')
  }, [fromBalance.balance, handleMaxClickState])

  // 交换按钮点击处理
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
    fromAmountFromTo,
    fromBalance.balance,
    needApprove,
    activeInput,
    handleApprove,
    handleSwap,
    t,
    message,
  ])

  // 交换from和to
  const handleSwapTokens = useCallback(() => {
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
  }, [
    fromToken,
    toToken,
    fromAmount,
    toAmountInput,
    toAmount,
    fromTokenChainId,
    toTokenChainId,
    activeInput,
    setFromToken,
    setToToken,
    setFromAmount,
    setToAmountInput,
    setFromTokenChainId,
    setToTokenChainId,
    setActiveInput,
  ])

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
                defaultChainId={getDefaultChainId}
                onChainChange={handleFromChainChange}
                otherSelectedToken={toToken}
                otherSelectedChainId={toTokenChainId}
              />

              <div className={styles.swapArrow}>
                <Button
                  type="text"
                  icon={<ArrowDownOutlined />}
                  className={styles.swapButton}
                  onClick={handleSwapTokens}
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
                defaultChainId={getDefaultChainId}
                onChainChange={handleToChainChange}
                otherSelectedToken={fromToken}
                otherSelectedChainId={fromTokenChainId}
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
