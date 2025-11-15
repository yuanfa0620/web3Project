import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

interface UseWalletActionsParams {
  openSendTokenModal: () => void
  openReceiveModal: () => void
}

/**
 * Wallet 页面快速操作 Hook
 */
export const useWalletActions = ({
  openSendTokenModal,
  openReceiveModal,
}: UseWalletActionsParams) => {
  const navigate = useNavigate()

  const handleSend = useCallback(() => {
    openSendTokenModal()
  }, [openSendTokenModal])

  const handleSwap = useCallback(() => {
    navigate('/swap')
  }, [navigate])

  const handleReceive = useCallback(() => {
    openReceiveModal()
  }, [openReceiveModal])

  return {
    handleSend,
    handleSwap,
    handleReceive,
  }
}

