import { readContract, writeContract, waitForTransactionReceipt } from 'wagmi/actions'
import { parseEther } from 'viem'
import { wagmiConfig } from '@/config/network'
import type { ContractCallResult } from '../data/types'
import NFTMarketPlace_ABI from '../abi/NFTMarketPlace.json'
import { getErrorMessage } from '@/utils/error'

export interface DepositNFTParams {
  nftContract: string
  tokenId: string | bigint
  price: string | bigint
}

export interface BuyNFTParams {
  nftContract: string
  tokenId: string | bigint
}

export interface WithdrawNFTParams {
  nftContract: string
  tokenId: string | bigint
}

export interface SetPriceParams {
  nftContract: string
  tokenId: string | bigint
  price: string | bigint
}

export interface AddToWhitelistParams {
  nftContract: string
  platformFeeRate: string | bigint
}

export interface UpdateWhitelistParams {
  nftContract: string
  platformFeeRate: string | bigint
}

export interface SetWhitelistManagerParams {
  whitelistManager: string
}

export interface WithdrawPlatformFeesParams {
  to: string
  amount: string | bigint
}

export interface EmergencyWithdrawParams {
  nftContract: string
  tokenId: string | bigint
  to: string
}

export interface EmergencyWithdrawBatchParams {
  startIndex: string | bigint
  endIndex: string | bigint
}

export class NFTMarketplaceService {
  private address: string
  private abi: any[]
  private chainId: number

  constructor(address: string, chainId: number) {
    this.address = address
    this.abi = NFTMarketPlace_ABI
    this.chainId = chainId
  }

