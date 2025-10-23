import React from 'react'
import { Card, Typography, Empty, Button } from 'antd'
import { SettingOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { PageTitle } from '@/components/PageTitle'
import styles from './index.module.less'

const { Title } = Typography

const SettingsPage: React.FC = () => {
  const { t } = useTranslation()
  
  return (
    <PageTitle title={t('pageTitle.settings')}>
      <div className={styles.settingsPage}>
        <Title level={2} className={styles.pageTitle}>
          {t('settings.title')}
        </Title>
        
        <Card className={styles.settingsCard}>
          <Empty
            description={t('settings.developing')}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button type="primary" icon={<SettingOutlined />}>
              {t('settings.openSettings')}
            </Button>
          </Empty>
        </Card>
      </div>
    </PageTitle>
  )
}

export default SettingsPage
