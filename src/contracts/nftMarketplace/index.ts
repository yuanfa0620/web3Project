import { readContract, writeContract, waitForTransactionReceipt, simulateContract } from 'wagmi/actions'
import { parseEther } from 'viem'
import { wagmiConfig } from '@/config/network'
import type { ContractCallResult } from '../data/types'
import NFTMarketPlace_ABI from '../abi/NFTMarketPlace.json'
import { getErrorMessage } from '@/utils/error'
import type {
  DepositNFTParams,
  BuyNFTByOrderIdParams,
  WithdrawNFTByOrderIdParams,
  SetPriceByOrderIdParams,
  AddToWhitelistParams,
  UpdateWhitelistParams,
  SetWhitelistManagerParams,
  WithdrawPlatformFeesParams,
  EmergencyWithdrawParams,
  EmergencyWithdrawBatchParams,
} from './types'

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
      
      // 预估 gas
      const { request } = await simulateContract(wagmiConfig, {
        address: this.address as `0x${string}`,
        abi: this.abi,
        functionName: 'depositNFT',
        args: [params.nftContract, tokenId, price],
        chainId: this.chainId as any,
      })
      const gas = request.gas
      
      const hash = await this.writeContract('depositNFT', [
        params.nftContract,
        tokenId,
        price,
      ], undefined, gas)
      
      // 等待交易完成
      const receipt = await waitForTransactionReceipt(wagmiConfig, {
        hash: hash as `0x${string}`,
      })
      
      return {
        success: true,
        data: hash,
        transactionHash: hash,
        receipt,
      }
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error) || '存入 NFT 失败',
      }
    }
  }

  // 通过 orderId 购买 NFT
  async buyNFTByOrderId(params: BuyNFTByOrderIdParams, value: string | bigint): Promise<ContractCallResult<string>> {
    try {
      const orderId = typeof params.orderId === 'string' ? BigInt(params.orderId) : params.orderId
      const ethValue = typeof value === 'string' ? parseEther(value) : value
      
      // 预估 gas
      const { request } = await simulateContract(wagmiConfig, {
        address: this.address as `0x${string}`,
        abi: this.abi,
        functionName: 'buyNFTByOrderId',
        args: [orderId],
        value: ethValue,
        chainId: this.chainId as any,
      })
      const gas = request.gas
      
      const hash = await this.writeContract('buyNFTByOrderId', [orderId], ethValue, gas)
      
      // 等待交易完成
      const receipt = await waitForTransactionReceipt(wagmiConfig, {
        hash: hash as `0x${string}`,
      })
      
      return {
        success: true,
        data: hash,
        transactionHash: hash,
        receipt,
      }
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error) || '购买 NFT 失败',
      }
    }
  }

  // 通过 orderId 提取 NFT
  async withdrawNFTByOrderId(params: WithdrawNFTByOrderIdParams): Promise<ContractCallResult<string>> {
    try {
      const orderId = typeof params.orderId === 'string' ? BigInt(params.orderId) : params.orderId
      
      // 预估 gas
      const { request } = await simulateContract(wagmiConfig, {
        address: this.address as `0x${string}`,
        abi: this.abi,
        functionName: 'withdrawNFTByOrderId',
        args: [orderId],
        chainId: this.chainId as any,
      })
      const gas = request.gas
      
      const hash = await this.writeContract('withdrawNFTByOrderId', [orderId], undefined, gas)
      
      // 等待交易完成
      const receipt = await waitForTransactionReceipt(wagmiConfig, {
        hash: hash as `0x${string}`,
      })
      
      return {
        success: true,
        data: hash,
        transactionHash: hash,
        receipt,
      }
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error) || '提取 NFT 失败',
      }
    }
  }

  // 通过 orderId 设置价格
  async setPriceByOrderId(params: SetPriceByOrderIdParams): Promise<ContractCallResult<string>> {
    try {
      const orderId = typeof params.orderId === 'string' ? BigInt(params.orderId) : params.orderId
      const price = typeof params.price === 'string' ? BigInt(params.price) : params.price
      
      // 预估 gas
      const { request } = await simulateContract(wagmiConfig, {
        address: this.address as `0x${string}`,
        abi: this.abi,
        functionName: 'setPriceByOrderId',
        args: [orderId, price],
        chainId: this.chainId as any,
      })
      const gas = request.gas
      
      const hash = await this.writeContract('setPriceByOrderId', [orderId, price], undefined, gas)
      
      // 等待交易完成
      const receipt = await waitForTransactionReceipt(wagmiConfig, {
        hash: hash as `0x${string}`,
      })
      
      return {
        success: true,
        data: hash,
        transactionHash: hash,
        receipt,
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
      
      // 预估 gas
      const { request } = await simulateContract(wagmiConfig, {
        address: this.address as `0x${string}`,
        abi: this.abi,
        functionName: 'addToWhitelist',
        args: [params.nftContract, platformFeeRate],
        chainId: this.chainId as any,
      })
      const gas = request.gas
      
      const hash = await this.writeContract('addToWhitelist', [
        params.nftContract,
        platformFeeRate,
      ], undefined, gas)
      
      // 等待交易完成
      const receipt = await waitForTransactionReceipt(wagmiConfig, {
        hash: hash as `0x${string}`,
      })
      
      return {
        success: true,
        data: hash,
        transactionHash: hash,
        receipt,
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
      // 预估 gas
      const { request } = await simulateContract(wagmiConfig, {
        address: this.address as `0x${string}`,
        abi: this.abi,
        functionName: 'removeFromWhitelist',
        args: [nftContract],
        chainId: this.chainId as any,
      })
      const gas = request.gas
      
      const hash = await this.writeContract('removeFromWhitelist', [nftContract], undefined, gas)
      
      // 等待交易完成
      const receipt = await waitForTransactionReceipt(wagmiConfig, {
        hash: hash as `0x${string}`,
      })
      
      return {
        success: true,
        data: hash,
        transactionHash: hash,
        receipt,
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
      
      // 预估 gas
      const { request } = await simulateContract(wagmiConfig, {
        address: this.address as `0x${string}`,
        abi: this.abi,
        functionName: 'updateWhitelist',
        args: [params.nftContract, platformFeeRate],
        chainId: this.chainId as any,
      })
      const gas = request.gas
      
      const hash = await this.writeContract('updateWhitelist', [
        params.nftContract,
        platformFeeRate,
      ], undefined, gas)
      
      // 等待交易完成
      const receipt = await waitForTransactionReceipt(wagmiConfig, {
        hash: hash as `0x${string}`,
      })
      
      return {
        success: true,
        data: hash,
        transactionHash: hash,
        receipt,
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
      // 预估 gas
      const { request } = await simulateContract(wagmiConfig, {
        address: this.address as `0x${string}`,
        abi: this.abi,
        functionName: 'setWhitelistManager',
        args: [params.whitelistManager],
        chainId: this.chainId as any,
      })
      const gas = request.gas
      
      const hash = await this.writeContract('setWhitelistManager', [params.whitelistManager], undefined, gas)
      
      // 等待交易完成
      const receipt = await waitForTransactionReceipt(wagmiConfig, {
        hash: hash as `0x${string}`,
      })
      
      return {
        success: true,
        data: hash,
        transactionHash: hash,
        receipt,
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
      // 预估 gas
      const { request } = await simulateContract(wagmiConfig, {
        address: this.address as `0x${string}`,
        abi: this.abi,
        functionName: 'pause',
        args: [],
        chainId: this.chainId as any,
      })
      const gas = request.gas
      
      const hash = await this.writeContract('pause', [], undefined, gas)
      
      // 等待交易完成
      const receipt = await waitForTransactionReceipt(wagmiConfig, {
        hash: hash as `0x${string}`,
      })
      
      return {
        success: true,
        data: hash,
        transactionHash: hash,
        receipt,
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
      // 预估 gas
      const { request } = await simulateContract(wagmiConfig, {
        address: this.address as `0x${string}`,
        abi: this.abi,
        functionName: 'unpause',
        args: [],
        chainId: this.chainId as any,
      })
      const gas = request.gas
      
      const hash = await this.writeContract('unpause', [], undefined, gas)
      
      // 等待交易完成
      const receipt = await waitForTransactionReceipt(wagmiConfig, {
        hash: hash as `0x${string}`,
      })
      
      return {
        success: true,
        data: hash,
        transactionHash: hash,
        receipt,
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
      
      // 预估 gas
      const { request } = await simulateContract(wagmiConfig, {
        address: this.address as `0x${string}`,
        abi: this.abi,
        functionName: 'withdrawPlatformFees',
        args: [params.to, amount],
        chainId: this.chainId as any,
      })
      const gas = request.gas
      
      const hash = await this.writeContract('withdrawPlatformFees', [
        params.to,
        amount,
      ], undefined, gas)
      
      // 等待交易完成
      const receipt = await waitForTransactionReceipt(wagmiConfig, {
        hash: hash as `0x${string}`,
      })
      
      return {
        success: true,
        data: hash,
        transactionHash: hash,
        receipt,
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
      
      // 预估 gas
      const { request } = await simulateContract(wagmiConfig, {
        address: this.address as `0x${string}`,
        abi: this.abi,
        functionName: 'emergencyWithdraw',
        args: [params.nftContract, tokenId, params.to],
        chainId: this.chainId as any,
      })
      const gas = request.gas
      
      const hash = await this.writeContract('emergencyWithdraw', [
        params.nftContract,
        tokenId,
        params.to,
      ], undefined, gas)
      
      // 等待交易完成
      const receipt = await waitForTransactionReceipt(wagmiConfig, {
        hash: hash as `0x${string}`,
      })
      
      return {
        success: true,
        data: hash,
        transactionHash: hash,
        receipt,
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
      // 预估 gas
      const { request } = await simulateContract(wagmiConfig, {
        address: this.address as `0x${string}`,
        abi: this.abi,
        functionName: 'emergencyWithdrawAll',
        args: [],
        chainId: this.chainId as any,
      })
      const gas = request.gas
      
      const hash = await this.writeContract('emergencyWithdrawAll', [], undefined, gas)
      
      // 等待交易完成
      const receipt = await waitForTransactionReceipt(wagmiConfig, {
        hash: hash as `0x${string}`,
      })
      
      return {
        success: true,
        data: hash,
        transactionHash: hash,
        receipt,
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
      
      // 预估 gas
      const { request } = await simulateContract(wagmiConfig, {
        address: this.address as `0x${string}`,
        abi: this.abi,
        functionName: 'emergencyWithdrawBatch',
        args: [startIndex, endIndex],
        chainId: this.chainId as any,
      })
      const gas = request.gas
      
      const hash = await this.writeContract('emergencyWithdrawBatch', [
        startIndex,
        endIndex,
      ], undefined, gas)
      
      // 等待交易完成
      const receipt = await waitForTransactionReceipt(wagmiConfig, {
        hash: hash as `0x${string}`,
      })
      
      return {
        success: true,
        data: hash,
        transactionHash: hash,
        receipt,
      }
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error) || '批量紧急提取 NFT 失败',
      }
    }
  }

  // 通过 orderId 获取订单信息
  async getOrderById(orderId: string | bigint): Promise<ContractCallResult<any>> {
    try {
      const orderIdBigInt = typeof orderId === 'string' ? BigInt(orderId) : orderId
      const result = await this.readContract('getOrderById', [orderIdBigInt])
      return {
        success: true,
        data: result,
      }
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error) || '获取订单信息失败',
      }
    }
  }

  // 通过 NFT 合约地址和 tokenId 获取 orderId
  async getOrderIdByNFT(nftContract: string, tokenId: string | bigint): Promise<ContractCallResult<bigint>> {
    try {
      const tokenIdBigInt = typeof tokenId === 'string' ? BigInt(tokenId) : tokenId
      const result = await this.readContract('getOrderIdByNFT', [nftContract, tokenIdBigInt]) as bigint
      return {
        success: true,
        data: result,
      }
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error) || '获取订单 ID 失败',
      }
    }
  }

  // 获取 NFT 信息
  async getNFTInfo(nftContract: string, tokenId: string | bigint): Promise<ContractCallResult<any>> {
    try {
      const tokenIdBigInt = typeof tokenId === 'string' ? BigInt(tokenId) : tokenId
      const result = await this.readContract('getNFTInfo', [nftContract, tokenIdBigInt])
      return {
        success: true,
        data: result,
      }
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error) || '获取 NFT 信息失败',
      }
    }
  }

  // 检查 NFT 合约是否在白名单中
  async isWhitelisted(nftContract: string): Promise<ContractCallResult<boolean>> {
    try {
      const result = await this.readContract('isWhitelisted', [nftContract]) as boolean
      return {
        success: true,
        data: result,
      }
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error) || '检查白名单状态失败',
      }
    }
  }

  // 获取总订单数
  async getTotalOrderCount(): Promise<ContractCallResult<bigint>> {
    try {
      const result = await this.readContract('getTotalOrderCount', []) as bigint
      return {
        success: true,
        data: result,
      }
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error) || '获取总订单数失败',
      }
    }
  }

  // 获取用户订单列表
  async getUserOrders(user: string, offset: string | bigint, limit: string | bigint): Promise<ContractCallResult<any[]>> {
    try {
      const offsetBigInt = typeof offset === 'string' ? BigInt(offset) : offset
      const limitBigInt = typeof limit === 'string' ? BigInt(limit) : limit
      const result = await this.readContract('getUserOrders', [user, offsetBigInt, limitBigInt]) as any[]
      return {
        success: true,
        data: result,
      }
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error) || '获取用户订单列表失败',
      }
    }
  }

  // 获取所有订单列表
  async getAllListings(offset: string | bigint, limit: string | bigint): Promise<ContractCallResult<any[]>> {
    try {
      const offsetBigInt = typeof offset === 'string' ? BigInt(offset) : offset
      const limitBigInt = typeof limit === 'string' ? BigInt(limit) : limit
      const result = await this.readContract('getAllListings', [offsetBigInt, limitBigInt]) as any[]
      return {
        success: true,
        data: result,
      }
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error) || '获取所有订单列表失败',
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
  private async writeContract(functionName: string, args: readonly unknown[], value?: bigint, gas?: bigint) {
    return writeContract(wagmiConfig, {
      address: this.address as `0x${string}`,
      abi: this.abi,
      functionName,
      args,
      value,
      gas,
      chainId: this.chainId as any,
    })
  }
}

// 创建 NFTMarketplace 服务实例的工厂函数
export const createNFTMarketplaceService = (address: string, chainId: number) => {
  return new NFTMarketplaceService(address, chainId)
}

