export interface TokenConfig {
  name: string
  symbol: string
  address: string
  decimals: number
  icon: string
  isNative: boolean
  chainId?: number // 添加chainId字段
  isCustom?: boolean // 是否为用户自定义代币
}

export interface DexRouterConfig {
  name: string
  type: string
  address: string
  factory?: string
  quoter?: string
  note: string
}

export interface SwapState {
  fromToken: TokenConfig | null
  toToken: TokenConfig | null
  fromAmount: string
  toAmount: string
  fromBalance: string
  toBalance: string
  loading: boolean
  error: string | null
}

export interface SwapButtonState {
  disabled: boolean
  text: string
  type: 'default' | 'primary' | 'dashed' | 'link' | 'text'
  needApprove: boolean
  needConnect: boolean
  insufficientBalance: boolean
}

