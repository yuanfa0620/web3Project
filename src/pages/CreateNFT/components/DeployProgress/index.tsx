/**
 * 部署进度组件
 */
import React from 'react'
import { Button, Space, Progress, Typography, Flex } from 'antd'
import { useTranslation } from 'react-i18next'

const { Text } = Typography

interface DeployProgressProps {
  deploying: boolean
  deployProgress: number
  onBack: () => void
  onDeploy: () => void
}

export const DeployProgress: React.FC<DeployProgressProps> = ({
  deploying,
  deployProgress,
  onBack,
  onDeploy,
}) => {
  const { t } = useTranslation()

  return (
    <Flex vertical style={{ width: '100%' }}>
      <Space>
        <Button onClick={onBack}>{t('common.back')}</Button>
        <Button type="primary" onClick={onDeploy} loading={deploying} size="large">
          {deploying ? t('createNFT.deploying') : t('createNFT.deployContract')}
        </Button>
      </Space>
      {deploying && (
        <div>
          <Progress percent={deployProgress} status="active" />
          <Text type="secondary" style={{ display: 'block', marginTop: 8, textAlign: 'center' }}>
            {t('createNFT.deployProgress')}
          </Text>
        </div>
      )}
    </Flex>
  )
}

