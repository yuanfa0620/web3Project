# 页面标题管理

本项目提供了完整的页面标题管理功能，支持根据路由自动设置标题，也支持在具体页面中自定义标题。

## 功能特性

- ✅ 根据路由自动设置页面标题
- ✅ 支持页面级自定义标题
- ✅ 自动添加项目名称后缀
- ✅ 支持动态更新标题
- ✅ TypeScript 完整支持

## 使用方法

### 1. 自动标题（推荐）

在 Layout 组件中已经集成了自动标题功能，会根据当前路由自动设置标题：

```typescript
// src/components/layout/Layout/index.tsx
import { usePageTitle } from '@/hooks/usePageTitle'

export const Layout: React.FC = () => {
  usePageTitle() // 自动根据路由设置标题
  
  return (
    // ... 其他内容
  )
}
```

### 2. 页面级自定义标题

在具体页面中使用 `PageTitle` 组件：

```typescript
import React from 'react'
import { PageTitle } from '@/components/PageTitle'

const MyPage: React.FC = () => {
  return (
    <PageTitle title="我的自定义标题">
      <div>
        {/* 页面内容 */}
      </div>
    </PageTitle>
  )
}
```

### 3. 使用 Hook 自定义标题

在组件中直接使用 `usePageTitle` Hook：

```typescript
import React, { useEffect } from 'react'
import { usePageTitle } from '@/hooks/usePageTitle'

const MyPage: React.FC = () => {
  const { setTitle } = usePageTitle()
  
  useEffect(() => {
    // 根据某些条件动态设置标题
    setTitle('动态标题')
  }, [])
  
  return <div>页面内容</div>
}
```

## 路由标题映射

当前支持的路由标题映射：

| 路由路径 | 页面标题 | 浏览器标题 |
|---------|---------|-----------|
| `/` | 首页 | Web3 管理平台 |
| `/wallet` | 钱包 | 钱包 - Web3 Project |
| `/tokens` | 代币 | 代币 - Web3 Project |
| `/nfts` | NFT | NFT - Web3 Project |
| `/defi` | DeFi | DeFi - Web3 Project |
| `/swap` | 交换 | 交换 - Web3 Project |
| `/staking` | 质押 | 质押 - Web3 Project |
| `/governance` | 治理 | 治理 - Web3 Project |
| `/analytics` | 分析 | 分析 - Web3 Project |
| `/settings` | 设置 | 设置 - Web3 Project |

## 添加新路由标题

在 `src/hooks/usePageTitle.ts` 中添加新的路由映射：

```typescript
const routeTitleMap: Record<string, string> = {
  '/': '首页',
  '/wallet': '钱包',
  '/tokens': '代币',
  '/new-page': '新页面', // 添加新页面
  // ... 其他路由
}
```

## API 参考

### usePageTitle Hook

```typescript
const { setTitle, getCurrentTitle } = usePageTitle(customTitle?: string)
```

**参数：**
- `customTitle` (可选): 自定义标题，会覆盖路由标题

**返回值：**
- `setTitle(title: string)`: 设置页面标题
- `getCurrentTitle()`: 获取当前页面标题

### PageTitle 组件

```typescript
<PageTitle title="自定义标题">
  {/* 子组件 */}
</PageTitle>
```

**Props：**
- `title` (可选): 页面标题
- `children`: 子组件

## 注意事项

1. 首页 (`/`) 不会添加项目名称后缀
2. 自定义标题会完全覆盖路由标题
3. 标题更新是响应式的，路由变化时会自动更新
4. 支持中文标题，确保页面编码正确
