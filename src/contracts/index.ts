// 合约服务统一导出
export { ERC20Service, createERC20Service } from './erc20'
export { ERC721Service, createERC721Service } from './erc721'
export { NFTMarketplaceService, createNFTMarketplaceService } from './nftMarketplace/index'
export { WhitelistManagerService, createWhitelistManagerService } from './whitelistManager/index'
export * from './data/types'

// 常用合约地址（示例）
export const COMMON_CONTRACTS = {
  // ERC20 代币
  USDT: {
    [1]: '0xdAC17F958D2ee523a2206206994597C13D831ec7', // Ethereum
    [137]: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', // Polygon
    [56]: '0x55d398326f99059fF775485246999027B3197955', // BSC
  },
  USDC: {
    [1]: '0xA0b86a33E6441b8C4C8C0d4Cecc0c5B9dB3d0b6C', // Ethereum
    [137]: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', // Polygon
    [56]: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', // BSC
  },
  // ERC721 NFT
  BAYC: {
    [1]: '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D', // Ethereum
  },
  MAYC: {
    [1]: '0x60E4d786628Fea6478F785A6d7e704777c86a7c6', // Ethereum
  },
  // NFT 市场合约
  NFTMarketplace: {
    [11155111]: '0x1Ed2E25EaF1D87653A42B8e89A120877d3Fc757b', // Sepolia
  },
  // 白名单管理器合约
  WhitelistManager: {
    [11155111]: '0x7A0c8c02a4936AeBC408bAbAd3d9f222C2FAA056', // Sepolia
  },
} as const
