import React, { createContext, useContext, useEffect, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '@/store'
import { setLanguage } from '@/store/reducers/appSlice'
import { supportedLanguages, defaultLanguage } from '@/i18n'

interface LanguageContextType {
  currentLanguage: string
  changeLanguage: (language: string) => void
  supportedLanguages: typeof supportedLanguages
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

interface LanguageProviderProps {
  children: ReactNode
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const { i18n } = useTranslation()
  const dispatch = useAppDispatch()
  const currentLanguage = useAppSelector(state => state.app.language)

  // 同步Redux状态到i18n - Redux Persist会自动恢复状态
  useEffect(() => {
    if (i18n.language !== currentLanguage) {
      i18n.changeLanguage(currentLanguage)
    }
  }, [currentLanguage, i18n])

  // 监听i18n语言变化，同步到Redux
  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      if (supportedLanguages.some(lang => lang.code === lng)) {
        dispatch(setLanguage(lng as 'zh-CN' | 'zh-TW' | 'en-US'))
      }
    }

    i18n.on('languageChanged', handleLanguageChange)
    
    return () => {
      i18n.off('languageChanged', handleLanguageChange)
    }
  }, [i18n, dispatch])

  const changeLanguage = (language: string) => {
    if (supportedLanguages.some(lang => lang.code === language)) {
      dispatch(setLanguage(language as 'zh-CN' | 'zh-TW' | 'en-US'))
      i18n.changeLanguage(language)
    }
  }

  const value: LanguageContextType = {
    currentLanguage,
    changeLanguage,
    supportedLanguages
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
