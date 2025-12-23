import { readContract, writeContract, waitForTransactionReceipt } from 'wagmi/actions'
import { parseEther, formatUnits, parseUnits } from 'viem'
import { wagmiConfig } from '@/config/network'
import type { ContractCallResult } from '../data/types'
import MFTToken_ABI from '../abi/MFTToken.json'
import { getErrorMessage } from '@/utils/error'
import { ERC20Service } from '../erc20'
import type {
  MintParams,
  SetFeeRecipientParams,
  SetMintAmountParams,
  SetMintCooldownParams,
  SetMintEnabledParams,
  SetMintFeeParams,
  TransferOwnershipParams,
  MFTTokenMintInfo,
} from './types'

/**
 * MFTToken 服务类
 * 继承 ERC20Service，添加 MFTToken 特有的方法
 */
export class MFTTokenService extends ERC20Service {
  private mftTokenAbi: any[]
  private mftTokenAddress: string
  private mftTokenChainId: number

  constructor(address: string, chainId: number) {
    super(address, chainId)
    // 保存 MFTToken 相关信息
    this.mftTokenAbi = MFTToken_ABI
    this.mftTokenAddress = address
    this.mftTokenChainId = chainId
  }

  // ========== 查询方法 ==========

  /**
   * 查询是否可以铸造
   */
  async canMint(account: string): Promise<ContractCallResult<boolean>> {
    try {
      const result = await this.readMFTContract('canMint', [account]) as boolean
      return { success: true, data: result }
    } catch (error) {
      return { success: false, error: getErrorMessage(error) || '查询是否可以铸造失败' }
    }
  }

  /**
   * 获取剩余冷却时间
   */
  async getRemainingCooldown(account: string): Promise<ContractCallResult<string>> {
    try {
      const result = await this.readMFTContract('getRemainingCooldown', [account]) as bigint
      return { success: true, data: result.toString() }
    } catch (error) {
      return { success: false, error: getErrorMessage(error) || '获取剩余冷却时间失败' }
    }
  }

  /**
   * 获取铸造数量
   */
  async getMintAmount(): Promise<ContractCallResult<string>> {
    try {
      const decimals = Number((await this.readMFTContract('decimals')) as unknown as number)
      const result = await this.readMFTContract('mintAmount') as bigint
      return { success: true, data: formatUnits(result, decimals) }
    } catch (error) {
      return { success: false, error: getErrorMessage(error) || '获取铸造数量失败' }
    }
  }

  /**
   * 获取铸造冷却时间
   */
  async getMintCooldown(): Promise<ContractCallResult<string>> {
    try {
      const result = await this.readMFTContract('mintCooldown') as bigint
      return { success: true, data: result.toString() }
    } catch (error) {
      return { success: false, error: getErrorMessage(error) || '获取铸造冷却时间失败' }
    }
  }

  /**
   * 查询是否启用铸造
   */
  async getMintEnabled(): Promise<ContractCallResult<boolean>> {
    try {
      const result = await this.readMFTContract('mintEnabled') as boolean
      return { success: true, data: result }
    } catch (error) {
      return { success: false, error: getErrorMessage(error) || '查询是否启用铸造失败' }
    }
  }

  /**
   * 获取铸造费用
   */
  async getMintFee(): Promise<ContractCallResult<string>> {
    try {
      const result = await this.readMFTContract('mintFee') as bigint
      return { success: true, data: formatUnits(result, 18) } // ETH 使用 18 位小数
    } catch (error) {
      return { success: false, error: getErrorMessage(error) || '获取铸造费用失败' }
    }
  }

  /**
   * 获取费用接收地址
   */
  async getFeeRecipient(): Promise<ContractCallResult<string>> {
    try {
      const result = await this.readMFTContract('feeRecipient') as string
      return { success: true, data: result }
    } catch (error) {
      return { success: false, error: getErrorMessage(error) || '获取费用接收地址失败' }
    }
  }

