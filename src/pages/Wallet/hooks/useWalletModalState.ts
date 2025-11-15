import { useState, useCallback } from 'react'

/**
 * Wallet 页面模态框状态管理 Hook
 */
export const useWalletModalState = () => {
  const [receiveModalVisible, setReceiveModalVisible] = useState(false)
  const [sendTokenVisible, setSendTokenVisible] = useState(false)

  const openReceiveModal = useCallback(() => {
    setReceiveModalVisible(true)
  }, [])

  const closeReceiveModal = useCallback(() => {
    setReceiveModalVisible(false)
  }, [])

  const openSendTokenModal = useCallback(() => {
    setSendTokenVisible(true)
  }, [])

  const closeSendTokenModal = useCallback(() => {
    setSendTokenVisible(false)
  }, [])

  return {
    receiveModalVisible,
    sendTokenVisible,
    openReceiveModal,
    closeReceiveModal,
    openSendTokenModal,
    closeSendTokenModal,
  }
}

