import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Router } from '@/router'
import { WalletProvider } from '@/providers/WalletProvider'
import { LanguageProvider } from '@/contexts/LanguageContext'
import '@/i18n'
import 'antd/dist/reset.css'
import '@/styles/mobile.less'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <WalletProvider>
        <Router />
      </WalletProvider>
    </LanguageProvider>
  </StrictMode>,
)
