# 多语言国际化功能

本项目已集成完整的多语言国际化功能，支持中文简体、中文繁体、英文三种语言，并且支持无刷新切换。

## 功能特性

- ✅ 支持中文简体、中文繁体、英文
- ✅ 无刷新切换语言
- ✅ PC端语言选择器在Header
- ✅ 移动端语言选择器在侧边栏
- ✅ 自动保存语言偏好
- ✅ 页面标题国际化
- ✅ 所有文本内容国际化
- ✅ TypeScript 完整支持

## 支持的语言

| 语言代码 | 语言名称 | 国旗 | 状态 |
|---------|---------|------|------|
| zh-CN | 简体中文 | 🇨🇳 | ✅ |
| zh-TW | 繁體中文 | 🇹🇼 | ✅ |
| en-US | English | 🇺🇸 | ✅ |

## 使用方法

### 1. 在组件中使用翻译

```typescript
import React from 'react'
import { useTranslation } from 'react-i18next'

const MyComponent: React.FC = () => {
  const { t } = useTranslation()
  
  return (
    <div>
      <h1>{t('home.title')}</h1>
      <p>{t('home.description')}</p>
      <button>{t('common.confirm')}</button>
    </div>
  )
}
```

### 2. 使用语言切换Context

```typescript
import React from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

const MyComponent: React.FC = () => {
  const { currentLanguage, changeLanguage, supportedLanguages } = useLanguage()
  
  return (
    <div>
      <p>当前语言: {currentLanguage}</p>
      <button onClick={() => changeLanguage('en-US')}>
        切换到英文
      </button>
    </div>
  )
}
```

### 3. 使用语言选择器组件

```typescript
import React from 'react'
import { LanguageSelector } from '@/components/LanguageSelector'

const MyComponent: React.FC = () => {
  return (
    <div>
      {/* 桌面端语言选择器 */}
      <LanguageSelector type="desktop" showLabel={true} />
      
      {/* 移动端语言选择器 */}
      <LanguageSelector type="mobile" />
    </div>
  )
}
```

## 语言文件结构

```text
src/i18n/
├── index.ts              # 国际化配置
└── locales/
    ├── zh-CN.json        # 简体中文
    ├── zh-TW.json        # 繁體中文
    └── en-US.json        # 英文
```

## 翻译键值结构

```json
{
  "common": {
    "loading": "加载中...",
    "error": "错误",
    "success": "成功"
  },
  "navigation": {
    "home": "首页",
    "wallet": "钱包"
  },
  "pageTitle": {
    "home": "Web3 Project",
    "wallet": "钱包"
  },
  "home": {
    "title": "欢迎使用 Web3",
    "description": "专业的区块链管理平台...",
    "walletManagement": {
      "title": "钱包管理",
      "description": "安全可靠的多链钱包管理..."
    }
  }
}
```

## 添加新的翻译

### 1. 在语言文件中添加新的键值

```json
// src/i18n/locales/zh-CN.json
{
  "newSection": {
    "title": "新功能",
    "description": "这是一个新功能的描述"
  }
}
```

### 2. 在组件中使用

```typescript
const MyComponent = () => {
  const { t } = useTranslation()
  
  return (
    <div>
      <h1>{t('newSection.title')}</h1>
      <p>{t('newSection.description')}</p>
    </div>
  )
}
```

## 页面标题国际化

页面标题会自动根据当前语言切换：

```typescript
// 自动设置页面标题
usePageTitle()

// 自定义页面标题
usePageTitle('自定义标题')
```

## 语言切换位置

- **PC端**: Header右侧，钱包连接按钮左侧
- **移动端**: 侧边栏顶部，菜单项上方

## 语言持久化

- 语言选择会自动保存到 `localStorage`
- 下次访问时会自动恢复上次选择的语言
- 如果没有保存的语言，会使用浏览器默认语言

## 注意事项

1. 所有用户可见的文本都应该使用 `t()` 函数进行翻译
2. 翻译键名使用驼峰命名法，如 `home.title`
3. 嵌套对象使用点号访问，如 `home.walletManagement.title`
4. 新增翻译时需要在所有语言文件中添加对应的键值
5. 页面标题会自动添加项目名称后缀（首页除外）

## 开发建议

1. 使用 TypeScript 确保翻译键的类型安全
2. 定期检查是否有遗漏的硬编码文本
3. 保持所有语言文件的结构一致
4. 使用有意义的键名，便于维护
