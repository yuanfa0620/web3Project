import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { UserInfo } from '@/api/data/types'

interface UserState {
  userInfo: UserInfo | null
  isLoggedIn: boolean
  loading: boolean
  error: string | null
}

const initialState: UserState = {
  userInfo: null,
  isLoggedIn: false,
  loading: false,
  error: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<UserInfo | null>) => {
      state.userInfo = action.payload
      state.isLoggedIn = !!action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    clearUser: (state) => {
      state.userInfo = null
      state.isLoggedIn = false
      state.loading = false
      state.error = null
    },
  },
})

export const { setUserInfo, setLoading, setError, clearUser } = userSlice.actions
export default userSlice.reducer
