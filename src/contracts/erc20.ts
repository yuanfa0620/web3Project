import { readContract, writeContract, waitForTransactionReceipt } from 'wagmi/actions'
import { parseUnits, formatUnits } from 'viem'
import { wagmiConfig } from '@/providers/WalletProvider'
import type { ContractCallResult, ERC20TokenInfo, ERC20TransferParams, ERC20ApprovalParams } from './data/types'
import ERC20_ABI from './abi/ERC20.json'
import { getErrorMessage } from '@/utils/error'
import { getSettledString, getSettledNumber, getSettledBigInt } from '@/utils/promise'

export class ERC20Service {
  private address: string
  private abi: any[]
  private chainId: number

  constructor(address: string, chainId: number) {
    this.address = address
    this.abi = ERC20_ABI
    this.chainId = chainId
  }

  // 获取代币基本信息
  async getTokenInfo(userAddress: string): Promise<ContractCallResult<ERC20TokenInfo>> {
    try {
      // 使用 Promise.allSettled 并行执行所有请求，即使部分失败也能返回成功的数据
      const [nameResult, symbolResult, decimalsResult, totalSupplyResult, balanceResult] = await Promise.allSettled([
        this.readContract('name'),
        this.readContract('symbol'),
        this.readContract('decimals'),
        this.readContract('totalSupply'),
        this.readContract('balanceOf', [userAddress]),
      ])

      // 提取成功的结果，失败的使用默认值或空值
      const name = getSettledString(nameResult, '')
      const symbol = getSettledString(symbolResult, '')
      const decimals = getSettledNumber(decimalsResult, 18)
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
      if (decimalsResult.status === 'rejected') {
        errors.push(`获取精度失败: ${getErrorMessage(decimalsResult.reason)}`)
      }
      if (totalSupplyResult.status === 'rejected') {
        errors.push(`获取总供应量失败: ${getErrorMessage(totalSupplyResult.reason)}`)
      }
      if (balanceResult.status === 'rejected') {
        errors.push(`获取余额失败: ${getErrorMessage(balanceResult.reason)}`)
      }

      // 如果所有请求都失败，返回错误
      if (errors.length === 5) {
        return {
          success: false,
          error: `获取代币信息失败: ${errors.join('; ')}`,
        }
      }

      // 如果至少有一个请求成功，返回部分数据（即使有部分失败）
      return {
        success: true,
        data: {
          name,
          symbol,
          decimals: Number(decimals),
          totalSupply: formatUnits(totalSupply, Number(decimals)),
          balance: formatUnits(balance, Number(decimals)),
        },
        // 如果有部分失败，在返回数据中包含警告信息
        ...(errors.length > 0 && { warning: `部分数据获取失败: ${errors.join('; ')}` }),
      }
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error) || '获取代币信息失败',
      }
    }
  }

  // 获取余额
  async getBalance(userAddress: string): Promise<ContractCallResult<string>> {
    try {
      // 并行获取余额和精度，即使其中一个失败也能处理
      const [balanceResult, decimalsResult] = await Promise.allSettled([
        this.readContract('balanceOf', [userAddress]),
        this.readContract('decimals'),
      ])

      // 如果两个请求都失败，返回错误
      if (balanceResult.status === 'rejected' && decimalsResult.status === 'rejected') {
        return {
          success: false,
          error: `获取余额失败: 余额查询失败(${getErrorMessage(balanceResult.reason)}); 精度查询失败(${getErrorMessage(decimalsResult.reason)})`,
        }
      }

      // 提取成功的结果，失败的使用默认值
      const balance = getSettledBigInt(balanceResult, BigInt(0))
      const decimals = getSettledNumber(decimalsResult, 18) // 默认精度为 18

      // 如果余额查询失败，返回错误（因为这是主要数据）
      if (balanceResult.status === 'rejected') {
        return {
          success: false,
          error: `获取余额失败: ${getErrorMessage(balanceResult.reason)}`,
        }
      }

      return {
        success: true,
        data: formatUnits(balance, decimals),
        // 如果精度查询失败但使用了默认值，添加警告
        ...(decimalsResult.status === 'rejected' && {
          warning: `精度查询失败，使用默认值 18: ${getErrorMessage(decimalsResult.reason)}`
        }),
      }
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error) || '获取余额失败',
      }
    }
  }

  // 获取授权额度
  async getAllowance(owner: string, spender: string): Promise<ContractCallResult<string>> {
    try {
      // 并行获取授权额度和精度，即使其中一个失败也能处理
      const [allowanceResult, decimalsResult] = await Promise.allSettled([
        this.readContract('allowance', [owner, spender]),
        this.readContract('decimals'),
      ])

      // 如果两个请求都失败，返回错误
      if (allowanceResult.status === 'rejected' && decimalsResult.status === 'rejected') {
        return {
          success: false,
          error: `获取授权额度失败: 授权额度查询失败(${getErrorMessage(allowanceResult.reason)}); 精度查询失败(${getErrorMessage(decimalsResult.reason)})`,
        }
      }

      // 提取成功的结果，失败的使用默认值
      const allowance = getSettledBigInt(allowanceResult, BigInt(0))
      const decimals = getSettledNumber(decimalsResult, 18) // 默认精度为 18

      // 如果授权额度查询失败，返回错误（因为这是主要数据）
      if (allowanceResult.status === 'rejected') {
        return {
          success: false,
          error: `获取授权额度失败: ${getErrorMessage(allowanceResult.reason)}`,
        }
      }

      return {
        success: true,
        data: formatUnits(allowance, decimals),
        // 如果精度查询失败但使用了默认值，添加警告
        ...(decimalsResult.status === 'rejected' && {
          warning: `精度查询失败，使用默认值 18: ${getErrorMessage(decimalsResult.reason)}`
        }),
      }
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error) || '获取授权额度失败',
      }
    }
  }

  // 转账
  async transfer(params: ERC20TransferParams): Promise<ContractCallResult<string>> {
    try {
      const decimals = Number((await this.readContract('decimals')) as unknown as number)
      const amount = parseUnits(params.amount, Number(decimals))
      
      const hash = await this.writeContract('transfer', [params.to, amount])
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

  // 授权
  async approve(params: ERC20ApprovalParams): Promise<ContractCallResult<string>> {
    try {
      const decimals = Number((await this.readContract('decimals')) as unknown as number)
      const amount = parseUnits(params.amount, Number(decimals))
      
      const hash = await this.writeContract('approve', [params.spender, amount])
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

  // 代授权转账
  async transferFrom(from: string, to: string, amount: string): Promise<ContractCallResult<string>> {
    try {
      const decimals = Number((await this.readContract('decimals')) as unknown as number)
      const parsedAmount = parseUnits(amount, Number(decimals))
      
      const hash = await this.writeContract('transferFrom', [from, to, parsedAmount])
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
      chainId: this.chainId as any,
    })
  }

  // 写入合约方法
  private async writeContract(functionName: string, args: readonly unknown[]) {
    return writeContract(wagmiConfig, {
      address: this.address as `0x${string}`,
      abi: this.abi,
      functionName,
      args,
      chainId: this.chainId as any,
    })
  }
}

// 创建 ERC20 服务实例的工厂函数
export const createERC20Service = (address: string, chainId: number) => {
  return new ERC20Service(address, chainId)
}
