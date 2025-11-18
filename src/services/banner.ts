/**
 * 横幅数据服务
 * 从 API 获取横幅通知数据
 */
import bannerData from 'mock/banner.json'

export interface BannerItem {
  id: number | string
  content: string
}

/**
 * 获取横幅通知数据
 * @returns Promise<BannerItem[]>
 */
export const fetchBannerData = async (): Promise<BannerItem[]> => {
  // 模拟 API 调用延迟
  await new Promise((resolve) => setTimeout(resolve, 100))
  
  // 实际项目中这里应该是真实的 API 调用
  // const response = await fetch('/api/banner')
  // return response.json()
  
  return bannerData as BannerItem[]
}

