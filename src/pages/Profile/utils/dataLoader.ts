/**
 * 个人中心数据加载工具
 */
import transactionsData from 'mock/transactions.json'
import userNFTsData from 'mock/userNFTs.json'
import nftTransactionsData from 'mock/nftTransactions.json'
import type { Transaction, UserNFT, NFTTransaction } from '../types'

/**
 * 根据钱包地址加载交易记录
 * @param address 钱包地址
 * @returns 交易记录列表
 */
export const loadTransactions = (address: string): Transaction[] => {
  // 这里可以根据地址过滤，目前返回所有数据
  return transactionsData as Transaction[]
}

/**
 * 根据钱包地址加载NFT列表
 * @param address 钱包地址
 * @returns NFT列表
 */
export const loadUserNFTs = (address: string): UserNFT[] => {
  // 这里可以根据地址过滤，目前返回所有数据
  return userNFTsData as UserNFT[]
}

/**
 * 根据NFT ID加载交易记录
 * @param nftId NFT ID
 * @returns NFT交易记录列表
 */
export const loadNFTTransactions = (nftId: string): NFTTransaction[] => {
  const transactions = (nftTransactionsData as Record<string, NFTTransaction[]>)[nftId]
  return transactions || []
}

/**
 * 根据NFT ID加载NFT详情
 * @param nftId NFT ID
 * @returns NFT详情
 */
export const loadNFTDetail = (nftId: string): UserNFT | null => {
  const nfts = userNFTsData as UserNFT[]
  return nfts.find((nft) => nft.id === nftId) || null
}

