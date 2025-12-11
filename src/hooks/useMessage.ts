import { App } from 'antd'

/**
 * 获取 Ant Design message API 的 Hook
 * 用于替代直接使用 message 静态方法，以支持动态主题
 */
export const useMessage = () => {
  const { message } = App.useApp()
  return message
}

