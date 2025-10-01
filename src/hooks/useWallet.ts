import { useAccount, useBalance, useDisconnect, useSwitchChain } from 'wagmi'
import { useAppDispatch, useAppSelector } from '@/store'
import { setWalletInfo, setBalance, clearWallet } from '@/store/reducers/walletSlice'
import { useEffect } from 'react'

export const useWallet = () => {
  const dispatch = useAppDispatch()
  const { address, chainId, isConnected } = useAccount()
  const { data: balance } = useBalance({ address })
  const { disconnect } = useDisconnect()
  const { switchChain } = useSwitchChain()

  const walletState = useAppSelector((state) => state.wallet)

  // 同步钱包状态到 Redux
  useEffect(() => {
    dispatch(setWalletInfo({
      address: address || null,
      chainId: chainId || null,
      isConnected: isConnected || false,
    }))
  }, [address, chainId, isConnected, dispatch])

  // 同步余额到 Redux
  useEffect(() => {
    if (balance) {
      dispatch(setBalance(balance.formatted))
    }
  }, [balance, dispatch])

  const handleDisconnect = () => {
    disconnect()
    dispatch(clearWallet())
  }

  const handleSwitchChain = (chainId: number) => {
    switchChain({ chainId })
  }

  return {
    ...walletState,
    disconnect: handleDisconnect,
    switchChain: handleSwitchChain,
  }
}
