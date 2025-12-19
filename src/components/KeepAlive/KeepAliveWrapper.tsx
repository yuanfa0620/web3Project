/**
 * KeepAlive 包装组件
 * 用于缓存组件状态，类似 Vue 的 keep-alive
 */
import React from 'react'
import { KeepAlive } from 'react-activation'

interface KeepAliveWrapperProps {
  name: string // 缓存标识，同一个 name 的组件会被缓存
  children: React.ReactNode
}

/**
 * KeepAlive 包装组件
 * @param name 缓存标识
 * @param children 需要缓存的子组件
 */
export const KeepAliveWrapper: React.FC<KeepAliveWrapperProps> = ({ name, children }) => {
  return <KeepAlive name={name}>{children}</KeepAlive>
}

