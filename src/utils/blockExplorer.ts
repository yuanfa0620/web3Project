/**
 * 区块链浏览器工具函数
 */
import { CHAIN_IDS } from '@/config/network'

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
    [CHAIN_IDS.BASE]: 'https://basescan.org',
    // 测试网
    [CHAIN_IDS.SEPOLIA]: 'https://sepolia.etherscan.io',
    [CHAIN_IDS.POLYGON_AMOY]: 'https://amoy.polygonscan.com',
    [CHAIN_IDS.BSC_TESTNET]: 'https://testnet.bscscan.com',
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
  window.open(url, '_blank', 'noopener,noreferrer')
}

/**
 * 跳转到地址详情页面
 * @param address 地址
 * @param chainId 链ID
 */
export const openAddressInExplorer = (address: string, chainId: number): void => {
  const baseUrl = getBlockExplorerUrl(chainId)
  const url = `${baseUrl}/address/${address}`
  window.open(url, '_blank', 'noopener,noreferrer')
}

/**
 * 根据链ID获取NFT详情页面的URL格式
 * 大多数区块链浏览器使用 /token/{contractAddress}?a={tokenId} 格式
 * @param chainId 链ID
 * @returns URL路径模板函数
 */
const getNFTUrlFormatter = (chainId: number): ((contractAddress: string, tokenId: string | number) => string) => {
  // 大多数区块链浏览器使用相同的URL格式
  return (contractAddress: string, tokenId: string | number) => {
    return `/token/${contractAddress}?a=${tokenId}`
  }
}

/**
 * 跳转到NFT详情页面（包含tokenId）
 * 根据不同网络跳转到对应的区块链浏览器NFT详情页面
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
  const formatter = getNFTUrlFormatter(chainId)
  const path = formatter(contractAddress, tokenId)
  const url = `${baseUrl}${path}`
  window.open(url, '_blank', 'noopener,noreferrer')
}

/**
 * 跳转到区块详情页面
 * @param blockNumber 区块号
 * @param chainId 链ID
 */
export const openBlockInExplorer = (blockNumber: number, chainId: number): void => {
  const baseUrl = getBlockExplorerUrl(chainId)
  const url = `${baseUrl}/block/${blockNumber}`
  window.open(url, '_blank', 'noopener,noreferrer')
}

