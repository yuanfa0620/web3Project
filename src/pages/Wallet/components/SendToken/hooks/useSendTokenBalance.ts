import { useEffect } from 'react'
import { useAccount, useBalance } from 'wagmi'
import type { Address } from 'viem'
import { getMessage } from '@/utils/message'
import { useTranslation } from 'react-i18next'
import { createERC20Service } from '@/contracts/erc20'
import type { TokenType } from './useSendTokenState'

interface UseSendTokenBalanceParams {
  tokenType: TokenType
  selectedTokenAddress: string
  chainId?: number
  setTokenBalance: (balance: string) => void
  setBalanceLoading: (loading: boolean) => void
  setTokenDecimals: (decimals: number) => void
  setTokenSymbol: (symbol: string) => void
}

/**
 * SendToken 组件的余额管理 Hook
 */
export const useSendTokenBalance = ({
  tokenType,
  selectedTokenAddress,
  chainId,
  setTokenBalance,
  setBalanceLoading,
  setTokenDecimals,
  setTokenSymbol,
}: UseSendTokenBalanceParams) => {
  const { t } = useTranslation()
  const { address } = useAccount()

  // 获取主网币余额
  const { data: nativeBalance, isLoading: nativeBalanceLoading } = useBalance({
    address: (tokenType === 'native' && address ? address : undefined) as Address | undefined,
  })

  // 更新主网币余额
  useEffect(() => {
    if (tokenType === 'native' && nativeBalance) {
      setTokenBalance(nativeBalance.formatted)
      setTokenDecimals(nativeBalance.decimals)
      setTokenSymbol(nativeBalance.symbol)
    }
  }, [tokenType, nativeBalance, setTokenBalance, setTokenDecimals, setTokenSymbol])

  // 获取ERC20代币余额和信息
  useEffect(() => {
    if (tokenType === 'erc20' && selectedTokenAddress && address && chainId) {
      const fetchTokenInfo = async () => {
        setBalanceLoading(true)
        try {
          const erc20Service = createERC20Service(selectedTokenAddress, chainId)
          const result = await erc20Service.getTokenInfo(address)

          if (result.success && result.data) {
            const { balance, decimals, symbol } = result.data
            // balance 已经在 getTokenInfo 中通过 formatUnits 格式化过了，直接使用
            setTokenBalance(balance)
            setTokenDecimals(decimals)
            setTokenSymbol(symbol)
          } else {
            getMessage().error(result.error || t('wallet.sendToken.getTokenInfoFailed'))
            setTokenBalance('0')
          }
        } catch (error) {
          console.error('获取代币信息失败:', error)
          getMessage().error(t('wallet.sendToken.getTokenInfoFailed'))
          setTokenBalance('0')
        } finally {
          setBalanceLoading(false)
        }
      }

      fetchTokenInfo()
    } else if (tokenType === 'erc20' && !selectedTokenAddress) {
      setTokenBalance('0')
    }
  }, [tokenType, selectedTokenAddress, address, chainId, setTokenBalance, setTokenDecimals, setTokenSymbol, setBalanceLoading, t])

  return {
    nativeBalance,
    nativeBalanceLoading,
  }
}

