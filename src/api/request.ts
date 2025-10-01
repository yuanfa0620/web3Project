import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios'
import { message, Spin } from 'antd'
import { createRoot } from 'react-dom/client'
import React from 'react'
import type { ApiResponse, ApiError, RequestConfig, AxiosInstanceConfig } from './data/types'

// 全局 loading 状态管理
class LoadingManager {
  private loadingCount = 0
  private container: HTMLElement | null = null
  private root: any = null

  show(text = '加载中...') {
    this.loadingCount++
    if (this.loadingCount === 1) {
      this.createLoading(text)
    }
  }

  hide() {
    this.loadingCount = Math.max(0, this.loadingCount - 1)
    if (this.loadingCount === 0) {
      this.destroyLoading()
    }
  }

  private createLoading(text: string) {
    this.container = document.createElement('div')
    this.container.id = 'global-loading'
    this.container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
    `
    document.body.appendChild(this.container)
    
    this.root = createRoot(this.container)
    this.root.render(
      React.createElement(Spin, {
        size: 'large',
        tip: text,
        style: { color: '#fff' }
      })
    )
  }

  private destroyLoading() {
    if (this.container && this.root) {
      this.root.unmount()
      document.body.removeChild(this.container)
      this.container = null
      this.root = null
    }
  }
}

const loadingManager = new LoadingManager()

// 创建 axios 实例
export function createAxiosInstance(config: AxiosInstanceConfig): AxiosInstance {
  const instance = axios.create({
    baseURL: config.baseURL,
    timeout: config.timeout || 10000,
    headers: {
      'Content-Type': 'application/json',
      ...config.headers,
    },
  })

  // 请求拦截器
  instance.interceptors.request.use(
    (config: any) => {
      // 添加认证 token
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error: AxiosError) => {
      return Promise.reject(error)
    }
  )

  // 响应拦截器
  instance.interceptors.response.use(
    (response: AxiosResponse<ApiResponse>) => {
      const { data } = response
      
      // 统一处理业务错误
      if (data.code !== 200 && data.code !== 0) {
        message.error(data.message || '请求失败')
        return Promise.reject(new Error(data.message || '请求失败'))
      }
      
      return response
    },
    (error: AxiosError<ApiError>) => {
      // 处理网络错误
      if (error.code === 'ECONNABORTED') {
        message.error('请求超时，请稍后重试')
      } else if (error.response?.status === 401) {
        message.error('登录已过期，请重新登录')
        localStorage.removeItem('token')
        window.location.href = '/login'
      } else if (error.response?.status && error.response?.status >= 500) {
        message.error('服务器错误，请稍后重试')
      } else {
        message.error(error.message || '网络错误')
      }
      
      return Promise.reject(error)
    }
  )

  return instance
}

// 默认实例
const defaultInstance = createAxiosInstance({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  showGlobalLoading: true,
  globalLoadingText: '加载中...',
})

// 请求方法封装
export class ApiService {
  private instance: AxiosInstance
  private showGlobalLoading: boolean
  private globalLoadingText: string

  constructor(instance: AxiosInstance, showGlobalLoading = true, globalLoadingText = '加载中...') {
    this.instance = instance
    this.showGlobalLoading = showGlobalLoading
    this.globalLoadingText = globalLoadingText
  }

  private async request<T = any>(config: RequestConfig): Promise<T> {
    const {
      url,
      method = 'GET',
      data,
      params,
      headers,
      timeout,
      showLoading = this.showGlobalLoading,
      loadingText = this.globalLoadingText,
    } = config

    // 显示 loading
    if (showLoading) {
      loadingManager.show(loadingText)
    }

    try {
      const response = await this.instance.request<ApiResponse<T>>({
        url,
        method,
        data,
        params,
        headers,
        timeout,
      })

      return response.data.data
    } finally {
      // 隐藏 loading
      if (showLoading) {
        loadingManager.hide()
      }
    }
  }

  // GET 请求
  async get<T = any>(url: string, params?: any, config?: Partial<RequestConfig>): Promise<T> {
    return this.request<T>({
      url,
      method: 'GET',
      params,
      ...config,
    })
  }

  // POST 请求
  async post<T = any>(url: string, data?: any, config?: Partial<RequestConfig>): Promise<T> {
    return this.request<T>({
      url,
      method: 'POST',
      data,
      ...config,
    })
  }

  // PUT 请求
  async put<T = any>(url: string, data?: any, config?: Partial<RequestConfig>): Promise<T> {
    return this.request<T>({
      url,
      method: 'PUT',
      data,
      ...config,
    })
  }

  // DELETE 请求
  async delete<T = any>(url: string, config?: Partial<RequestConfig>): Promise<T> {
    return this.request<T>({
      url,
      method: 'DELETE',
      ...config,
    })
  }

  // PATCH 请求
  async patch<T = any>(url: string, data?: any, config?: Partial<RequestConfig>): Promise<T> {
    return this.request<T>({
      url,
      method: 'PATCH',
      data,
      ...config,
    })
  }
}

// 创建多个服务实例
export const apiService = new ApiService(defaultInstance)
export const userApiService = new ApiService(
  createAxiosInstance({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/user`,
  }),
  true,
  '用户数据加载中...'
)
export const tokenApiService = new ApiService(
  createAxiosInstance({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/token`,
  }),
  true,
  '代币数据加载中...'
)
export const transactionApiService = new ApiService(
  createAxiosInstance({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/transaction`,
  }),
  false // 交易相关请求不显示全局 loading
)

export default apiService
