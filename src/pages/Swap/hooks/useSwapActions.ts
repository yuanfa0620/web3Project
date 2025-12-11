import { useCallback } from 'react'
import { useAccount } from 'wagmi'
import { getMessage } from '@/utils/message'
import { useTranslation } from 'react-i18next'
import { createERC20Service } from '@/contracts/erc20'
import { MAX_TOKEN_APPROVAL_AMOUNT } from '@/constants/approval'
import type { TokenConfig } from '@/types/swap'

interface UseSwapActionsParams {
  fromToken: TokenConfig | null
  fromTokenChainId: number | null
  fromAmount: string
  fromAmountFromTo: string
  activeInput: 'from' | 'to' | null
  isConnected: boolean
  chainId: number | undefined
  switchNetworkSilently: (targetChainId: number) => Promise<boolean>
}

/**
 * Swap 页面的操作逻辑 Hook（授权、交换等）
 */
export const useSwapActions = ({
  fromToken,
  fromTokenChainId,
  fromAmount,
  fromAmountFromTo,
  activeInput,
  isConnected,
  chainId,
  switchNetworkSilently,
}: UseSwapActionsParams) => {
  const { address } = useAccount()
  const { t } = useTranslation()

  // 授权
  const handleApprove = useCallback(async () => {
    if (!fromToken || !fromTokenChainId || !address) return

    // 如果网络不匹配，先无感切换网络
    if (isConnected && chainId && fromTokenChainId !== chainId) {
      const switched = await switchNetworkSilently(fromTokenChainId)
      if (!switched) {
        getMessage().error('切换网络失败，请手动切换网络')
        return
      }
      // 等待网络切换完成（简单延迟，实际应该监听 chainId 变化）
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

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
        getMessage().error('未找到DEX Router配置')
        return
      }

      const routerAddress = chainRouters.routers[0].address
      const erc20Service = createERC20Service(fromToken.address, fromTokenChainId)
      
      // 授权最大额度
      const result = await erc20Service.approve({
        spender: routerAddress,
        amount: MAX_TOKEN_APPROVAL_AMOUNT,
      })

      if (result.success && result.transactionHash) {
        getMessage().loading(t('swap.approving'), 0)
        // 等待交易确认
        const waitResult = await erc20Service.waitForTransaction(result.transactionHash)
        getMessage().destroy()
        if (waitResult.success) {
          getMessage().success('授权成功')
        } else {
          getMessage().error('授权确认失败')
        }
      } else {
        getMessage().error(result.error || '授权失败')
      }
    } catch (error) {
      console.error('授权失败:', error)
      getMessage().error('授权失败')
    }
  }, [fromToken, fromTokenChainId, address, isConnected, chainId, switchNetworkSilently, t])

  // 执行交换
  const handleSwap = useCallback(async () => {
    // 如果网络不匹配，先无感切换网络
    if (isConnected && chainId && fromTokenChainId && fromTokenChainId !== chainId) {
      const switched = await switchNetworkSilently(fromTokenChainId)
      if (!switched) {
        getMessage().error('切换网络失败，请手动切换网络')
        return
      }
      // 等待网络切换完成（简单延迟，实际应该监听 chainId 变化）
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
    
    // TODO: 实现实际的交换逻辑
    getMessage().info('交换功能开发中...')
  }, [isConnected, chainId, fromTokenChainId, switchNetworkSilently])

  return {
    handleApprove,
    handleSwap,
  }
}

