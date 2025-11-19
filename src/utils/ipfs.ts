/**
 * IPFS上传工具（使用NFT.Storage）
 */
import { NFTStorage } from 'nft.storage'

// NFT.Storage API Token
const NFT_STORAGE_TOKEN = '2408e71a.b9178e142496491eb921d49c7f334b22'//(import.meta.env.VITE_NFT_STORAGE_TOKEN || '').trim()

// 创建 NFT.Storage 客户端实例
const getNFTStorageClient = () => {
  if (!NFT_STORAGE_TOKEN) {
    throw new Error(
      'NFT.Storage配置不完整：请设置 VITE_NFT_STORAGE_TOKEN 环境变量'
    )
  }
  
  // 移除可能的引号或空格
  const cleanToken = NFT_STORAGE_TOKEN.replace(/^["']|["']$/g, '').trim()
  
  if (!cleanToken) {
    throw new Error(
      'NFT.Storage API Key 为空，请检查 VITE_NFT_STORAGE_TOKEN 环境变量'
    )
  }
  
  // 调试信息：显示 token 的前几个字符和后几个字符（不显示完整 token）
  const tokenPreview = cleanToken.length > 10 
    ? `${cleanToken.substring(0, 8)}...${cleanToken.substring(cleanToken.length - 8)}`
    : '***'
  console.log('NFT.Storage Token 预览:', tokenPreview, '长度:', cleanToken.length)
  
  try {
    const client = new NFTStorage({ token: cleanToken })
    return client
  } catch (error: any) {
    console.error('创建 NFT.Storage 客户端时出错:', error)
    throw error
  }
}

// 检查配置是否完整
const isNFTStorageConfigured = () => {
  return !!NFT_STORAGE_TOKEN
}

/**
 * 上传文件到IPFS
 * @param file 要上传的文件
 * @returns IPFS哈希值（CID）
 */
export const uploadFileToIPFS = async (file: File): Promise<string> => {
  try {
    // 检查配置
    if (!isNFTStorageConfigured()) {
      throw new Error(
        'NFT.Storage配置不完整：请设置 VITE_NFT_STORAGE_TOKEN 环境变量'
      )
    }

    const client = getNFTStorageClient()
    
    // 上传文件到 NFT.Storage
    // storeBlob 方法直接上传文件并返回 CID
    console.log('开始上传文件到 NFT.Storage，文件名:', file.name, '大小:', file.size)
    const cid = await client.storeBlob(file)
    console.log('文件上传成功，CID:', cid)

    if (!cid) {
      throw new Error('上传失败：未返回IPFS CID')
    }

    return cid
  } catch (error: any) {
    console.error('IPFS上传错误:', error)
    console.error('错误详情:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
    })
    
    // 处理特定的错误信息
    if (error.message) {
      // API Key 格式错误
      if (
        error.message.includes('malformed') ||
        error.message.includes('failed to parse') ||
        error.message.includes('parse')
      ) {
        throw new Error(
          'NFT.Storage API Key 格式错误：' +
          '请确保您的 API Key 是正确的 UUID 格式。' +
          '请访问 https://nft.storage 重新生成 API Key，并确保：\n' +
          '1. 完整复制整个 API Key（通常是 UUID 格式）\n' +
          '2. 没有包含额外的空格、引号或换行符\n' +
          '3. 环境变量已正确设置并重启了开发服务器'
        )
      }
      
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        throw new Error(
          'NFT.Storage认证失败（401）：' +
          '请检查 API Token 是否正确。可能的原因：\n' +
          '1. API Key 格式不正确（应该是 UUID 格式）\n' +
          '2. API Key 已过期或被撤销\n' +
          '3. 环境变量未正确加载（请重启开发服务器）\n' +
          '请访问 https://nft.storage 检查您的 API Token。'
        )
      }
      
      if (error.message.includes('403') || error.message.includes('Forbidden')) {
        throw new Error(
          'NFT.Storage访问被拒绝：请检查您的 API Token 是否有上传权限。'
        )
      }
      
      if (error.message.includes('quota') || error.message.includes('limit')) {
        throw new Error(
          'NFT.Storage存储配额已满：请访问 https://nft.storage 检查您的存储配额。'
        )
      }
    }
    
    throw new Error(`IPFS上传失败: ${error.message || '未知错误'}`)
  }
}

/**
 * 批量上传文件到IPFS
 * @param files 要上传的文件数组
 * @returns IPFS哈希值数组（每个文件对应一个CID）
 */
export const uploadFilesToIPFS = async (files: File[]): Promise<string[]> => {
  try {
    // 检查配置
    if (!isNFTStorageConfigured()) {
      throw new Error(
        'NFT.Storage配置不完整：请设置 VITE_NFT_STORAGE_TOKEN 环境变量'
      )
    }

    // 逐个上传文件，获取每个文件的单独 CID
    // 这样可以保持与原有行为一致，每个文件都有独立的 CID
    const hashes: string[] = []
    
    for (let i = 0; i < files.length; i++) {
      const hash = await uploadFileToIPFS(files[i])
      hashes.push(hash)
    }

    return hashes
  } catch (error: any) {
    console.error('IPFS批量上传错误:', error)
    throw new Error(`IPFS批量上传失败: ${error.message || '未知错误'}`)
  }
}

/**
 * 上传JSON数据到IPFS
 * @param jsonData JSON对象
 * @returns IPFS哈希值
 */
export const uploadJSONToIPFS = async (jsonData: object): Promise<string> => {
  try {
    const jsonString = JSON.stringify(jsonData)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const file = new File([blob], 'metadata.json', { type: 'application/json' })

    return await uploadFileToIPFS(file)
  } catch (error: any) {
    console.error('IPFS JSON上传错误:', error)
    throw new Error(`IPFS JSON上传失败: ${error.message || '未知错误'}`)
  }
}

/**
 * 获取IPFS文件的URL
 * @param hash IPFS哈希值（CID）
 * @returns IPFS网关URL
 */
export const getIPFSUrl = (hash: string): string => {
  // 使用公共 IPFS 网关
  // 也可以使用 NFT.Storage 的网关: https://nftstorage.link/ipfs/${hash}
  return `https://ipfs.io/ipfs/${hash}`
}

/**
 * 创建OpenSea标准的NFT元数据
 * @param name NFT名称
 * @param description NFT描述
 * @param image IPFS图片哈希或URL
 * @param attributes 属性数组
 * @returns 元数据对象
 */
export const createOpenSeaMetadata = (
  name: string,
  description: string,
  image: string,
  attributes?: Array<{ trait_type: string; value: string | number }>
) => {
  const metadata: any = {
    name,
    description,
    image: image.startsWith('ipfs://') ? image : `ipfs://${image}`,
  }

  if (attributes && attributes.length > 0) {
    metadata.attributes = attributes
  }

  return metadata
}

