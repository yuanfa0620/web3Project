/**
 * Mint代币 Hook
 */
import { useState, useCallback, useEffect } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther, formatUnits } from 'viem'
import { getMessage } from '@/utils/message'
import { getErrorMessage } from '@/utils/error'
import { useTranslation } from 'react-i18next'
import { createERC20Service } from '@/contracts/erc20'
import { CONFIG } from '@/config/constants'
import ERC20_ABI from '@/contracts/abi/ERC20.json'

export const useMintToken = () => {
  const { t } = useTranslation()
  const { address, chainId } = useAccount()
  const [loading, setLoading] = useState(false)
  const [balance, setBalance] = useState<string>('0')
  const [checkingBalance, setCheckingBalance] = useState(false)

  const {
    data: hash,
    isPending: isWriting,
    error: writeError,
    writeContract,
  } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  // 检查代币余额
  const checkBalance = useCallback(async () => {
    if (!address || !chainId) {
      return { success: false, balance: '0' }
    }

    const tokenAddress = CONFIG.TOKEN_CONTRACTS[chainId as keyof typeof CONFIG.TOKEN_CONTRACTS]
    if (!tokenAddress) {
      return { success: false, balance: '0', error: t('profile.mint.tokenContractNotConfigured') }
    }

    try {
      setCheckingBalance(true)
      const erc20Service = createERC20Service(tokenAddress, chainId)
      const result = await erc20Service.getBalance(address)

      if (result.success && result.data) {
        const balanceValue = parseFloat(result.data)
        setBalance(result.data)
        return { success: true, balance: result.data, balanceValue }
      } else {
        return { success: false, balance: '0', error: result.error }
      }
    } catch (error: any) {
      console.error('检查余额失败:', error)
      return { success: false, balance: '0', error: getErrorMessage(error) || t('profile.mint.checkBalanceFailed') }
    } finally {
      setCheckingBalance(false)
    }
  }, [address, chainId, t])

  // Mint代币
  const mint = useCallback(async () => {
    if (!address || !chainId) {
      getMessage().error(t('profile.mint.walletNotConnected'))
      return
    }

    const tokenAddress = CONFIG.TOKEN_CONTRACTS[chainId as keyof typeof CONFIG.TOKEN_CONTRACTS]
    if (!tokenAddress) {
      getMessage().error(t('profile.mint.tokenContractNotConfigured'))
      return
    }

    // 检查余额
    const balanceCheck = await checkBalance()
    if (!balanceCheck.success) {
      getMessage().error(balanceCheck.error || t('profile.mint.checkBalanceFailed'))
      return
    }

    // 检查余额是否超过限制
    if (balanceCheck.balanceValue && balanceCheck.balanceValue >= CONFIG.MINT.MAX_BALANCE) {
      getMessage().warning(t('profile.mint.balanceExceeded', { maxBalance: CONFIG.MINT.MAX_BALANCE }))
      return
    }

    setLoading(true)

    // 调用mint函数，需要支付0.001主网币
    const mintAmount = parseEther('1') // mint 1个代币（可以根据需要调整）
    const cost = parseEther(CONFIG.MINT.COST)

    try {
      writeContract({
        address: tokenAddress as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'mint',
        args: [address, mintAmount],
        value: cost,
      })
    } catch (error: any) {
      console.error('Mint失败:', error)
      getMessage().error(getErrorMessage(error) || t('profile.mint.mintFailed'))
      setLoading(false)
    }
  }, [address, chainId, writeContract, checkBalance, t])

  // 监听交易状态
  useEffect(() => {
    if (isConfirmed && hash) {
      getMessage().success(t('profile.mint.mintSuccess'))
      setLoading(false)
      // 刷新余额
      checkBalance()
    }
  }, [isConfirmed, hash, checkBalance, t])

  // 监听错误
  useEffect(() => {
    if (writeError) {
      getMessage().error(getErrorMessage(writeError) || t('profile.mint.mintFailed'))
      setLoading(false)
    }
  }, [writeError, t])

  return {
    mint,
    loading: loading || isWriting || isConfirming,
    checkingBalance,
    balance,
    checkBalance,
    hash,
    isConfirmed,
  }
}

