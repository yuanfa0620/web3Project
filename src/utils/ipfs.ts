/**
 * IPFS上传工具（使用Infura IPFS）
 */
import axios from 'axios'
import { getInfuraKey } from '@/config/constants'

// Infura IPFS API endpoint
const INFURA_IPFS_GATEWAY = 'https://ipfs.infura.io:5001'
const INFURA_IPFS_PROJECT_ID = import.meta.env.VITE_INFURA_IPFS_PROJECT_ID || getInfuraKey()
const INFURA_IPFS_PROJECT_SECRET = import.meta.env.VITE_INFURA_IPFS_SECRET || ''

// 检查配置是否完整
const isInfuraConfigured = () => {
  return !!(INFURA_IPFS_PROJECT_ID && INFURA_IPFS_PROJECT_SECRET)
}

/**
 * 将字符串转换为Base64编码（浏览器环境）
 * @param str 要编码的字符串
 * @returns Base64编码的字符串
 */
const encodeBase64 = (str: string): string => {
  try {
    // 使用浏览器原生的 btoa 函数
    return btoa(unescape(encodeURIComponent(str)))
  } catch (error) {
    // 如果 btoa 失败，使用 TextEncoder + btoa 的组合
    const encoder = new TextEncoder()
    const bytes = encoder.encode(str)
    const binary = String.fromCharCode(...bytes)
    return btoa(binary)
  }
}

/**
 * 上传文件到IPFS
 * @param file 要上传的文件
 * @returns IPFS哈希值
 */
export const uploadFileToIPFS = async (file: File): Promise<string> => {
  try {
    // 检查配置
    if (!isInfuraConfigured()) {
      throw new Error(
        'IPFS配置不完整：请设置 VITE_INFURA_IPFS_PROJECT_ID 和 VITE_INFURA_IPFS_PROJECT_SECRET 环境变量'
      )
    }

    const formData = new FormData()
    formData.append('file', file)

    // 构建 Basic Auth 认证头
    const authString = `Basic ${encodeBase64(`${INFURA_IPFS_PROJECT_ID}:${INFURA_IPFS_PROJECT_SECRET}`)}`

    // Infura IPFS API endpoint
    const response = await axios.post(
      `${INFURA_IPFS_GATEWAY}/api/v0/add`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: authString,
        },
      }
    )

    // Infura返回的数据格式可能是对象或数组
    if (response.data) {
      if (Array.isArray(response.data)) {
        // 数组格式，取第一个
        if (response.data[0] && response.data[0].Hash) {
          return response.data[0].Hash
        }
      } else if (response.data.Hash) {
        // 对象格式
        return response.data.Hash
      }
    }

    throw new Error('上传失败：未返回IPFS哈希')
  } catch (error: any) {
    console.error('IPFS上传错误:', error)
    
    // 处理特定的错误信息
    if (error.response) {
      const status = error.response.status
      const data = error.response.data
      
      if (status === 401 || status === 403) {
        throw new Error(
          'IPFS认证失败：请检查 Project ID 和 Secret 是否正确，或确认项目已启用 IPFS 服务。' +
          '访问 https://infura.io/dashboard 检查项目设置。'
        )
      }
      
      if (data && typeof data === 'string' && data.includes('does not have access')) {
        throw new Error(
          'IPFS服务未启用：您的 Infura 项目未启用 IPFS 服务。' +
          '请访问 https://infura.io/dashboard 启用 IPFS 服务，或联系 Infura 支持申请访问权限。'
        )
      }
      
      throw new Error(`IPFS上传失败: ${data?.message || data || error.message || '未知错误'}`)
    }
    
    throw new Error(`IPFS上传失败: ${error.message || '未知错误'}`)
  }
}

/**
 * 批量上传文件到IPFS
 * @param files 要上传的文件数组
 * @returns IPFS哈希值数组
 */
export const uploadFilesToIPFS = async (files: File[]): Promise<string[]> => {
  try {
    // 逐个上传文件（Infura IPFS API可能不支持批量上传）
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
 * @param hash IPFS哈希值
 * @returns IPFS网关URL
 */
export const getIPFSUrl = (hash: string): string => {
  // 使用Infura IPFS网关
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

