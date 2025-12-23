/**
 * Mint代币 Hook
 */
import { useState, useCallback, useEffect } from 'react'
import { useAccount, useWaitForTransactionReceipt } from 'wagmi'
import { getMessage } from '@/utils/message'
import { getErrorMessage } from '@/utils/error'
import { useTranslation } from 'react-i18next'
import { createMFTTokenService } from '@/contracts/mftToken'
import { CONFIG } from '@/config/constants'

export const useMintToken = () => {
  const { t } = useTranslation()
  const { address, chainId } = useAccount()
  const [loading, setLoading] = useState(false)
  const [balance, setBalance] = useState<string>('0')
  const [checkingBalance, setCheckingBalance] = useState(false)
  const [hash, setHash] = useState<`0x${string}` | undefined>()

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
      const mftTokenService = createMFTTokenService(tokenAddress, chainId)
      const result = await mftTokenService.getBalance(address)

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

    try {
      const mftTokenService = createMFTTokenService(tokenAddress, chainId)
      const result = await mftTokenService.mint({
        value: CONFIG.MINT.COST,
      })

      if (result.success && result.transactionHash) {
        setHash(result.transactionHash as `0x${string}`)
      } else {
        getMessage().error(result.error || t('profile.mint.mintFailed'))
        setLoading(false)
      }
    } catch (error: any) {
      console.error('Mint失败:', error)
      getMessage().error(getErrorMessage(error) || t('profile.mint.mintFailed'))
      setLoading(false)
    }
  }, [address, chainId, checkBalance, t])

  // 监听交易状态
  useEffect(() => {
    if (isConfirmed && hash) {
      getMessage().success(t('profile.mint.mintSuccess'))
      setLoading(false)
      setHash(undefined) // 重置 hash
      // 刷新余额
      checkBalance()
    }
  }, [isConfirmed, hash, checkBalance, t])

  return {
    mint,
    loading: loading || isConfirming,
    checkingBalance,
    balance,
    checkBalance,
    hash,
    isConfirmed,
  }
}

