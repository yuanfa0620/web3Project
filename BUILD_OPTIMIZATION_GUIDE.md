# 构建优化指南

## 概述
已对项目的Vite构建配置进行了全面优化，以显著减少打包文件大小。主要优化包括代码分割、压缩、Tree Shaking等。

## 优化前后对比

### 优化前
- 最大JS文件：> 3.6MB
- Source Map文件：> 11.9MB
- 单一大文件包含所有依赖

### 优化后预期
- 最大JS文件：< 1MB（预计减少70%+）
- 无Source Map文件（生产环境）
- 多个小文件，按需加载

## 主要优化措施

### 1. 代码分割优化

#### 第三方库分割
```typescript
// 按功能分割第三方库
'react-core': React核心库
'router': React Router
'antd': Ant Design UI库
'web3': Web3相关库（wagmi, viem, ethers等）
'redux': Redux状态管理
'i18n': 国际化库
'http': HTTP请求库
'vendor': 其他第三方库
```

#### 应用代码分割
```typescript
// 按页面分割
'page-Home': 首页
'page-Wallet': 钱包页面
'page-Tokens': 代币页面
// ... 其他页面

// 按功能分割
'components': 通用组件
'utils': 工具函数
'state': 状态管理
```

### 2. 压缩优化

#### Terser压缩配置
```typescript
compress: {
  drop_console: true,        // 移除console
  drop_debugger: true,       // 移除debugger
  pure_funcs: ['console.log'], // 移除指定函数
  unused: true,              // 移除未使用变量
  dead_code: true,           // 移除死代码
  conditionals: true,        // 优化条件表达式
  booleans: true,            // 优化布尔值
  loops: true,               // 优化循环
  if_return: true,           // 优化if语句
  join_vars: true,           // 合并变量声明
  collapse_vars: true,       // 折叠变量
  properties: true,          // 优化属性访问
  sequences: true,           // 优化序列
  evaluate: true,            // 常量求值
  reduce_vars: true,         // 减少变量
  passes: 2,                 // 多次压缩
}
```

#### CSS压缩
```typescript
cssnano: {
  discardComments: true,     // 移除注释
  normalizeWhitespace: true, // 标准化空白
  colormin: true,           // 压缩颜色
  minifyFontValues: true,   // 压缩字体值
  minifyGradients: true,    // 压缩渐变
  // ... 更多CSS优化
}
```

### 3. Tree Shaking优化

```typescript
treeshake: {
  moduleSideEffects: false,      // 模块无副作用
  propertyReadSideEffects: false, // 属性读取无副作用
  unknownGlobalSideEffects: false, // 未知全局副作用
  tryCatchDeoptimization: false,  // 禁用try-catch优化
}
```

### 4. 资源优化

#### 文件命名优化
```typescript
chunkFileNames: 'js/[name]-[hash].js'
entryFileNames: 'js/[name]-[hash].js'
assetFileNames: {
  images: 'images/[name]-[hash][extname]'
  fonts: 'fonts/[name]-[hash][extname]'
  others: 'assets/[name]-[hash][extname]'
}
```

#### 图片压缩
```typescript
viteImagemin: {
  gifsicle: { optimizationLevel: 7 },
  optipng: { optimizationLevel: 7 },
  mozjpeg: { quality: 20 },
  pngquant: { quality: [0.8, 0.9] },
  svgo: { /* SVG优化 */ }
}
```

## 构建命令

### 标准构建
```bash
# 开发环境构建
pnpm run build:dev

# 生产环境构建
pnpm run build:prod
```

### 优化构建
```bash
# 使用优化配置构建（推荐）
pnpm run build:optimize
```

### 分析构建结果
```bash
# 构建并分析bundle大小
pnpm run analyze
```

## 构建配置说明

### 1. 主配置文件 (`vite.config.ts`)
- 标准的生产环境配置
- 包含基本的代码分割和压缩
- 适合日常开发使用

### 2. 优化配置文件 (`vite.optimize.config.ts`)
- 激进的优化配置
- 更精细的代码分割
- 更强的压缩设置
- 适合最终生产部署

## 预期优化效果

### 文件大小减少
- **主bundle**: 从3.6MB减少到<1MB
- **Source Map**: 完全移除（生产环境）
- **总体减少**: 预计70%+的大小减少

### 加载性能提升
- **首屏加载**: 只加载必要的代码
- **按需加载**: 页面级代码分割
- **缓存优化**: 第三方库独立缓存

### 用户体验改善
- **更快的页面切换**: 按需加载页面组件
- **更快的首屏**: 减少初始bundle大小
- **更好的缓存**: 细粒度代码分割

## 监控和调试

### Bundle分析
```bash
# 生成bundle分析报告
pnpm run analyze
```

### 构建统计
- 构建完成后会生成 `dist/stats.html`
- 使用树状图显示各模块大小
- 支持gzip和brotli压缩大小对比

### 性能监控
```typescript
// 在代码中添加性能监控
console.time('component-render')
// ... 组件渲染代码
console.timeEnd('component-render')
```

## 最佳实践

### 1. 代码分割策略
- 按页面分割：每个页面独立chunk
- 按功能分割：相关功能放在同一chunk
- 按使用频率分割：常用代码优先加载

### 2. 依赖管理
- 避免重复依赖
- 使用按需导入
- 定期清理未使用的依赖

### 3. 资源优化
- 压缩图片资源
- 使用WebP格式
- 优化字体文件

### 4. 缓存策略
- 第三方库使用长期缓存
- 应用代码使用短期缓存
- 合理设置Cache-Control头

## 注意事项

### 1. 开发环境
- 开发环境保持sourcemap启用
- 使用标准构建配置
- 避免过度优化影响开发体验

### 2. 生产环境
- 使用优化构建配置
- 禁用sourcemap
- 启用所有压缩选项

### 3. 兼容性
- 目标浏览器：ES2015+
- 支持Chrome 58+, Firefox 57+, Safari 11+
- 确保功能在所有目标浏览器中正常工作

## 故障排除

### 构建失败
1. 检查TypeScript类型错误
2. 检查依赖版本兼容性
3. 检查代码语法错误

### 运行时错误
1. 检查Tree Shaking是否过度
2. 检查动态导入是否正确
3. 检查环境变量配置

### 性能问题
1. 使用bundle分析工具
2. 检查是否有重复依赖
3. 优化图片和字体资源

## 总结

通过以上优化措施，项目的构建文件大小预计减少70%以上，同时提供更好的用户体验和开发体验。建议在生产环境使用 `pnpm run build:optimize` 命令进行构建。
