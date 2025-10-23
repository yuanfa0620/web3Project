import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
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
  const [currentLanguage, setCurrentLanguage] = useState<string>(defaultLanguage)

  // 初始化语言
  useEffect(() => {
    const savedLanguage = localStorage.getItem('i18nextLng')
    if (savedLanguage && supportedLanguages.some(lang => lang.code === savedLanguage)) {
      setCurrentLanguage(savedLanguage)
      i18n.changeLanguage(savedLanguage)
    } else {
      setCurrentLanguage(defaultLanguage)
      i18n.changeLanguage(defaultLanguage)
    }
  }, [i18n])

  // 监听语言变化
  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      setCurrentLanguage(lng)
    }

    i18n.on('languageChanged', handleLanguageChange)
    
    return () => {
      i18n.off('languageChanged', handleLanguageChange)
    }
  }, [i18n])

  const changeLanguage = (language: string) => {
    if (supportedLanguages.some(lang => lang.code === language)) {
      i18n.changeLanguage(language)
      localStorage.setItem('i18nextLng', language)
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
