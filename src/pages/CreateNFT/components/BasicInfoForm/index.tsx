/**
 * 基本信息表单组件
 */
import React from 'react'
import { Form, Input, InputNumber, Select } from 'antd'
import { useTranslation } from 'react-i18next'
import type { NFTFormData } from '../../types'

const { TextArea } = Input
const { Option } = Select

interface BasicInfoFormProps {
  form: any
  chainOptions: Array<{ value: number; label: string }>
  defaultChainId: number
}

export const BasicInfoForm: React.FC<BasicInfoFormProps> = ({
  form,
  chainOptions,
  defaultChainId,
}) => {
  const { t } = useTranslation()

  return (
    <>
      <Form.Item
        name="chainId"
        label={t('createNFT.network')}
        rules={[{ required: true, message: t('createNFT.networkRequired') }]}
      >
        <Select placeholder={t('createNFT.selectNetwork')}>
          {chainOptions.map((option) => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="name"
        label={t('createNFT.name')}
        rules={[{ required: true, message: t('createNFT.nameRequired') }]}
      >
        <Input placeholder={t('createNFT.namePlaceholder')} />
      </Form.Item>

      <Form.Item
        name="symbol"
        label={t('createNFT.symbol')}
        rules={[{ required: true, message: t('createNFT.symbolRequired') }]}
      >
        <Input placeholder={t('createNFT.symbolPlaceholder')} maxLength={10} />
      </Form.Item>

      <Form.Item name="description" label={t('createNFT.description')}>
        <TextArea
          rows={4}
          placeholder={t('createNFT.descriptionPlaceholder')}
          maxLength={1000}
          showCount
        />
      </Form.Item>

      <Form.Item
        name="totalSupply"
        label={t('createNFT.totalSupply')}
        rules={[
          { required: true, message: t('createNFT.totalSupplyRequired') },
          { type: 'number', min: 1, message: t('createNFT.totalSupplyMin') },
        ]}
      >
        <InputNumber
          min={1}
          max={10000}
          style={{ width: '100%' }}
          placeholder={t('createNFT.totalSupplyPlaceholder')}
        />
      </Form.Item>

      <Form.Item
        name="royaltyFee"
        label={t('createNFT.royaltyFee')}
        rules={[
          { required: true, message: t('createNFT.royaltyFeeRequired') },
          { type: 'number', min: 0, max: 20, message: t('createNFT.royaltyFeeRange') },
        ]}
        extra={t('createNFT.royaltyFeeDesc')}
      >
        <InputNumber
          min={0}
          max={20}
          step={0.1}
          style={{ width: '100%' }}
          addonAfter="%"
          placeholder="5"
        />
      </Form.Item>
    </>
  )
}