  /**
   * 获取上次铸造时间
   */
  async getLastMintTime(account: string): Promise<ContractCallResult<string>> {
    try {
      const result = await this.readMFTContract('lastMintTime', [account]) as bigint
      return { success: true, data: result.toString() }
    } catch (error) {
      return { success: false, error: getErrorMessage(error) || '获取上次铸造时间失败' }
    }
  }

  /**
   * 获取余额阈值
   */
  async getBalanceThreshold(): Promise<ContractCallResult<string>> {
    try {
      const decimals = Number((await this.readMFTContract('decimals')) as unknown as number)
      const result = await this.readMFTContract('BALANCE_THRESHOLD') as bigint
      return { success: true, data: formatUnits(result, decimals) }
    } catch (error) {
      return { success: false, error: getErrorMessage(error) || '获取余额阈值失败' }
    }
  }

  /**
   * 获取所有者地址
   */
  async getOwner(): Promise<ContractCallResult<string>> {
    try {
      const result = await this.readMFTContract('owner') as string
      return { success: true, data: result }
    } catch (error) {
      return { success: false, error: getErrorMessage(error) || '获取所有者地址失败' }
    }
  }

  /**
   * 获取完整的铸造信息
   */
  async getMintInfo(account: string): Promise<ContractCallResult<MFTTokenMintInfo>> {
    try {
      const [
        canMintResult,
        mintEnabledResult,
        mintAmountResult,
        mintFeeResult,
        mintCooldownResult,
        remainingCooldownResult,
        lastMintTimeResult,
        balanceThresholdResult,
        feeRecipientResult,
        ownerResult,
      ] = await Promise.allSettled([
        this.canMint(account),
        this.getMintEnabled(),
        this.getMintAmount(),
        this.getMintFee(),
        this.getMintCooldown(),
        this.getRemainingCooldown(account),
        this.getLastMintTime(account),
        this.getBalanceThreshold(),
        this.getFeeRecipient(),
        this.getOwner(),
      ])

      const canMint = canMintResult.status === 'fulfilled' && canMintResult.value.success
        ? canMintResult.value.data!
        : false
      const mintEnabled = mintEnabledResult.status === 'fulfilled' && mintEnabledResult.value.success
        ? mintEnabledResult.value.data!
        : false
      const mintAmount = mintAmountResult.status === 'fulfilled' && mintAmountResult.value.success
        ? mintAmountResult.value.data!
        : '0'
      const mintFee = mintFeeResult.status === 'fulfilled' && mintFeeResult.value.success
        ? mintFeeResult.value.data!
        : '0'
      const mintCooldown = mintCooldownResult.status === 'fulfilled' && mintCooldownResult.value.success
        ? mintCooldownResult.value.data!
        : '0'
      const remainingCooldown = remainingCooldownResult.status === 'fulfilled' && remainingCooldownResult.value.success
        ? remainingCooldownResult.value.data!
        : '0'
      const lastMintTime = lastMintTimeResult.status === 'fulfilled' && lastMintTimeResult.value.success
        ? lastMintTimeResult.value.data!
        : '0'
      const balanceThreshold = balanceThresholdResult.status === 'fulfilled' && balanceThresholdResult.value.success
        ? balanceThresholdResult.value.data!
        : '0'
      const feeRecipient = feeRecipientResult.status === 'fulfilled' && feeRecipientResult.value.success
        ? feeRecipientResult.value.data!
        : ''
      const owner = ownerResult.status === 'fulfilled' && ownerResult.value.success
        ? ownerResult.value.data!
        : ''

      return {
        success: true,
        data: {
          canMint,
          mintEnabled,
          mintAmount,
          mintFee,
          mintCooldown,
          remainingCooldown,
          lastMintTime,
          balanceThreshold,
          feeRecipient,
          owner,
        },
      }
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error) || '获取铸造信息失败',
      }
    }
  }

  // ========== 写入方法 ==========

  /**
   * 铸造代币
   */
  async mint(params: MintParams): Promise<ContractCallResult<string>> {
    try {
      const value = typeof params.value === 'string' ? parseEther(params.value) : params.value
      const hash = await this.writeMFTContract('mint', [], value)
      return {
        success: true,
        data: hash,
        transactionHash: hash,
      }
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error) || '铸造代币失败',
      }
    }
  }

  /**
   * 设置费用接收地址
   */
  async setFeeRecipient(params: SetFeeRecipientParams): Promise<ContractCallResult<string>> {
    try {
      const hash = await this.writeMFTContract('setFeeRecipient', [params.newRecipient])
      return {
        success: true,
        data: hash,
        transactionHash: hash,
      }
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error) || '设置费用接收地址失败',
      }
    }
  }

  /**
   * 设置铸造数量
   */
  async setMintAmount(params: SetMintAmountParams): Promise<ContractCallResult<string>> {
    try {
      const decimals = Number((await this.readMFTContract('decimals')) as unknown as number)
      const amount = typeof params.newAmount === 'string'
        ? parseUnits(params.newAmount, decimals)
        : BigInt(params.newAmount.toString())
      const hash = await this.writeMFTContract('setMintAmount', [amount])
      return {
        success: true,
        data: hash,
        transactionHash: hash,
      }
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error) || '设置铸造数量失败',
      }
    }
  }

  /**
   * 设置铸造冷却时间
   */
  async setMintCooldown(params: SetMintCooldownParams): Promise<ContractCallResult<string>> {
    try {
      const cooldown = typeof params.newCooldown === 'string'
        ? BigInt(params.newCooldown)
        : params.newCooldown
      const hash = await this.writeMFTContract('setMintCooldown', [cooldown])
      return {
        success: true,
        data: hash,
        transactionHash: hash,
      }
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error) || '设置铸造冷却时间失败',
      }
    }
  }

  /**
   * 设置是否启用铸造
   */
  async setMintEnabled(params: SetMintEnabledParams): Promise<ContractCallResult<string>> {
    try {
      const hash = await this.writeMFTContract('setMintEnabled', [params.enabled])
      return {
        success: true,
        data: hash,
        transactionHash: hash,
      }
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error) || '设置是否启用铸造失败',
      }
    }
  }

  /**
   * 设置铸造费用
   */
  async setMintFee(params: SetMintFeeParams): Promise<ContractCallResult<string>> {
    try {
      const fee = typeof params.newFee === 'string'
        ? parseEther(params.newFee)
        : params.newFee
      const hash = await this.writeMFTContract('setMintFee', [fee])
      return {
        success: true,
        data: hash,
        transactionHash: hash,
      }
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error) || '设置铸造费用失败',
      }
    }
  }

  /**
   * 转移所有权
   */
  async transferOwnership(params: TransferOwnershipParams): Promise<ContractCallResult<string>> {
    try {
      const hash = await this.writeMFTContract('transferOwnership', [params.newOwner])
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

  /**
   * 放弃所有权
   */
  async renounceOwnership(): Promise<ContractCallResult<string>> {
    try {
      const hash = await this.writeMFTContract('renounceOwnership', [])
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

  // ========== 私有方法 ==========

  /**
   * 读取合约方法（使用 MFTToken ABI）
   */
  private async readMFTContract(functionName: string, args: readonly unknown[] = []): Promise<unknown> {
    return readContract(wagmiConfig, {
      address: this.mftTokenAddress as `0x${string}`,
      abi: this.mftTokenAbi,
      functionName,
      args,
      chainId: this.mftTokenChainId as any,
    })
  }

  /**
   * 写入合约方法（使用 MFTToken ABI）
   */
  private async writeMFTContract(functionName: string, args: readonly unknown[], value?: bigint): Promise<`0x${string}`> {
    const hash = await writeContract(wagmiConfig, {
      address: this.mftTokenAddress as `0x${string}`,
      abi: this.mftTokenAbi,
      functionName,
      args,
      value,
      chainId: this.mftTokenChainId as any,
    })
    return hash
  }

  /**
   * 等待交易确认
   */
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
}

// 创建 MFTToken 服务实例的工厂函数
export const createMFTTokenService = (address: string, chainId: number) => {
  return new MFTTokenService(address, chainId)
}

