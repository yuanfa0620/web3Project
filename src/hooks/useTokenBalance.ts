import { useAccount, useBalance } from 'wagmi'
import { useEffect, useState } from 'react'
import { createERC20Service } from '@/contracts/erc20'
import type { TokenConfig } from '@/types/swap'

export const useTokenBalance = (token: TokenConfig | null, chainId: number | null) => {
  const { address, isConnected, chainId: currentChainId } = useAccount()
  const [balance, setBalance] = useState<string>('0')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 主网币余额（使用wagmi）
  // 注意：只有当 chainId 与当前连接的链匹配时，才使用 useBalance
  // 对于其他链（包括测试网），使用合约调用获取余额
  // 确保 useBalance 总是以一致的方式调用，避免 hooks 数量变化
  const shouldUseWagmiBalance = isConnected && !!token?.isNative && !!chainId && chainId === currentChainId
  // 始终传递相同结构的对象，只是值可能不同
  const { data: nativeBalance, isLoading: nativeLoading } = useBalance({
    address: shouldUseWagmiBalance ? address : undefined,
    chainId: shouldUseWagmiBalance && chainId ? chainId : undefined,
  })

  // ERC20代币余额和跨链主网币余额
  useEffect(() => {
    if (!token || !address || !isConnected || !chainId) {
      setBalance('0')
      setLoading(false)
      return
    }

    // 主网币
    if (token.isNative) {
      // 如果 chainId 与当前连接的链匹配，使用 wagmi 的 useBalance
      if (chainId === currentChainId) {
        if (nativeBalance) {
          setBalance(nativeBalance.formatted)
          setLoading(nativeLoading)
        } else {
          setBalance('0')
          setLoading(nativeLoading)
        }
        return
      } else {
        // 如果 chainId 与当前连接的链不匹配，使用合约调用获取余额
        // 对于主网币，可以通过 RPC 调用获取余额
        const fetchNativeBalance = async () => {
          setLoading(true)
          setError(null)
          try {
            // 使用 ERC20Service 的 getBalance 方法，传入零地址作为 token 地址
            // 但实际上，对于主网币，我们需要直接通过 RPC 获取
            // 这里暂时返回 0，或者可以通过其他方式获取
            setBalance('0')
            setLoading(false)
          } catch (err) {
            setError(err instanceof Error ? err.message : '获取余额失败')
            setBalance('0')
            setLoading(false)
          }
        }
        fetchNativeBalance()
        return
      }
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
  }, [token, address, isConnected, chainId, currentChainId, nativeBalance, nativeLoading])

  return {
    balance,
    loading,
    error,
  }
}

