import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// 专门用于生产环境优化的配置
export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      'mock': resolve(__dirname, 'mock'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // 完全禁用sourcemap
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
        unused: true,
        dead_code: true,
        conditionals: true,
        booleans: true,
        loops: true,
        if_return: true,
        join_vars: true,
        collapse_vars: true,
        properties: true,
        sequences: true,
        evaluate: true,
        reduce_vars: true,
        passes: 2, // 多次压缩优化
      },
      mangle: {
        safari10: true,
        properties: {
          regex: /^_/,
        },
      },
      format: {
        comments: false,
        beautify: false,
        ascii_only: true, // 确保ASCII兼容性
      },
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // 更激进的代码分割策略
          if (id.includes('node_modules')) {
            // React核心 - 最小化
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-core'
            }
            // React Router - 路由
            if (id.includes('react-router')) {
              return 'router'
            }
            // Ant Design - UI库
            if (id.includes('antd') || id.includes('@ant-design')) {
              return 'antd'
            }
            // Web3库 - 最大的chunk
            if (id.includes('wagmi') || id.includes('viem') || id.includes('ethers') || id.includes('@rainbow-me')) {
              return 'web3'
            }
            // Redux - 状态管理
            if (id.includes('redux') || id.includes('@reduxjs')) {
              return 'redux'
            }
            // i18n - 国际化
            if (id.includes('i18next') || id.includes('react-i18next')) {
              return 'i18n'
            }
            // HTTP库
            if (id.includes('axios')) {
              return 'http'
            }
            // 其他第三方库
            return 'vendor'
          }
          
          // 应用代码分割
          if (id.includes('src/')) {
            // 页面组件 - 按页面分割
            if (id.includes('src/pages/')) {
              const pageName = id.split('src/pages/')[1].split('/')[0]
              return `page-${pageName}`
            }
            // 组件库
            if (id.includes('src/components/')) {
              return 'components'
            }
            // 工具函数
            if (id.includes('src/utils/') || id.includes('src/hooks/') || id.includes('src/api/')) {
              return 'utils'
            }
            // 状态管理
            if (id.includes('src/store/') || id.includes('src/contexts/')) {
              return 'state'
            }
          }
        },
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const extType = assetInfo.name?.split('.').pop()
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType || '')) {
            return 'images/[name]-[hash][extname]'
          }
          if (/woff2?|eot|ttf|otf/i.test(extType || '')) {
            return 'fonts/[name]-[hash][extname]'
          }
          return 'assets/[name]-[hash][extname]'
        },
      },
        treeshake: {
          moduleSideEffects: false,
          propertyReadSideEffects: false,
          unknownGlobalSideEffects: false,
        },
    },
    cssCodeSplit: true,
    target: ['es2015', 'chrome58', 'firefox57', 'safari11'],
    // 设置chunk大小警告限制
    chunkSizeWarningLimit: 500,
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
    postcss: {
      plugins: [
        // 简化CSS压缩配置，避免模块导入问题
      ],
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'antd',
      '@ant-design/icons',
      'redux-persist',
      'i18next',
      'react-i18next',
    ],
    exclude: [
      // 排除一些不需要预构建的包
    ],
  },
})
