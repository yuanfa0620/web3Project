import type { MessageInstance } from 'antd/es/message/interface'
import { message as staticMessage } from 'antd'

/**
 * 全局 message 实例
 * 在 App 组件初始化时设置，用于在非组件环境中使用 message
 */
let messageInstance: MessageInstance | null = null

/**
 * 设置全局 message 实例
 */
export const setMessageInstance = (instance: MessageInstance) => {
  messageInstance = instance
}

/**
 * 获取全局 message 实例
 * 如果实例未设置，返回一个默认实现（使用静态方法作为降级方案）
 */
export const getMessage = (): MessageInstance => {
  if (messageInstance) {
    return messageInstance
  }
  
  // 降级方案：如果实例未设置，使用静态方法
  // 这会在开发时显示警告，但不会破坏功能
  return staticMessage as MessageInstance
}

