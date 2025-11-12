import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { TokenConfig } from '@/types/swap'

interface CustomTokensState {
  tokens: Record<number, TokenConfig[]> // chainId -> TokenConfig[]
}

const initialState: CustomTokensState = {
  tokens: {},
}

const customTokensSlice = createSlice({
  name: 'customTokens',
  initialState,
  reducers: {
    addCustomToken: (state, action: PayloadAction<{ chainId: number; token: TokenConfig }>) => {
      const { chainId, token } = action.payload
      const chainTokens = state.tokens[chainId] || []
      
      // 检查是否已存在
      const exists = chainTokens.some(
        (t) => t.address.toLowerCase() === token.address.toLowerCase()
      )
      
      if (!exists) {
        chainTokens.push({
          ...token,
          chainId, // 确保chainId正确
          isCustom: true,
        })
        state.tokens[chainId] = chainTokens
      }
    },
    removeCustomToken: (state, action: PayloadAction<{ chainId: number; tokenAddress: string }>) => {
      const { chainId, tokenAddress } = action.payload
      const chainTokens = state.tokens[chainId] || []
      
      state.tokens[chainId] = chainTokens.filter(
        (t) => t.address.toLowerCase() !== tokenAddress.toLowerCase()
      )
    },
    clearCustomTokens: (state, action: PayloadAction<number | undefined>) => {
      if (action.payload) {
        // 清除指定链的自定义代币
        delete state.tokens[action.payload]
      } else {
        // 清除所有自定义代币
        state.tokens = {}
      }
    },
  },
})

export const { addCustomToken, removeCustomToken, clearCustomTokens } = customTokensSlice.actions
export default customTokensSlice.reducer

