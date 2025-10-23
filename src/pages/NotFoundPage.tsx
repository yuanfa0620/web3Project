import React from 'react'
import { Result, Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PageTitle } from '@/components/PageTitle'

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <PageTitle title={t('pageTitle.notFound')}>
      <Result
        status="404"
        title="404"
        subTitle={t('notFound.description')}
        extra={
          <Button type="primary" onClick={() => navigate('/')}>
            {t('notFound.backHome')}
          </Button>
        }
      />
    </PageTitle>
  )
}

export default NotFoundPage
