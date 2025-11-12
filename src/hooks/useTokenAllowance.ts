import { useAccount } from 'wagmi'
import { useEffect, useState } from 'react'
import { createERC20Service } from '@/contracts/erc20'
import type { TokenConfig } from '@/types/swap'
import dexRouters from '@/config/dexRouters.json'

export const useTokenAllowance = (
  token: TokenConfig | null,
  chainId: number | null,
  amount: string
) => {
  const { address, isConnected } = useAccount()
  const [allowance, setAllowance] = useState<string>('0')
  const [loading, setLoading] = useState(false)
  const [needApprove, setNeedApprove] = useState(false)

  useEffect(() => {
    if (!token || !address || !isConnected || !chainId || token.isNative) {
      setAllowance('0')
      setNeedApprove(false)
      return
    }

    const fetchAllowance = async () => {
      setLoading(true)
      try {
        // 获取当前链的第一个DEX Router地址
        const chainRouters = (dexRouters as any)[chainId.toString()]
        if (!chainRouters || !chainRouters.routers || chainRouters.routers.length === 0) {
          setAllowance('0')
          setNeedApprove(true)
          return
        }

        const routerAddress = chainRouters.routers[0].address
        const erc20Service = createERC20Service(token.address, chainId)
        const result = await erc20Service.getAllowance(address, routerAddress)

        if (result.success && result.data) {
          const allowanceAmount = parseFloat(result.data)
          const requiredAmount = parseFloat(amount || '0')
          setAllowance(result.data)
          setNeedApprove(allowanceAmount < requiredAmount)
        } else {
          setAllowance('0')
          setNeedApprove(true)
        }
      } catch (err) {
        console.error('获取授权额度失败:', err)
        setAllowance('0')
        setNeedApprove(true)
      } finally {
        setLoading(false)
      }
    }

    fetchAllowance()
  }, [token, address, isConnected, chainId, amount])

  return {
    allowance,
    loading,
    needApprove,
  }
}

