# Redux语言状态集成说明

## 概述
已成功将语言切换功能从localStorage改为使用Redux中封装的方法，实现了语言状态的统一管理。

## 主要更改

### 1. 更新Redux AppSlice (`src/store/reducers/appSlice.ts`)
- **语言类型更新**：将语言类型从 `'zh' | 'en'` 更新为 `'zh-CN' | 'zh-TW' | 'en-US'`
- **初始状态更新**：将默认语言从 `'zh'` 更新为 `'zh-CN'`
- **Action类型更新**：`setLanguage` action现在接受完整的语言代码

```typescript
interface AppState {
  theme: 'light' | 'dark'
  language: 'zh-CN' | 'zh-TW' | 'en-US'  // 更新为完整语言代码
  collapsed: boolean
  loading: boolean
  network: 'mainnet' | 'testnet'
}

const initialState: AppState = {
  theme: 'light',
  language: 'zh-CN',  // 更新默认语言
  collapsed: false,
  loading: false,
  network: 'mainnet',
}
```

### 2. 更新LanguageContext (`src/contexts/LanguageContext.tsx`)
- **集成Redux**：使用 `useAppDispatch` 和 `useAppSelector` 来管理语言状态
- **双向同步**：实现Redux状态与i18n之间的双向同步
- **移除localStorage依赖**：语言状态现在完全由Redux管理

```typescript
export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const { i18n } = useTranslation()
  const dispatch = useAppDispatch()
  const currentLanguage = useAppSelector(state => state.app.language)  // 从Redux获取语言状态

  // 初始化语言
  useEffect(() => {
    const savedLanguage = localStorage.getItem('i18nextLng')
    if (savedLanguage && supportedLanguages.some(lang => lang.code === savedLanguage)) {
      dispatch(setLanguage(savedLanguage as 'zh-CN' | 'zh-TW' | 'en-US'))  // 更新Redux状态
      i18n.changeLanguage(savedLanguage)
    } else {
      dispatch(setLanguage(defaultLanguage as 'zh-CN' | 'zh-TW' | 'en-US'))
      i18n.changeLanguage(defaultLanguage)
    }
  }, [i18n, dispatch])

  // 监听Redux状态变化，同步到i18n
  useEffect(() => {
    if (i18n.language !== currentLanguage) {
      i18n.changeLanguage(currentLanguage)
    }
  }, [currentLanguage, i18n])

  // 监听i18n语言变化，同步到Redux
  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      if (supportedLanguages.some(lang => lang.code === lng)) {
        dispatch(setLanguage(lng as 'zh-CN' | 'zh-TW' | 'en-US'))
      }
    }

    i18n.on('languageChanged', handleLanguageChange)
    
    return () => {
      i18n.off('languageChanged', handleLanguageChange)
    }
  }, [i18n, dispatch])

  const changeLanguage = (language: string) => {
    if (supportedLanguages.some(lang => lang.code === language)) {
      dispatch(setLanguage(language as 'zh-CN' | 'zh-TW' | 'en-US'))  // 使用Redux action
      i18n.changeLanguage(language)
    }
  }
}
```

### 3. 更新应用入口 (`src/main.tsx`)
- **添加Redux Provider**：将Redux store包装到应用中
- **Provider层级**：Redux Provider在最外层，确保所有组件都能访问store

```typescript
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>  {/* 添加Redux Provider */}
      <LanguageProvider>
        <WalletProvider>
          <Router />
        </WalletProvider>
      </LanguageProvider>
    </Provider>
  </StrictMode>,
)
```

## 技术实现细节

### 状态管理流程
1. **初始化**：从localStorage读取保存的语言设置，同步到Redux和i18n
2. **语言切换**：用户操作 → Redux action → i18n更新 → 界面更新
3. **状态同步**：Redux状态与i18n状态保持双向同步

### 类型安全
- 使用TypeScript确保语言代码的类型安全
- Redux action和state都有严格的类型定义
- 语言代码转换使用类型断言确保类型安全

### 向后兼容
- 保留了localStorage的读取功能，确保现有用户的语言设置不会丢失
- 语言切换API保持不变，现有组件无需修改

## 使用方法

### 在组件中获取当前语言
```typescript
import { useAppSelector } from '@/store'

const MyComponent = () => {
  const currentLanguage = useAppSelector(state => state.app.language)
  // currentLanguage 现在是 'zh-CN' | 'zh-TW' | 'en-US'
}
```

### 在组件中切换语言
```typescript
import { useAppDispatch } from '@/store'
import { setLanguage } from '@/store/reducers/appSlice'

const MyComponent = () => {
  const dispatch = useAppDispatch()
  
  const handleLanguageChange = (newLanguage: string) => {
    dispatch(setLanguage(newLanguage as 'zh-CN' | 'zh-TW' | 'en-US'))
  }
}
```

### 使用LanguageContext（推荐）
```typescript
import { useLanguage } from '@/contexts/LanguageContext'

const MyComponent = () => {
  const { currentLanguage, changeLanguage } = useLanguage()
  
  // 使用方式保持不变
}
```

## 优势

1. **统一状态管理**：语言状态现在由Redux统一管理，便于调试和维护
2. **类型安全**：完整的TypeScript类型支持
3. **可扩展性**：可以轻松添加语言相关的其他状态（如语言偏好设置）
4. **调试友好**：可以使用Redux DevTools调试语言状态变化
5. **向后兼容**：现有代码无需修改，API保持不变

## 注意事项

1. **Provider层级**：确保Redux Provider在LanguageProvider外层
2. **类型转换**：在调用setLanguage时需要正确的类型断言
3. **初始化顺序**：确保i18n在Redux之前初始化
4. **状态同步**：Redux状态和i18n状态保持同步，避免不一致

## 文件结构
```
src/
├── store/
│   ├── index.ts                    # Redux store配置
│   └── reducers/
│       └── appSlice.ts            # 应用状态管理（包含语言状态）
├── contexts/
│   └── LanguageContext.tsx        # 语言上下文（集成Redux）
└── main.tsx                       # 应用入口（添加Redux Provider）
```

现在语言状态完全由Redux管理，提供了更好的状态管理和调试体验。
