/**
 * react-activation 类型声明
 */
declare module 'react-activation' {
  import { ReactNode, ComponentType } from 'react'

  export interface KeepAliveProps {
    name?: string
    id?: string
    saveScrollPosition?: boolean | 'screen'
    children: ReactNode
  }

  export const KeepAlive: ComponentType<KeepAliveProps>
  
  export interface AliveScopeProps {
    children: ReactNode
  }

  export const AliveScope: ComponentType<AliveScopeProps>

  export function useActivate(callback: () => void): void
  export function useUnactivate(callback: () => void): void
  export function withActivation<T extends ComponentType<any>>(component: T): T
}

