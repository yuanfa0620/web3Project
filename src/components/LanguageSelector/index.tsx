import React, { useState } from 'react'
import { Button, Dropdown, Menu, Space, Typography } from 'antd'
import { GlobalOutlined, CheckOutlined } from '@ant-design/icons'
import { useLanguage } from '@/contexts/LanguageContext'
import { useTranslation } from 'react-i18next'
import styles from './index.module.less'

const { Text } = Typography

interface LanguageSelectorProps {
  type?: 'desktop' | 'mobile'
  showLabel?: boolean
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  type = 'desktop', 
  showLabel = false 
}) => {
  const { currentLanguage, changeLanguage, supportedLanguages } = useLanguage()
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)

  const currentLang = supportedLanguages.find(lang => lang.code === currentLanguage)

  const handleMenuClick = ({ key }: { key: string }) => {
    changeLanguage(key)
    setVisible(false)
  }

  const menuItems = supportedLanguages.map(lang => ({
    key: lang.code,
    label: (
      <div className={styles.menuItem}>
        <span className={styles.flag}>{lang.flag}</span>
        <span className={styles.name}>{lang.name}</span>
        {currentLanguage === lang.code && (
          <CheckOutlined className={styles.checkIcon} />
        )}
      </div>
    )
  }))

  const menu = {
    items: menuItems,
    onClick: handleMenuClick,
    className: styles.dropdownMenu,
  }

  if (type === 'mobile') {
    return (
      <div className={styles.mobileContainer}>
        <Dropdown
          menu={menu}
          trigger={['click']}
          open={visible}
          onOpenChange={setVisible}
          placement="bottomLeft"
          className={styles.mobileDropdown}
        >
          <Button
            type="text"
            className={styles.mobileSelectorButton}
            block
          >
            <Space size={8}>
              <GlobalOutlined className={styles.icon} />
              <span className={styles.flag}>{currentLang?.flag}</span>
              <span className={styles.name}>{currentLang?.name}</span>
            </Space>
          </Button>
        </Dropdown>
      </div>
    )
  }

  return (
    <Dropdown
      menu={menu}
      trigger={['click']}
      open={visible}
      onOpenChange={setVisible}
      placement="bottomRight"
      className={styles.dropdown}
    >
      <Button
        type="text"
        className={styles.selectorButton}
        icon={<GlobalOutlined />}
      >
        <Space size={4}>
          {currentLang && (
            <>
              <span className={styles.flag}>{currentLang.flag}</span>
              {showLabel && (
                <span className={styles.languageName}>
                  {currentLang.name}
                </span>
              )}
            </>
          )}
        </Space>
      </Button>
    </Dropdown>
  )
}

export default LanguageSelector
