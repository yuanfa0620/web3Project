import { useState, useCallback } from 'react'

export type TokenType = 'native' | 'erc20'

/**
 * SendToken 组件的状态管理 Hook
 */
export const useSendTokenState = () => {
  const [tokenType, setTokenType] = useState<TokenType>('native')
  const [selectedTokenAddress, setSelectedTokenAddress] = useState<string>('')
  const [tokenBalance, setTokenBalance] = useState<string>('0')
  const [balanceLoading, setBalanceLoading] = useState(false)
  const [tokenDecimals, setTokenDecimals] = useState(18)
  const [tokenSymbol, setTokenSymbol] = useState('ETH')

  // 处理代币类型变化
  const handleTokenTypeChange = useCallback((value: TokenType) => {
    setTokenType(value)
    setSelectedTokenAddress('')
    setTokenBalance('0')
  }, [])

  // 处理代币地址变化
  const handleTokenAddressChange = useCallback((address: string) => {
    setSelectedTokenAddress(address)
  }, [])

  return {
    // 状态
    tokenType,
    selectedTokenAddress,
    tokenBalance,
    balanceLoading,
    tokenDecimals,
    tokenSymbol,

    // Setters
    setTokenType,
    setSelectedTokenAddress,
    setTokenBalance,
    setBalanceLoading,
    setTokenDecimals,
    setTokenSymbol,

    // Handlers
    handleTokenTypeChange,
    handleTokenAddressChange,
  }
}

