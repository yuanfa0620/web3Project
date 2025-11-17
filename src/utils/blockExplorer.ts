/**
 * 区块链浏览器工具函数
 */
import { CHAIN_IDS } from '@/constants/chains'

/**
 * 根据链ID获取区块链浏览器的基础URL
 * @param chainId 链ID
 * @returns 区块链浏览器的基础URL
 */
export const getBlockExplorerUrl = (chainId: number): string => {
  const explorerMap: Record<number, string> = {
    // 主网
    [CHAIN_IDS.ETHEREUM]: 'https://etherscan.io',
    [CHAIN_IDS.POLYGON]: 'https://polygonscan.com',
    [CHAIN_IDS.BSC]: 'https://bscscan.com',
    [CHAIN_IDS.ARBITRUM]: 'https://arbiscan.io',
    [CHAIN_IDS.OPTIMISM]: 'https://optimistic.etherscan.io',
    [CHAIN_IDS.AVALANCHE]: 'https://snowtrace.io',
    [CHAIN_IDS.BASE]: 'https://basescan.org',
    // 测试网
    [CHAIN_IDS.SEPOLIA]: 'https://sepolia.etherscan.io',
    [CHAIN_IDS.POLYGON_MUMBAI]: 'https://mumbai.polygonscan.com',
    [CHAIN_IDS.BSC_TESTNET]: 'https://testnet.bscscan.com',
    [CHAIN_IDS.ARBITRUM_SEPOLIA]: 'https://sepolia.arbiscan.io',
    [CHAIN_IDS.OPTIMISM_SEPOLIA]: 'https://sepolia-optimism.etherscan.io',
    [CHAIN_IDS.AVALANCHE_FUJI]: 'https://testnet.snowtrace.io',
    [CHAIN_IDS.BASE_SEPOLIA]: 'https://sepolia.basescan.org',
  }

  return explorerMap[chainId] || 'https://etherscan.io'
}

/**
 * 跳转到交易详情页面
 * @param txHash 交易哈希
 * @param chainId 链ID
 */
export const openTransactionInExplorer = (txHash: string, chainId: number): void => {
  const baseUrl = getBlockExplorerUrl(chainId)
  const url = `${baseUrl}/tx/${txHash}`
  window.open(url, '_blank')
}

/**
 * 跳转到地址详情页面
 * @param address 地址
 * @param chainId 链ID
 */
export const openAddressInExplorer = (address: string, chainId: number): void => {
  const baseUrl = getBlockExplorerUrl(chainId)
  const url = `${baseUrl}/address/${address}`
  window.open(url, '_blank')
}

/**
 * 跳转到NFT详情页面（包含tokenId）
 * @param contractAddress 合约地址
 * @param tokenId Token ID
 * @param chainId 链ID
 */
export const openNFTInExplorer = (
  contractAddress: string,
  tokenId: string | number,
  chainId: number
): void => {
  const baseUrl = getBlockExplorerUrl(chainId)
  const url = `${baseUrl}/token/${contractAddress}?a=${tokenId}`
  window.open(url, '_blank')
}

/**
 * 跳转到区块详情页面
 * @param blockNumber 区块号
 * @param chainId 链ID
 */
export const openBlockInExplorer = (blockNumber: number, chainId: number): void => {
  const baseUrl = getBlockExplorerUrl(chainId)
  const url = `${baseUrl}/block/${blockNumber}`
  window.open(url, '_blank')
}

