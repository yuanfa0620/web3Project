# Web3 项目

一个基于 React + Vite + TypeScript 的 Web3 应用，集成了钱包连接、代币管理、NFT 收藏等功能。

## 功能特性

- 🔗 多链钱包连接（RainbowKit + Wagmi）
- 💰 代币管理（ERC20）
- 🎨 NFT 收藏（ERC721）
- 🔄 代币兑换
- 📊 数据分析
- 🏛️ 治理投票
- ⚡ 质押挖矿
- 🎯 DeFi 协议集成

## 技术栈

- **前端框架**: React 19 + TypeScript
- **构建工具**: Vite
- **状态管理**: Redux Toolkit
- **路由**: React Router v7
- **UI 组件**: Ant Design
- **样式**: Less
- **Web3**: Wagmi + Viem + Ethers
- **钱包连接**: RainbowKit
- **HTTP 请求**: Axios

## 快速开始

### 1. 安装依赖

```bash
# 设置代理（如需要）
export https_proxy=http://127.0.0.1:7897 http_proxy=http://127.0.0.1:7897 all_proxy=socks5://127.0.0.1:7897

# 安装依赖
pnpm install
```

### 2. 配置环境变量

复制 `.env.example` 文件为 `.env.development` 和 `.env.production`，并填入真实值：

```bash
# 复制环境变量示例文件
cp .env.example .env.development
cp .env.example .env.production
```

编辑环境变量文件，替换以下配置：

```bash
# .env.development 和 .env.production
VITE_WC_PROJECT_ID=your_walletconnect_project_id
VITE_INFURA_KEY=your_infura_api_key
```

### 3. 启动开发服务器

```bash
# 开发环境
pnpm dev

# 生产环境预览
pnpm dev:prod
```

### 4. 构建项目

```bash
# 生产环境构建
pnpm build

# 开发环境构建
pnpm build:dev
```

## 项目结构

```text
src/
├── api/                    # API 请求封装
│   ├── data/              # API 数据类型
│   └── request.ts         # Axios 封装
├── components/            # 组件
│   ├── layout/           # 布局组件
│   └── common/           # 通用组件
├── config/               # 配置文件
│   └── constants.ts      # 项目常量
├── constants/            # 常量定义
│   └── chains.ts         # 链配置
├── contracts/            # 合约交互
│   ├── abi/             # ABI 文件
│   ├── data/            # 合约数据类型
│   ├── erc20.ts         # ERC20 服务
│   └── erc721.ts        # ERC721 服务
├── hooks/               # 自定义 Hooks
├── pages/               # 页面组件
│   ├── Home/           # 首页
│   ├── Wallet/         # 钱包
│   ├── Tokens/         # 代币
│   ├── NFTs/           # NFT
│   └── ...             # 其他页面
├── providers/           # 上下文提供者
├── store/              # Redux 状态管理
├── types/              # 类型定义
└── utils/              # 工具函数
```

## 配置说明

### 环境变量

- `VITE_APP_ENV`: 环境标识（development/production）
- `VITE_APP_TITLE`: 应用标题
- `VITE_API_BASE_URL`: API 基础地址
- `VITE_WC_PROJECT_ID`: WalletConnect 项目 ID
- `VITE_INFURA_KEY`: Infura API Key

### 链配置

支持的区块链网络：

- Ethereum (主网)
- Polygon
- BSC (BNB Smart Chain)
- Arbitrum
- Optimism
- Avalanche

## 开发指南

### 添加新的合约

1. 在 `src/contracts/abi/` 目录下添加 ABI 文件
2. 在 `src/contracts/` 目录下创建对应的服务类
3. 在 `src/contracts/index.ts` 中导出

### 添加新的页面

1. 在 `src/pages/` 目录下创建页面目录
2. 创建 `index.tsx` 和 `index.module.less`
3. 在 `src/router/index.tsx` 中添加路由

### 状态管理

使用 Redux Toolkit 进行状态管理：

- `src/store/reducers/userSlice.ts`: 用户状态
- `src/store/reducers/walletSlice.ts`: 钱包状态
- `src/store/reducers/appSlice.ts`: 应用状态

## 部署

### 构建优化

项目已配置以下优化：

- 代码分割（Code Splitting）
- 图片压缩
- 打包分析
- Tree Shaking

### 环境配置

- 开发环境：`pnpm dev`
- 生产环境：`pnpm build`

## 许可证

MIT License
