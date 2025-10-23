import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { Router } from '@/router'
import { WalletProvider } from '@/providers/WalletProvider'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { store, persistor } from '@/store'
import '@/i18n'
import 'antd/dist/reset.css'
import '@/styles/mobile.less'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <LanguageProvider>
          <WalletProvider>
            <Router />
          </WalletProvider>
        </LanguageProvider>
      </PersistGate>
    </Provider>
  </StrictMode>,
)
