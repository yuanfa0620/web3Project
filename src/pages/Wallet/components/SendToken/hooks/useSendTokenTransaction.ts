import { useEffect, useCallback } from 'react'
import { useAccount, useSendTransaction, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseUnits, isAddress } from 'viem'
import type { Address } from 'viem'
import { getMessage } from '@/utils/message'
import { getErrorMessage } from '@/utils/error'
import { useTranslation } from 'react-i18next'
import type { FormInstance } from 'antd'
import ERC20_ABI from '@/contracts/abi/ERC20.json'
import type { TokenType } from './useSendTokenState'

interface UseSendTokenTransactionParams {
  tokenType: TokenType
  selectedTokenAddress: string
  tokenDecimals: number
  form: FormInstance
  onSuccess?: (hash: string) => void
  onCancel: () => void
}

/**
 * SendToken 组件的交易发送 Hook
 */
export const useSendTokenTransaction = ({
  tokenType,
  selectedTokenAddress,
  tokenDecimals,
  form,
  onSuccess,
  onCancel,
}: UseSendTokenTransactionParams) => {
  const { t } = useTranslation()
  const { address } = useAccount()

  // 发送主网币交易
  const {
    data: sendHash,
    isPending: isSending,
    error: sendError,
    sendTransaction,
  } = useSendTransaction()

  // 发送ERC20代币交易
  const {
    data: erc20Hash,
    isPending: isErc20Sending,
    error: erc20Error,
    writeContract,
  } = useWriteContract()

  // 等待交易确认
  const transactionHash = sendHash || erc20Hash
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: transactionHash,
  })

  // 交易成功后的处理
  useEffect(() => {
    if (isConfirmed && transactionHash) {
      getMessage().success(t('wallet.sendToken.transactionSuccess'))
      // 调用成功回调，由父组件处理清空数据和关闭弹窗
      onSuccess?.(transactionHash)
    }
  }, [isConfirmed, transactionHash, onSuccess, t])

  // 错误处理
  useEffect(() => {
    if (sendError) {
      getMessage().error(getErrorMessage(sendError) || t('wallet.sendToken.sendFailed'))
    }
    if (erc20Error) {
      getMessage().error(getErrorMessage(erc20Error) || t('wallet.sendToken.sendFailed'))
    }
  }, [sendError, erc20Error, t])

  // 处理发送
  const handleSend = useCallback(async () => {
    try {
      const values = await form.validateFields()
      const { to, amount } = values

      if (!isAddress(to)) {
        getMessage().error(t('wallet.sendToken.toAddressInvalid'))
        return
      }

      if (!address) {
        getMessage().error(t('wallet.sendToken.connectWalletFirst'))
        return
      }

      const amountInWei = parseUnits(amount, tokenDecimals)

      if (tokenType === 'native') {
        // 发送主网币
        sendTransaction({
          to: to as Address,
          value: amountInWei,
        })
      } else {
        // 发送ERC20代币
        if (!selectedTokenAddress) {
          getMessage().error(t('wallet.sendToken.selectToken'))
          return
        }

        writeContract({
          address: selectedTokenAddress as Address,
          abi: ERC20_ABI,
          functionName: 'transfer',
          args: [to as Address, amountInWei],
        })
      }
    } catch (error) {
      console.error('发送失败:', error)
    }
  }, [tokenType, selectedTokenAddress, tokenDecimals, form, address, sendTransaction, writeContract, t])

  const isLoading = isSending || isErc20Sending || isConfirming

  return {
    transactionHash,
    isLoading,
    isConfirming,
    isConfirmed,
    handleSend,
  }
}

