// 链图标工具函数
// 使用 chainlist.org 的图标 CDN (icons.llamao.fi)
// 这是 DefiLlama 提供的链图标服务，支持大多数主流链

export const getChainIconUrl = (chainId: number): string | undefined => {
  // DefiLlama Chain Icons API
  // URL 格式: https://icons.llamao.fi/icons/chains/rsz_{chainName}.jpg
  // 或者使用: https://chain-icons.s3.amazonaws.com/{chainId}.png
  
  const chainIconMap: Record<number, string> = {
    // 主网
    1: 'https://icons.llamao.fi/icons/chains/rsz_ethereum.jpg', // Ethereum
    137: 'https://icons.llamao.fi/icons/chains/rsz_polygon.jpg', // Polygon
    56: 'https://icons.llamao.fi/icons/chains/rsz_binance.jpg', // BSC (使用 binance 而不是 bnb)
    42161: 'https://icons.llamao.fi/icons/chains/rsz_arbitrum.jpg', // Arbitrum
    10: 'https://icons.llamao.fi/icons/chains/rsz_optimism.jpg', // Optimism
    43114: 'https://icons.llamao.fi/icons/chains/rsz_avalanche.jpg', // Avalanche
    8453: 'https://icons.llamao.fi/icons/chains/rsz_base.jpg', // Base
    
    // 测试网 (使用对应主网的图标)
    11155111: 'https://icons.llamao.fi/icons/chains/rsz_ethereum.jpg', // Sepolia
    80001: 'https://icons.llamao.fi/icons/chains/rsz_polygon.jpg', // Polygon Mumbai
    97: 'https://icons.llamao.fi/icons/chains/rsz_binance.jpg', // BSC Testnet (使用 binance)
    421613: 'https://icons.llamao.fi/icons/chains/rsz_arbitrum.jpg', // Arbitrum Sepolia
    420: 'https://icons.llamao.fi/icons/chains/rsz_optimism.jpg', // Optimism Sepolia
    43113: 'https://icons.llamao.fi/icons/chains/rsz_avalanche.jpg', // Avalanche Fuji
    84532: 'https://icons.llamao.fi/icons/chains/rsz_base.jpg', // Base Sepolia
  }
  
  return chainIconMap[chainId]
}

