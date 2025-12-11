/**
 * API 请求封装模块
 * 
 * 功能说明：
 * - 封装 axios 请求，提供统一的请求/响应拦截器
 * - 自动处理登录 Token（认证令牌）的添加和过期处理
 * - 统一处理错误提示和加载状态
 * 
 * 重要说明：
 * - 本文件中的 "token" 指的是用户登录认证令牌（JWT Token），用于身份验证
 * - 与代币（Token）概念完全不同，请勿混淆
 * - token 存储在 localStorage 中，键名为 'token'
 * - token 通过 Bearer Token 方式添加到请求头：Authorization: Bearer <token>
 */

import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { getMessage } from '@/utils/message'
import type { ApiResponse, RequestConfig, AxiosInstanceConfig } from './modules/data/types'

// 扩展AxiosRequestConfig类型
declare module 'axios' {
  interface AxiosRequestConfig {
    showLoading?: boolean
    showError?: boolean
  }
}

class Request {
  private instance: AxiosInstance
  private loadingCount = 0
  private defaultShowLoading: boolean
  private defaultShowError: boolean

  constructor(config: AxiosInstanceConfig) {
    // 设置默认值
    this.defaultShowLoading = config.showGlobalLoading !== false
    this.defaultShowError = true

    const defaultBaseURL = import.meta.env.VITE_API_BASE_URL || '/api'
    
    this.instance = axios.create({
      baseURL: config.baseURL || defaultBaseURL,
      timeout: config.timeout || 10000,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config) => {
        /**
         * 添加登录 Token（认证令牌）
         * 
         * 说明：
         * - 这里的 token 是用户登录后获得的认证令牌（JWT Token），用于身份验证
         * - 注意：此 token 与代币（Token）无关，是用户认证相关的凭证
         * - token 存储在 localStorage 中，键名为 'token'
         * - 使用 Bearer Token 方式，格式：Authorization: Bearer <token>
         * 
         * 工作流程：
         * 1. 用户登录成功后，后端返回 token
         * 2. 前端将 token 存储到 localStorage
         * 3. 每次请求时，自动从 localStorage 读取 token 并添加到请求头
         * 4. 后端验证 token 的有效性，决定是否允许访问
         */
        const token = localStorage.getItem('token')
        if (token) {
          // 将 token 添加到请求头的 Authorization 字段
          // 使用 Bearer Token 标准格式
          config.headers.Authorization = `Bearer ${token}`
        }

        // 显示loading（使用实例配置的默认值）
        const showLoading = config.showLoading !== undefined ? config.showLoading : this.defaultShowLoading
        if (showLoading) {
          this.showLoading()
        }

        return config
      },
      (error) => {
        this.hideLoading()
        return Promise.reject(error)
      }
    )

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        this.hideLoading()

        // 如果是 blob 响应（文件下载），直接返回原始响应
        if (response.config.responseType === 'blob' || response.data instanceof Blob) {
          return response
        }

        const { data } = response
        
        // 如果 data 不是对象，可能不是标准的 API 响应格式，直接返回
        if (typeof data !== 'object' || data === null || !('code' in data)) {
          return response
        }

        const { code, message: msg } = data

        // 业务成功
        if (code === 200 || code === 0 || code === 200000) {
          return data as any
        }

        /**
         * Token 过期处理（登录凭证失效）
         * 
         * 说明：
         * - 当后端返回特定的错误码时，表示用户的登录 token 已过期或无效
         * - 错误码说明：
         *   - 501102: 业务层定义的 token 过期错误码
         *   - 401: HTTP 标准未授权状态码
         * 
         * 处理流程：
         * 1. 清除本地存储的 token
         * 2. 跳转到登录页面
         * 3. 提示用户重新登录
         * 4. 拒绝当前请求，避免继续执行后续逻辑
         * 
         * 注意：
         * - 这里处理的是登录认证 token，与代币（Token）无关
         * - 清除 token 后，用户需要重新登录才能继续使用需要认证的功能
         */
        // todo 需要修改为后端返回的错误码
        if (code === 501102 || code === 401) {
          // 清除本地存储的登录 token
          localStorage.removeItem('token')
          // 跳转到登录页面
          window.location.href = '/login'
          // 提示用户登录已过期
          getMessage().error('登录已过期，请重新登录')
          // 拒绝请求，阻止后续处理
          return Promise.reject(new Error('登录已过期'))
        }

        // 业务失败
        const showError = response.config.showError !== undefined ? response.config.showError : this.defaultShowError
        if (showError) {
          getMessage().error(msg || '请求失败')
        }

        return Promise.reject(new Error(msg || '请求失败'))
      },
      (error: AxiosError) => {
        this.hideLoading()

        // 处理HTTP错误
        if (error.response) {
          const { status, data } = error.response

          switch (status) {
            /**
             * HTTP 401 未授权错误
             * 
             * 说明：
             * - 401 状态码表示请求需要用户认证，但提供的认证信息无效或已过期
             * - 通常发生在以下情况：
             *   1. 用户未登录（没有 token）
             *   2. token 已过期
             *   3. token 格式错误或无效
             * 
             * 处理方式：
             * - 清除本地存储的登录 token
             * - 跳转到登录页面，要求用户重新登录
             * - 显示友好的错误提示
             * 
             * 注意：
             * - 这里的 token 是登录认证凭证，不是代币（Token）
             */
            case 401:
              // 清除本地存储的登录 token
              localStorage.removeItem('token')
              // 跳转到登录页面
              window.location.href = '/login'
              // 提示用户登录已过期
              getMessage().error('登录已过期，请重新登录')
              break
            case 403:
              getMessage().error('没有权限访问')
              break
            case 404:
              getMessage().error('请求的资源不存在')
              break
            case 500:
              getMessage().error('服务器内部错误')
              break
            default:
              getMessage().error((data as any)?.message || '请求失败')
          }
        } else if (error.request) {
          getMessage().error('网络连接失败，请检查网络')
        } else {
          getMessage().error('请求配置错误')
        }

        return Promise.reject(error)
      }
    )
  }

  private showLoading() {
    this.loadingCount++
    if (this.loadingCount === 1) {
      // 这里可以集成全局loading组件
      // 暂时不显示，避免与现有实现冲突
    }
  }

  private hideLoading() {
    this.loadingCount--
    if (this.loadingCount <= 0) {
      this.loadingCount = 0
      // 这里可以隐藏全局loading组件
    }
  }

  // GET请求
  get<T = any>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.instance.get(url, config)
  }

  // POST请求
  post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.instance.post(url, data, config)
  }

  // PUT请求
  put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.instance.put(url, data, config)
  }

  // DELETE请求
  delete<T = any>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.instance.delete(url, config)
  }

  // PATCH请求
  patch<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.instance.patch(url, data, config)
  }

  // 上传文件
  upload<T = any>(url: string, file: File, config?: RequestConfig): Promise<ApiResponse<T>> {
    const formData = new FormData()
    formData.append('file', file)
    
    return this.instance.post(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers,
      },
    })
  }

  // 下载文件
  download(url: string, filename?: string, config?: RequestConfig): Promise<void> {
    return this.instance.get(url, {
      ...config,
      responseType: 'blob',
    }).then((response) => {
      const blob = new Blob([response.data])
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = filename || 'download'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
    })
  }
}

// 创建请求实例的工厂函数
export const createRequest = (config: AxiosInstanceConfig) => {
  return new Request(config)
}

// 导出Request类，供直接使用
export { Request }

// 默认实例
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'
export const defaultRequest = createRequest({
  baseURL: API_BASE_URL,
  showGlobalLoading: true,
})

// 为了向后兼容，保留原有的导出
export const apiService = defaultRequest
export default defaultRequest
