import { defineConfig, type UserConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import viteImagemin from 'vite-plugin-imagemin'

// https://vite.dev/config/
export default defineConfig(({ mode }): UserConfig => {
  const isProduction = mode === 'production'
  
  const plugins = [
    react({
      // 启用React的自动JSX运行时优化
      jsxRuntime: 'automatic',
    }),
  ]

  // 只在生产环境添加优化插件
  if (isProduction) {
    plugins.push(
      visualizer({
        filename: 'dist/stats.html',
        open: false, // 不自动打开，避免影响构建
        gzipSize: true,
        brotliSize: true,
        template: 'treemap', // 使用树状图显示
      }),
      viteImagemin({
        gifsicle: {
          optimizationLevel: 7,
          interlaced: false,
        },
        optipng: {
          optimizationLevel: 7,
        },
        mozjpeg: {
          quality: 20,
        },
        pngquant: {
          quality: [0.8, 0.9],
          speed: 4,
        },
        svgo: {
          plugins: [
            {
              name: 'removeViewBox',
            },
            {
              name: 'removeEmptyAttrs',
              active: false,
            },
          ],
        },
      })
    )
  }

  return {
    plugins,
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        'mock': resolve(__dirname, 'mock'),
      },
    },
    server: {
      port: 3000,
      open: true,
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: 'http://localhost:8080',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    build: {
      outDir: 'dist',
      // 生产环境禁用sourcemap以减小文件大小
      sourcemap: false,
      // 设置chunk大小警告限制
      chunkSizeWarningLimit: 1000,
      // 启用压缩
      minify: 'terser',
      terserOptions: {
        compress: {
          // 移除console
          drop_console: true,
          drop_debugger: true,
          // 移除未使用的代码
          unused: true,
          // 移除死代码
          dead_code: true,
          // 移除未使用的变量
          pure_funcs: ['console.log', 'console.info'],
          // 优化条件表达式
          conditionals: true,
          // 优化布尔值
          booleans: true,
          // 优化循环
          loops: true,
          // 优化if语句
          if_return: true,
          // 合并变量声明
          join_vars: true,
          // 移除重复的键
          collapse_vars: true,
          // 优化属性访问
          properties: true,
        },
        mangle: {
          // 混淆变量名
          safari10: true,
          // 混淆属性名
          properties: {
            regex: /^_/,
          },
        },
        format: {
          // 移除注释
          comments: false,
          // 压缩空格
          beautify: false,
        },
      },
      rollupOptions: {
        output: {
          // 更精细的代码分割
          manualChunks: (id) => {
            // 将 node_modules 中的包分组
            if (id.includes('node_modules')) {
              // React核心库 - 分离出来便于缓存
              if (id.includes('react') || id.includes('react-dom')) {
                return 'react-vendor'
              }
              // React Router - 路由相关
              if (id.includes('react-router')) {
                return 'router'
              }
              // Ant Design UI库 - UI组件
              if (id.includes('antd') || id.includes('@ant-design')) {
                return 'antd'
              }
              // Web3相关库 - 这些通常很大，单独分离
              if (id.includes('wagmi') || id.includes('viem') || id.includes('ethers') || id.includes('@rainbow-me')) {
                return 'web3'
              }
              // Redux相关 - 状态管理
              if (id.includes('redux') || id.includes('@reduxjs')) {
                return 'redux'
              }
              // i18n国际化 - 语言相关
              if (id.includes('i18next') || id.includes('react-i18next')) {
                return 'i18n'
              }
              // HTTP请求库
              if (id.includes('axios')) {
                return 'http'
              }
              // 大型工具库单独分离
              if (id.includes('lodash') || id.includes('moment') || id.includes('dayjs')) {
                return 'utils-lib'
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
              // 组件库 - 通用组件
              if (id.includes('src/components/')) {
                return 'components'
              }
              // 工具函数 - 工具类
              if (id.includes('src/utils/') || id.includes('src/hooks/') || id.includes('src/api/')) {
                return 'utils'
              }
            }
          },
          // 设置chunk文件名格式
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
        // 外部化一些大型依赖（如果使用CDN）
        external: isProduction ? [] : [],
        // 启用rollup的tree shaking
        treeshake: {
          moduleSideEffects: false,
          propertyReadSideEffects: false,
          unknownGlobalSideEffects: false,
        },
      },
      // 启用CSS代码分割
      cssCodeSplit: true,
      // 设置目标浏览器
      target: ['es2015', 'chrome58', 'firefox57', 'safari11'],
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
        },
      },
      // CSS压缩 - 简化配置避免模块导入问题
      postcss: isProduction ? {
        plugins: [
          // 使用Vite内置的CSS压缩
        ],
      } : undefined,
    },
    // 优化依赖预构建
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
  }
})
