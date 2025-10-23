import { configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux'
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { combineReducers } from '@reduxjs/toolkit'
import userReducer from '@/store/reducers/userSlice'
import walletReducer from '@/store/reducers/walletSlice'
import appReducer from '@/store/reducers/appSlice'

// 持久化配置
const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['app'], // 只持久化app状态（包含语言设置）
}

// 合并reducers
const rootReducer = combineReducers({
  user: userReducer,
  wallet: walletReducer,
  app: appReducer,
})

// 创建持久化reducer
const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

// 创建persistor
export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// 类型化的 hooks
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
