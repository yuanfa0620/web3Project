import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Router } from '@/router'
import { WalletProvider } from '@/providers/WalletProvider'
import 'antd/dist/reset.css'
import '@/styles/mobile.less'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WalletProvider>
      <Router />
    </WalletProvider>
  </StrictMode>,
)
