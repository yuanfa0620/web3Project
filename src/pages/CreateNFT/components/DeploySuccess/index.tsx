/**
 * 部署成功组件
 */
import React from 'react'
import { Button, Space, Typography } from 'antd'
import { CheckCircleOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import type { DeployedContract } from '../../types'
import styles from './index.module.less'

const { Title, Text } = Typography

interface DeploySuccessProps {
  deployedContract: DeployedContract
  onReset: () => void
  onViewContract?: (address: string) => void
}

export const DeploySuccess: React.FC<DeploySuccessProps> = ({
  deployedContract,
  onReset,
  onViewContract,
}) => {
  const { t } = useTranslation()

  return (
    <>
      <div className={styles.step3Content}>
        <CheckCircleOutlined className={styles.successIcon} />
        <Title level={4}>{t('createNFT.deploySuccess')}</Title>
        <div className={styles.contractInfo}>
          <div className={styles.infoItem}>
            <Text strong>{t('createNFT.contractAddress')}:</Text>
            <Text copyable>{deployedContract.address}</Text>
          </div>
          <div className={styles.infoItem}>
            <Text strong>{t('createNFT.transactionHash')}:</Text>
            <Text copyable>{deployedContract.txHash}</Text>
          </div>
        </div>
      </div>

      <Space>
        <Button onClick={onReset}>{t('createNFT.createAnother')}</Button>
        <Button
          type="primary"
          onClick={() => {
            if (onViewContract) {
              onViewContract(deployedContract.address)
            } else {
              console.log('View contract:', deployedContract.address)
            }
          }}
        >
          {t('createNFT.viewContract')}
        </Button>
      </Space>
    </>
  )
}

