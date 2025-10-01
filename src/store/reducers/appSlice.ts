import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface AppState {
  theme: 'light' | 'dark'
  language: 'zh' | 'en'
  collapsed: boolean
  loading: boolean
  network: 'mainnet' | 'testnet'
}

const initialState: AppState = {
  theme: 'light',
  language: 'zh',
  collapsed: false,
  loading: false,
  network: 'mainnet',
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload
    },
    setLanguage: (state, action: PayloadAction<'zh' | 'en'>) => {
      state.language = action.payload
    },
    setCollapsed: (state, action: PayloadAction<boolean>) => {
      state.collapsed = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setNetwork: (state, action: PayloadAction<'mainnet' | 'testnet'>) => {
      state.network = action.payload
    },
  },
})

export const { 
  setTheme, 
  setLanguage, 
  setCollapsed, 
  setLoading, 
  setNetwork 
} = appSlice.actions
export default appSlice.reducer
