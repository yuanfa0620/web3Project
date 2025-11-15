/**
 * 表单验证工具函数
 */
import { isAddress } from 'viem'
import type { TFunction } from 'i18next'

/**
 * 创建地址验证器
 * @param t 翻译函数
 * @param currentAddress 当前用户地址（用于防止向自己发送）
 * @returns 地址验证函数
 */
export const createAddressValidator = (
  t: TFunction,
  currentAddress?: string | null
) => {
  return (_: any, value: string) => {
    if (!value) {
      return Promise.reject(new Error(t('wallet.sendToken.toAddressRequired')))
    }

    if (!isAddress(value)) {
      return Promise.reject(new Error(t('wallet.sendToken.toAddressInvalid')))
    }

    if (currentAddress && value.toLowerCase() === currentAddress.toLowerCase()) {
      return Promise.reject(new Error(t('wallet.sendToken.toAddressSelf')))
    }

    return Promise.resolve()
  }
}

/**
 * 创建金额验证器
 * @param t 翻译函数
 * @param balance 当前余额
 * @returns 金额验证函数
 */
export const createAmountValidator = (t: TFunction, balance: string) => {
  return (_: any, value: string) => {
    if (!value) {
      return Promise.reject(new Error(t('wallet.sendToken.amountRequired')))
    }

    const numValue = parseFloat(value)
    if (isNaN(numValue) || numValue <= 0) {
      return Promise.reject(new Error(t('wallet.sendToken.amountInvalid')))
    }

    const balanceNum = parseFloat(balance || '0')
    if (numValue > balanceNum) {
      return Promise.reject(new Error(t('wallet.sendToken.amountInsufficient')))
    }

    return Promise.resolve()
  }
}

/**
 * 创建代币地址验证器
 * @param t 翻译函数
 * @param onValid 当地址有效时的回调函数
 * @returns 代币地址验证函数
 */
export const createTokenAddressValidator = (
  t: TFunction,
  onValid?: (address: string) => void
) => {
  return (_: any, value: string) => {
    if (!value) {
      return Promise.resolve()
    }

    if (!isAddress(value)) {
      return Promise.reject(new Error(t('wallet.sendToken.tokenAddressInvalid')))
    }

    onValid?.(value)
    return Promise.resolve()
  }
}

