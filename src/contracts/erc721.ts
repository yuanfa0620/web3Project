import { readContract, writeContract, waitForTransactionReceipt } from 'wagmi/actions'
import type { ContractCallResult, ERC721TokenInfo, ERC721TransferParams, ERC721ApprovalParams, ERC721TokenMetadata } from './data/types'
import { wagmiConfig } from '@/config/network'
import ERC721_ABI from './abi/ERC721.json'
import { getErrorMessage } from '@/utils/error'
import { getSettledString, getSettledBigInt } from '@/utils/promise'

export class ERC721Service {
  private address: string
  private abi: any[]
  private chainId: number

  constructor(address: string, chainId: number) {
    this.address = address
    this.abi = ERC721_ABI
    this.chainId = chainId
  }

  // 获取 NFT 基本信息
  async getTokenInfo(userAddress: string): Promise<ContractCallResult<ERC721TokenInfo>> {
    try {
      // 使用 Promise.allSettled 并行执行所有请求，即使部分失败也能返回成功的数据
      const [nameResult, symbolResult, totalSupplyResult, balanceResult] = await Promise.allSettled([
        this.readContract('name'),
        this.readContract('symbol'),
        this.readContract('totalSupply'),
        this.readContract('balanceOf', [userAddress]),
      ])

      // 提取成功的结果，失败的使用默认值或空值
      const name = getSettledString(nameResult, '')
      const symbol = getSettledString(symbolResult, '')
      const totalSupply = getSettledBigInt(totalSupplyResult, BigInt(0))
      const balance = getSettledBigInt(balanceResult, BigInt(0))

      // 收集错误信息
      const errors: string[] = []
      if (nameResult.status === 'rejected') {
        errors.push(`获取名称失败: ${getErrorMessage(nameResult.reason)}`)
      }
      if (symbolResult.status === 'rejected') {
        errors.push(`获取符号失败: ${getErrorMessage(symbolResult.reason)}`)
      }
      if (totalSupplyResult.status === 'rejected') {
        errors.push(`获取总供应量失败: ${getErrorMessage(totalSupplyResult.reason)}`)
      }
      if (balanceResult.status === 'rejected') {
        errors.push(`获取余额失败: ${getErrorMessage(balanceResult.reason)}`)
      }

      // 如果所有请求都失败，返回错误
      if (errors.length === 4) {
        return {
          success: false,
          error: `获取 NFT 信息失败: ${errors.join('; ')}`,
        }
      }

      // 如果至少有一个请求成功，返回部分数据（即使有部分失败）
      return {
        success: true,
        data: {
          name,
          symbol,
          totalSupply: totalSupply.toString(),
          balance: balance.toString(),
          owner: userAddress,
        },
        // 如果有部分失败，在返回数据中包含警告信息
        ...(errors.length > 0 && { warning: `部分数据获取失败: ${errors.join('; ')}` }),
      }
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error) || '获取 NFT 信息失败',
      }
    }
  }

  // 获取用户持有的 NFT 数量
  async getBalance(userAddress: string): Promise<ContractCallResult<string>> {
    try {
      const balance = (await this.readContract('balanceOf', [userAddress])) as unknown as bigint
      return {
        success: true,
        data: balance.toString(),
      }
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error) || '获取余额失败',
      }
    }
  }

  // 获取 NFT 所有者
  async getOwner(tokenId: string): Promise<ContractCallResult<string>> {
    try {
      const owner = (await this.readContract('ownerOf', [tokenId])) as unknown as string
      return {
        success: true,
        data: owner,
      }
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error) || '获取所有者失败',
      }
    }
  }

  // 获取授权信息
  async getApproved(tokenId: string): Promise<ContractCallResult<string>> {
    try {
      const approved = (await this.readContract('getApproved', [tokenId])) as unknown as string
      return {
        success: true,
        data: approved,
      }
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error) || '获取授权信息失败',
      }
    }
  }

  // 检查是否全部授权
  async isApprovedForAll(owner: string, operator: string): Promise<ContractCallResult<boolean>> {
    try {
      const approved = (await this.readContract('isApprovedForAll', [owner, operator])) as unknown as boolean
      return {
        success: true,
        data: approved,
      }
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error) || '检查授权失败',
      }
    }
  }

  // 获取 Token URI
  async getTokenURI(tokenId: string): Promise<ContractCallResult<string>> {
    try {
      const uri = (await this.readContract('tokenURI', [tokenId])) as unknown as string
      return {
        success: true,
        data: uri,
      }
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error) || '获取 Token URI 失败',
      }
    }
  }

  // 获取 Token 元数据
  async getTokenMetadata(tokenId: string): Promise<ContractCallResult<ERC721TokenMetadata>> {
    try {
      const uri = await this.getTokenURI(tokenId)
      if (!uri.success) {
        return {
          success: false,
          error: uri.error,
        }
      }

      // 这里应该根据 URI 获取实际的元数据
      // 实际项目中需要根据 URI 的类型（IPFS、HTTP 等）来获取数据
      const metadata: ERC721TokenMetadata = {
        tokenId,
        name: `Token #${tokenId}`,
        description: `This is token #${tokenId}`,
        image: '',
        attributes: [],
      }

      return {
        success: true,
        data: metadata,
      }
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error) || '获取 Token 元数据失败',
      }
    }
  }

  // 转账
  async transfer(params: ERC721TransferParams): Promise<ContractCallResult<string>> {
    try {
      const hash = await this.writeContract('safeTransferFrom', [params.from, params.to, params.tokenId])
      return {
        success: true,
        data: hash,
        transactionHash: hash,
      }
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error) || '转账失败',
      }
    }
  }

  // 代授权转账
  async transferFrom(params: ERC721TransferParams): Promise<ContractCallResult<string>> {
    try {
      const hash = await this.writeContract('transferFrom', [params.from, params.to, params.tokenId])
      return {
        success: true,
        data: hash,
        transactionHash: hash,
      }
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error) || '代授权转账失败',
      }
    }
  }

  // 授权单个 NFT
  async approve(params: ERC721ApprovalParams): Promise<ContractCallResult<string>> {
    try {
      const hash = await this.writeContract('approve', [params.to, params.tokenId])
      return {
        success: true,
        data: hash,
        transactionHash: hash,
      }
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error) || '授权失败',
      }
    }
  }

  // 设置全部授权
  async setApprovalForAll(operator: string, approved: boolean): Promise<ContractCallResult<string>> {
    try {
      const hash = await this.writeContract('setApprovalForAll', [operator, approved])
      return {
        success: true,
        data: hash,
        transactionHash: hash,
      }
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error) || '设置全部授权失败',
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
  private async readContract(functionName: string, args: readonly unknown[] = []) : Promise<unknown> {
    return readContract(wagmiConfig, {
      address: this.address as `0x${string}`,
      abi: this.abi,
      functionName,
      args,
    })
  }

  // 写入合约方法
  private async writeContract(functionName: string, args: any[]) {
    return writeContract(wagmiConfig, {
      address: this.address as `0x${string}`,
      abi: this.abi,
      functionName,
      args,
    })
  }
}

// 创建 ERC721 服务实例的工厂函数
export const createERC721Service = (address: string, chainId: number) => {
  return new ERC721Service(address, chainId)
}
