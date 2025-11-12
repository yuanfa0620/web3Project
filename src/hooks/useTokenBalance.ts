import { useAccount, useBalance } from 'wagmi'
import { useEffect, useState } from 'react'
import { createERC20Service } from '@/contracts/erc20'
import type { TokenConfig } from '@/types/swap'

export const useTokenBalance = (token: TokenConfig | null, chainId: number | null) => {
  const { address, isConnected } = useAccount()
  const [balance, setBalance] = useState<string>('0')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 主网币余额（使用wagmi）
  const { data: nativeBalance, isLoading: nativeLoading } = useBalance({
    address,
    chainId: chainId || undefined,
    enabled: isConnected && !!token?.isNative && !!chainId,
  })

  // ERC20代币余额
  useEffect(() => {
    if (!token || !address || !isConnected || !chainId) {
      setBalance('0')
      setLoading(false)
      return
    }

    // 主网币
    if (token.isNative) {
      if (nativeBalance) {
        setBalance(nativeBalance.formatted)
        setLoading(nativeLoading)
      } else {
        setBalance('0')
        setLoading(nativeLoading)
      }
      return
    }

    // ERC20代币
    const fetchBalance = async () => {
      setLoading(true)
      setError(null)
      try {
        const erc20Service = createERC20Service(token.address, chainId)
        const result = await erc20Service.getBalance(address)
        if (result.success && result.data) {
          setBalance(result.data)
        } else {
          setError(result.error || '获取余额失败')
          setBalance('0')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : '获取余额失败')
        setBalance('0')
      } finally {
        setLoading(false)
      }
    }

    fetchBalance()
  }, [token, address, isConnected, chainId, nativeBalance, nativeLoading])

  return {
    balance,
    loading,
    error,
  }
}

