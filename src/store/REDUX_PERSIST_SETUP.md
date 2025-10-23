# Redux Persist 持久化缓存配置

## 概述
已成功为Redux store配置了Redux Persist持久化缓存，确保应用状态在页面刷新后能够自动恢复。

## 配置详情

### 1. 安装依赖
```bash
pnpm add redux-persist
```

### 2. Store配置 (`src/store/index.ts`)

#### 持久化配置
```typescript
const persistConfig = {
  key: 'root',           // localStorage中的key
  version: 1,            // 版本号，用于数据迁移
  storage,               // 使用localStorage作为存储引擎
  whitelist: ['app'],    // 只持久化app状态（包含语言设置）
}
```

#### 关键特性
- **选择性持久化**：只持久化`app`状态，避免敏感数据（如钱包信息）被持久化
- **版本控制**：支持数据迁移和版本升级
- **localStorage存储**：使用浏览器localStorage进行持久化

#### 中间件配置
```typescript
middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  }),
```

### 3. 应用入口配置 (`src/main.tsx`)

#### PersistGate组件
```typescript
<Provider store={store}>
  <PersistGate loading={null} persistor={persistor}>
    <LanguageProvider>
      <WalletProvider>
        <Router />
      </WalletProvider>
    </LanguageProvider>
  </PersistGate>
</Provider>
```

- **PersistGate**：确保在状态恢复完成前不渲染应用
- **loading={null}**：恢复期间不显示加载状态
- **persistor**：Redux Persist的persistor实例

### 4. 语言上下文优化 (`src/contexts/LanguageContext.tsx`)

#### 简化初始化逻辑
```typescript
// 同步Redux状态到i18n - Redux Persist会自动恢复状态
useEffect(() => {
  if (i18n.language !== currentLanguage) {
    i18n.changeLanguage(currentLanguage)
  }
}, [currentLanguage, i18n])
```

- 移除了手动localStorage读取逻辑
- Redux Persist自动处理状态恢复
- 保持Redux状态与i18n的同步

## 持久化的数据

### 当前持久化状态
- **app.language**：用户选择的语言设置
- **app.theme**：主题设置（如果将来需要）
- **app.collapsed**：侧边栏折叠状态
- **app.network**：网络设置

### 不持久化的状态
- **user**：用户信息（敏感数据）
- **wallet**：钱包信息（敏感数据）

## 存储位置

### localStorage键值
- **Key**: `persist:root`
- **Value**: 序列化的Redux状态

### 数据结构
```json
{
  "app": {
    "language": "zh-CN",
    "theme": "light",
    "collapsed": false,
    "loading": false,
    "network": "mainnet"
  }
}
```

## 使用场景

### 1. 语言设置持久化
- 用户切换语言后，刷新页面语言设置保持不变
- 关闭浏览器重新打开，语言设置依然保持

### 2. 主题设置持久化
- 用户选择的主题在页面刷新后保持
- 支持深色/浅色主题切换

### 3. 界面状态持久化
- 侧边栏折叠状态在页面刷新后保持
- 提升用户体验

## 性能优化

### 1. 选择性持久化
- 只持久化必要的状态，避免存储大量数据
- 减少localStorage使用量

### 2. 版本控制
- 支持数据迁移，便于未来升级
- 避免数据结构变更导致的问题

### 3. 序列化优化
- 使用Redux Persist内置的序列化机制
- 自动处理复杂数据结构的序列化

## 调试和开发

### Redux DevTools
- 可以查看持久化的状态
- 支持时间旅行调试

### 清除持久化数据
```javascript
// 在浏览器控制台中执行
localStorage.removeItem('persist:root')
```

### 查看持久化数据
```javascript
// 在浏览器控制台中执行
console.log(JSON.parse(localStorage.getItem('persist:root')))
```

## 注意事项

### 1. 数据安全
- 敏感数据（用户信息、钱包信息）不会被持久化
- 只持久化用户界面相关的设置

### 2. 存储限制
- localStorage有存储大小限制（通常5-10MB）
- 当前配置只存储少量数据，不会超出限制

### 3. 浏览器兼容性
- 支持所有现代浏览器
- 在隐私模式下可能有限制

### 4. 数据迁移
- 当数据结构发生变化时，需要更新version
- 可以实现数据迁移逻辑

## 扩展功能

### 添加更多持久化状态
```typescript
const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['app', 'user'], // 添加更多状态
}
```

### 自定义存储引擎
```typescript
import { createTransform } from 'redux-persist'

// 可以自定义存储引擎（如IndexedDB、WebSQL等）
```

### 数据加密
```typescript
// 可以添加数据加密逻辑
const encryptTransform = createTransform(
  (inboundState) => encrypt(inboundState),
  (outboundState) => decrypt(outboundState)
)
```

## 总结

Redux Persist配置已完成，现在应用的状态（特别是语言设置）会在页面刷新后自动恢复，大大提升了用户体验。配置采用了最佳实践，确保数据安全和性能优化。
