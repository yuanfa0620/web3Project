/**
 * ERC721合约部署服务
 */
import { deployContract, waitForTransactionReceipt } from 'wagmi/actions'
import { wagmiConfig } from '@/providers/WalletProvider'
import { ERC721_ABI } from './abi'
import { ERC721_BYTECODE } from './bytecode'
import type { Address } from 'viem'

export interface DeployERC721Params {
  name: string
  symbol: string
  baseURI: string
  royaltyRecipient: Address
  royaltyFee: number // 版税百分比，例如 5 表示 5%
  owner: Address
}

/**
 * 部署ERC721合约
 * @param params 部署参数
 * @returns 合约地址和交易哈希
 */
export const deployERC721 = async (params: DeployERC721Params) => {
  try {
    // 计算版税（以基点为单位，10000 = 100%）
    const royaltyFeeBps = BigInt(Math.floor(params.royaltyFee * 100))

    // 部署合约
    const hash = await deployContract(wagmiConfig, {
      abi: ERC721_ABI,
      bytecode: ERC721_BYTECODE,
      args: [
        params.name,
        params.symbol,
        params.baseURI,
        params.royaltyRecipient,
        royaltyFeeBps,
        params.owner,
      ],
    })

    // 等待交易确认
    const receipt = await waitForTransactionReceipt(wagmiConfig, {
      hash,
    })

    if (!receipt.contractAddress) {
      throw new Error('合约部署失败：未返回合约地址')
    }

    return {
      contractAddress: receipt.contractAddress as Address,
      transactionHash: hash,
      blockNumber: receipt.blockNumber,
    }
  } catch (error: any) {
    console.error('ERC721部署错误:', error)
    throw new Error(`合约部署失败: ${error.message || '未知错误'}`)
  }
}