  // 存入 NFT
  async depositNFT(params: DepositNFTParams): Promise<ContractCallResult<string>> {
    try {
      const price = typeof params.price === 'string' ? BigInt(params.price) : params.price
      const tokenId = typeof params.tokenId === 'string' ? BigInt(params.tokenId) : params.tokenId
      
      const hash = await this.writeContract('depositNFT', [
        params.nftContract,
        tokenId,
        price,
      ])
      return {
        success: true,
        data: hash,
        transactionHash: hash,
      }
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error) || '存入 NFT 失败',
      }
    }
  }

  // 购买 NFT
  async buyNFT(params: BuyNFTParams, value: string | bigint): Promise<ContractCallResult<string>> {
    try {
      const tokenId = typeof params.tokenId === 'string' ? BigInt(params.tokenId) : params.tokenId
      const ethValue = typeof value === 'string' ? parseEther(value) : value
      
      const hash = await this.writeContract('buyNFT', [
        params.nftContract,
        tokenId,
      ], ethValue)
      return {
        success: true,
        data: hash,
        transactionHash: hash,
      }
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error) || '购买 NFT 失败',
      }
    }
  }

  // 提取 NFT
  async withdrawNFT(params: WithdrawNFTParams): Promise<ContractCallResult<string>> {
    try {
      const tokenId = typeof params.tokenId === 'string' ? BigInt(params.tokenId) : params.tokenId
      
      const hash = await this.writeContract('withdrawNFT', [
        params.nftContract,
        tokenId,
      ])
      return {
        success: true,
        data: hash,
        transactionHash: hash,
      }
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error) || '提取 NFT 失败',
      }
    }
  }

  // 设置价格
  async setPrice(params: SetPriceParams): Promise<ContractCallResult<string>> {
    try {
      const tokenId = typeof params.tokenId === 'string' ? BigInt(params.tokenId) : params.tokenId
      const price = typeof params.price === 'string' ? BigInt(params.price) : params.price
      
      const hash = await this.writeContract('setPrice', [
        params.nftContract,
        tokenId,
        price,
      ])
      return {
        success: true,
        data: hash,
        transactionHash: hash,
      }
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error) || '设置价格失败',
      }
    }
  }

  // 添加到白名单
  async addToWhitelist(params: AddToWhitelistParams): Promise<ContractCallResult<string>> {
    try {
      const platformFeeRate = typeof params.platformFeeRate === 'string' 
        ? BigInt(params.platformFeeRate) 
        : params.platformFeeRate
      
      const hash = await this.writeContract('addToWhitelist', [
        params.nftContract,
        platformFeeRate,
      ])
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

  // 从白名单移除
  async removeFromWhitelist(nftContract: string): Promise<ContractCallResult<string>> {
    try {
      const hash = await this.writeContract('removeFromWhitelist', [nftContract])
      return {
        success: true,
        data: hash,
        transactionHash: hash,
      }
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error) || '从白名单移除失败',
      }
    }
  }

  // 更新白名单
  async updateWhitelist(params: UpdateWhitelistParams): Promise<ContractCallResult<string>> {
    try {
      const platformFeeRate = typeof params.platformFeeRate === 'string' 
        ? BigInt(params.platformFeeRate) 
        : params.platformFeeRate
      
      const hash = await this.writeContract('updateWhitelist', [
        params.nftContract,
        platformFeeRate,
      ])
      return {
        success: true,
        data: hash,
        transactionHash: hash,
      }
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error) || '更新白名单失败',
      }
    }
  }

  // 设置白名单管理器
  async setWhitelistManager(params: SetWhitelistManagerParams): Promise<ContractCallResult<string>> {
    try {
      const hash = await this.writeContract('setWhitelistManager', [params.whitelistManager])
      return {
        success: true,
        data: hash,
        transactionHash: hash,
      }
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error) || '设置白名单管理器失败',
      }
    }
  }

  // 暂停合约
  async pause(): Promise<ContractCallResult<string>> {
    try {
      const hash = await this.writeContract('pause', [])
      return {
        success: true,
        data: hash,
        transactionHash: hash,
      }
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error) || '暂停合约失败',
      }
    }
  }

  // 恢复合约
  async unpause(): Promise<ContractCallResult<string>> {
    try {
      const hash = await this.writeContract('unpause', [])
      return {
        success: true,
        data: hash,
        transactionHash: hash,
      }
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error) || '恢复合约失败',
      }
    }
  }

  // 提取平台费用
  async withdrawPlatformFees(params: WithdrawPlatformFeesParams): Promise<ContractCallResult<string>> {
    try {
      const amount = typeof params.amount === 'string' ? BigInt(params.amount) : params.amount
      
      const hash = await this.writeContract('withdrawPlatformFees', [
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
        error: getErrorMessage(error) || '提取平台费用失败',
      }
    }
  }

  // 紧急提取单个 NFT
  async emergencyWithdraw(params: EmergencyWithdrawParams): Promise<ContractCallResult<string>> {
    try {
      const tokenId = typeof params.tokenId === 'string' ? BigInt(params.tokenId) : params.tokenId
      
      const hash = await this.writeContract('emergencyWithdraw', [
        params.nftContract,
        tokenId,
        params.to,
      ])
      return {
        success: true,
        data: hash,
        transactionHash: hash,
      }
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error) || '紧急提取 NFT 失败',
      }
    }
  }

  // 紧急提取所有 NFT
  async emergencyWithdrawAll(): Promise<ContractCallResult<string>> {
    try {
      const hash = await this.writeContract('emergencyWithdrawAll', [])
      return {
        success: true,
        data: hash,
        transactionHash: hash,
      }
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error) || '紧急提取所有 NFT 失败',
      }
    }
  }

  // 批量紧急提取 NFT
  async emergencyWithdrawBatch(params: EmergencyWithdrawBatchParams): Promise<ContractCallResult<string>> {
    try {
      const startIndex = typeof params.startIndex === 'string' ? BigInt(params.startIndex) : params.startIndex
      const endIndex = typeof params.endIndex === 'string' ? BigInt(params.endIndex) : params.endIndex
      
      const hash = await this.writeContract('emergencyWithdrawBatch', [
        startIndex,
        endIndex,
      ])
      return {
        success: true,
        data: hash,
        transactionHash: hash,
      }
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error) || '批量紧急提取 NFT 失败',
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

// 创建 NFTMarketplace 服务实例的工厂函数
export const createNFTMarketplaceService = (address: string, chainId: number) => {
  return new NFTMarketplaceService(address, chainId)
}

