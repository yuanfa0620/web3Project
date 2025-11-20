import { useState, useEffect, useMemo, useCallback } from 'react'
import { useAccount, useSwitchChain } from 'wagmi'
import { CHAIN_IDS } from '@/config/network'
import type { TokenConfig } from '@/types/swap'

/**
 * Swap 页面的状态管理 Hook
 */
export const useSwapState = () => {
  const { chainId, isConnected } = useAccount()
  const { switchChain } = useSwitchChain()

  const [fromToken, setFromToken] = useState<TokenConfig | null>(null)
  const [toToken, setToToken] = useState<TokenConfig | null>(null)
  const [fromAmount, setFromAmount] = useState<string>('')
  const [toAmountInput, setToAmountInput] = useState<string>('') // to输入框的值
  const [fromTokenChainId, setFromTokenChainId] = useState<number | null>(null)
  const [toTokenChainId, setToTokenChainId] = useState<number | null>(null)
  // 跟踪最后选择的代币网络（用于确定默认网络）
  const [lastSelectedChainId, setLastSelectedChainId] = useState<number | null>(null)
  // 跟踪当前正在编辑的输入框：'from' | 'to' | null
  const [activeInput, setActiveInput] = useState<'from' | 'to' | null>(null)

  // 当钱包连接状态或链ID变化时，如果用户没有选择代币，更新最后选择的网络
  useEffect(() => {
    // 如果用户还没有选择代币，则根据钱包状态更新最后选择的网络
    if (!fromToken && !toToken && isConnected && chainId) {
      setLastSelectedChainId(chainId)
    }
  }, [isConnected, chainId, fromToken, toToken])

  // 计算默认网络ID的逻辑：
  // 1. 如果用户已经选择了代币，使用最后选择的代币的网络
  // 2. 如果两个代币网络不一样，使用最后选择的代币的网络
  // 3. 如果用户没有选择代币，使用连接钱包的网络
  const getDefaultChainId = useMemo(() => {
    // 如果用户已经选择了代币，优先使用最后选择的代币的网络
    if (lastSelectedChainId) {
      return lastSelectedChainId
    }
    // 如果用户已经选择了代币，使用其中一个代币的网络
    if (toTokenChainId) {
      return toTokenChainId
    }
    if (fromTokenChainId) {
      return fromTokenChainId
    }
    // 如果用户没有选择代币，使用连接钱包的网络
    if (isConnected && chainId) {
      return chainId
    }
    // 默认使用以太坊主网
    return CHAIN_IDS.ETHEREUM
  }, [lastSelectedChainId, fromTokenChainId, toTokenChainId, isConnected, chainId])

  // 无感切换网络（不显示弹窗，直接切换）
  const switchNetworkSilently = useCallback(async (targetChainId: number): Promise<boolean> => {
    if (!isConnected || !chainId) {
      return false
    }
    
    if (targetChainId === chainId) {
      return true // 已经是目标网络
    }
    
    try {
      if (switchChain) {
        await switchChain({ chainId: targetChainId })
        // 等待网络切换完成（通过监听 chainId 变化）
        return true
      }
      return false
    } catch (error) {
      console.error('切换网络失败:', error)
      return false
    }
  }, [isConnected, chainId, switchChain])

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
      setLastSelectedChainId(chainId) // 更新最后选择的网络
    }
    // 清空输入状态
    setFromAmount('')
    setToAmountInput('')
    setActiveInput(null)
    // 不再在选择代币时检查网络，只在授权/交易时切换
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
      setLastSelectedChainId(chainId) // 更新最后选择的网络
    }
    // 清空输入状态
    setFromAmount('')
    setToAmountInput('')
    setActiveInput(null)
    // 不再在选择代币时检查网络，只在授权/交易时切换
  }, [fromToken, fromTokenChainId])

  // 处理to的chainId变化（只有当用户选择了新代币时才更新）
  const handleToChainChange = useCallback((chainId: number) => {
    // 只有当用户实际选择了新代币时，才会调用这个函数
    // 此时不需要清空 fromToken，因为用户可能只是切换了网络但没有选择新代币
    setToTokenChainId(chainId)
    setLastSelectedChainId(chainId) // 更新最后选择的网络
  }, [])

  // 处理from的chainId变化（只有当用户选择了新代币时才更新）
  const handleFromChainChange = useCallback((chainId: number) => {
    // 只有当用户实际选择了新代币时，才会调用这个函数
    // 此时不需要清空 toToken，因为用户可能只是切换了网络但没有选择新代币
    setFromTokenChainId(chainId)
    setLastSelectedChainId(chainId) // 更新最后选择的网络
  }, [])

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

  // Max按钮
  const handleMaxClick = useCallback((balance: string) => {
    if (balance) {
      setFromAmount(balance)
      setActiveInput('from')
    }
  }, [])

  return {
    // 状态
    fromToken,
    toToken,
    fromAmount,
    toAmountInput,
    fromTokenChainId,
    toTokenChainId,
    activeInput,
    getDefaultChainId,
    
    // 方法
    setFromToken,
    setToToken,
    setFromAmount,
    setToAmountInput,
    setFromTokenChainId,
    setToTokenChainId,
    setActiveInput,
    handleFromTokenSelect,
    handleToTokenSelect,
    handleFromChainChange,
    handleToChainChange,
    handleFromAmountChange,
    handleToAmountChange,
    handleMaxClick,
    switchNetworkSilently,
  }
}

