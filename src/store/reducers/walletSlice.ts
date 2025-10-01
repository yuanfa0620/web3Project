import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface WalletState {
  address: string | null
  chainId: number | null
  isConnected: boolean
  balance: string | null
  loading: boolean
  error: string | null
}

const initialState: WalletState = {
  address: null,
  chainId: null,
  isConnected: false,
  balance: null,
  loading: false,
  error: null,
}

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setWalletInfo: (state, action: PayloadAction<{
      address: string | null
      chainId: number | null
      isConnected: boolean
    }>) => {
      state.address = action.payload.address
      state.chainId = action.payload.chainId
      state.isConnected = action.payload.isConnected
    },
    setBalance: (state, action: PayloadAction<string | null>) => {
      state.balance = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    clearWallet: (state) => {
      state.address = null
      state.chainId = null
      state.isConnected = false
      state.balance = null
      state.loading = false
      state.error = null
    },
  },
})

export const { 
  setWalletInfo, 
  setBalance, 
  setLoading, 
  setError, 
  clearWallet 
} = walletSlice.actions
export default walletSlice.reducer
