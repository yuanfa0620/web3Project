import { readContract, writeContract, waitForTransactionReceipt } from 'wagmi/actions'
import { parseUnits, formatUnits } from 'viem'
import { wagmiConfig } from '@/providers/WalletProvider'
import type { ContractCallResult, ERC20TokenInfo, ERC20TransferParams, ERC20ApprovalParams } from './data/types'
import ERC20_ABI from './abi/ERC20.json'

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
      const name = (await this.readContract('name')) as unknown as string
      const symbol = (await this.readContract('symbol')) as unknown as string
      const decimals = Number((await this.readContract('decimals')) as unknown as number)
      const totalSupply = (await this.readContract('totalSupply')) as unknown as bigint
      const balance = (await this.readContract('balanceOf', [userAddress])) as unknown as bigint

      return {
        success: true,
        data: {
          name,
          symbol,
          decimals: Number(decimals),
          totalSupply: formatUnits(totalSupply, Number(decimals)),
          balance: formatUnits(balance, Number(decimals)),
        },
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '获取代币信息失败',
      }
    }
  }

  // 获取余额
  async getBalance(userAddress: string): Promise<ContractCallResult<string>> {
    try {
      const balance = (await this.readContract('balanceOf', [userAddress])) as unknown as bigint
      const decimals = Number((await this.readContract('decimals')) as unknown as number)
      return {
        success: true,
        data: formatUnits(balance, Number(decimals)),
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '获取余额失败',
      }
    }
  }

  // 获取授权额度
  async getAllowance(owner: string, spender: string): Promise<ContractCallResult<string>> {
    try {
      const allowance = (await this.readContract('allowance', [owner, spender])) as unknown as bigint
      const decimals = Number((await this.readContract('decimals')) as unknown as number)
      return {
        success: true,
        data: formatUnits(allowance, Number(decimals)),
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '获取授权额度失败',
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
        error: error instanceof Error ? error.message : '转账失败',
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
        error: error instanceof Error ? error.message : '授权失败',
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
        error: error instanceof Error ? error.message : '代授权转账失败',
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
        error: error instanceof Error ? error.message : '等待交易确认失败',
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
      chainId: this.chainId,
    })
  }

  // 写入合约方法
  private async writeContract(functionName: string, args: readonly unknown[]) {
    return writeContract(wagmiConfig, {
      address: this.address as `0x${string}`,
      abi: this.abi,
      functionName,
      args,
      chainId: this.chainId,
    })
  }
}

// 创建 ERC20 服务实例的工厂函数
export const createERC20Service = (address: string, chainId: number) => {
  return new ERC20Service(address, chainId)
}
