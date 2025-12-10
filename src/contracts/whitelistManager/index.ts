import { readContract, writeContract, waitForTransactionReceipt } from 'wagmi/actions'
import { parseEther } from 'viem'
import { wagmiConfig } from '@/config/network'
import type { ContractCallResult } from '../data/types'
import WhitelistManager_ABI from '../abi/WhitelistManager.json'
import { getErrorMessage } from '@/utils/error'

export interface AddToWhitelistParams {
  nftContract: string
  platformFeeRate: string | bigint
}

export interface SetMarketplaceParams {
  marketplace: string
}

export interface SetWhitelistFeeParams {
  fee: string | bigint
}

export interface WithdrawFeesParams {
  to: string
  amount: string | bigint
}

export class WhitelistManagerService {
  private address: string
  private abi: any[]
  private chainId: number

  constructor(address: string, chainId: number) {
    this.address = address
    this.abi = WhitelistManager_ABI
    this.chainId = chainId
  }

  // 添加到白名单（需要支付费用）
  async addToWhitelist(params: AddToWhitelistParams, fee: string | bigint): Promise<ContractCallResult<string>> {
    try {
      const platformFeeRate = typeof params.platformFeeRate === 'string' 
        ? BigInt(params.platformFeeRate) 
        : params.platformFeeRate
      const ethFee = typeof fee === 'string' ? parseEther(fee) : fee
      
      const hash = await this.writeContract('addToWhitelist', [
        params.nftContract,
        platformFeeRate,
      ], ethFee)
      return {
        success: true,
        data: hash,
        transactionHash: hash,
      }
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error) || '添加到白名单失败',
      }
    }
  }

  // 设置市场地址
  async setMarketplace(params: SetMarketplaceParams): Promise<ContractCallResult<string>> {
    try {
      const hash = await this.writeContract('setMarketplace', [params.marketplace])
      return {
        success: true,
        data: hash,
        transactionHash: hash,
      }
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error) || '设置市场地址失败',
      }
    }
  }

  // 设置白名单费用
  async setWhitelistFee(params: SetWhitelistFeeParams): Promise<ContractCallResult<string>> {
    try {
      const fee = typeof params.fee === 'string' ? BigInt(params.fee) : params.fee
      
      const hash = await this.writeContract('setWhitelistFee', [fee])
      return {
        success: true,
        data: hash,
        transactionHash: hash,
      }
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error) || '设置白名单费用失败',
      }
    }
  }

  // 提取费用
  async withdrawFees(params: WithdrawFeesParams): Promise<ContractCallResult<string>> {
    try {
      const amount = typeof params.amount === 'string' ? BigInt(params.amount) : params.amount
      
      const hash = await this.writeContract('withdrawFees', [
        params.to,
        amount,
      ])
      return {
        success: true,
        data: hash,
        transactionHash: hash,
      }
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error) || '提取费用失败',
      }
    }
  }

  // 提取所有费用
  async withdrawAllFees(to: string): Promise<ContractCallResult<string>> {
    try {
      const hash = await this.writeContract('withdrawAllFees', [to])
      return {
        success: true,
        data: hash,
        transactionHash: hash,
      }
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error) || '提取所有费用失败',
      }
    }
  }

  // 转移所有权
  async transferOwnership(newOwner: string): Promise<ContractCallResult<string>> {
    try {
      const hash = await this.writeContract('transferOwnership', [newOwner])
      return {
        success: true,
        data: hash,
        transactionHash: hash,
      }
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error) || '转移所有权失败',
      }
    }
  }

  // 放弃所有权
  async renounceOwnership(): Promise<ContractCallResult<string>> {
    try {
      const hash = await this.writeContract('renounceOwnership', [])
      return {
        success: true,
        data: hash,
        transactionHash: hash,
      }
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error) || '放弃所有权失败',
      }
    }
  }

  // 等待交易确认
  async waitForTransaction(hash: string): Promise<ContractCallResult<any>> {
    try {
      const receipt = await waitForTransactionReceipt(wagmiConfig, {
        hash: hash as `0x${string}`,
      })
      return {
        success: true,
        data: receipt,
      }
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error) || '等待交易确认失败',
      }
    }
  }

  // 读取合约方法
  private async readContract(functionName: string, args: readonly unknown[] = []): Promise<unknown> {
    return readContract(wagmiConfig, {
      address: this.address as `0x${string}`,
      abi: this.abi,
      functionName,
      args,
      chainId: this.chainId as any,
    })
  }

  // 写入合约方法
  private async writeContract(functionName: string, args: readonly unknown[], value?: bigint) {
    return writeContract(wagmiConfig, {
      address: this.address as `0x${string}`,
      abi: this.abi,
      functionName,
      args,
      value,
      chainId: this.chainId as any,
    })
  }
}

// 创建 WhitelistManager 服务实例的工厂函数
export const createWhitelistManagerService = (address: string, chainId: number) => {
  return new WhitelistManagerService(address, chainId)
}

