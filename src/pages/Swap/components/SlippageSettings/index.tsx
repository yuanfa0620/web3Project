import React, { useState } from 'react'
import { Button, Input, Modal, Switch, Tooltip } from 'antd'
import { SettingOutlined, WarningOutlined, ExperimentOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { SLIPPAGE_PRESETS } from '../../hooks/useSlippage'
import styles from './index.module.less'

interface SlippageSettingsProps {
  slippage: number
  expertMode: boolean
  customSlippage: string
  onPresetSlippageChange: (value: number) => void
  onCustomSlippageChange: (value: string) => void
  onExpertModeChange: (enabled: boolean) => void
  getSlippageWarning: () => { level: 'none' | 'low' | 'medium' | 'high'; message: string }
}

const SlippageSettings: React.FC<SlippageSettingsProps> = ({
  slippage,
  expertMode,
  customSlippage,
  onPresetSlippageChange,
  onCustomSlippageChange,
  onExpertModeChange,
  getSlippageWarning,
}) => {
  const { t } = useTranslation()

  const [visible, setVisible] = useState(false)
  const [confirmVisible, setConfirmVisible] = useState(false)
  const [tempExpertMode, setTempExpertMode] = useState(false)

  const warning = getSlippageWarning()

  // 处理预设滑点选择
  const handlePresetClick = (value: number) => {
    onPresetSlippageChange(value)
  }

  // 处理自定义滑点输入
  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    onCustomSlippageChange(value)
  }

  // 处理专家模式切换
  const handleExpertModeChange = (checked: boolean) => {
    if (checked) {
      // 开启专家模式需要确认
      setTempExpertMode(true)
      setConfirmVisible(true)
    } else {
      // 关闭专家模式直接执行
      onExpertModeChange(false)
    }
  }

  // 确认开启专家模式
  const handleConfirmExpertMode = () => {
    onExpertModeChange(true)
    setConfirmVisible(false)
    setTempExpertMode(false)
  }

  // 取消开启专家模式
  const handleCancelExpertMode = () => {
    setConfirmVisible(false)
    setTempExpertMode(false)
  }

  // 获取警告样式
  const getWarningClass = () => {
    if (expertMode) return ''
    switch (warning.level) {
      case 'high':
        return styles.warningHigh
      case 'medium':
        return styles.warningMedium
      case 'low':
        return styles.warningLow
      default:
        return ''
    }
  }

  return (
    <>
      <div className={styles.slippageSettings}>
        <Button
          type="text"
          icon={<SettingOutlined />}
          onClick={() => setVisible(true)}
          className={styles.settingsButton}
        >
          {t('swap.slippage')}
        </Button>
      </div>

      <Modal
        title={t('swap.slippageSettings.title')}
        open={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        width={480}
        className={styles.slippageModal}
      >
        <div className={styles.slippageContent}>
          {/* 预设滑点按钮 */}
          <div className={styles.presetSection}>
            <div className={styles.label}>{t('swap.slippageSettings.preset')}</div>
            <div className={styles.presetButtons}>
              {SLIPPAGE_PRESETS.map((preset) => (
                <Button
                  key={preset}
                  type={slippage === preset && !customSlippage ? 'primary' : 'default'}
                  onClick={() => handlePresetClick(preset)}
                  className={styles.presetButton}
                  disabled={expertMode}
                >
                  {preset}%
                </Button>
              ))}
            </div>
          </div>

          {/* 自定义滑点输入 */}
          <div className={styles.customSection}>
            <div className={styles.label}>{t('swap.slippageSettings.custom')}</div>
            <div className={styles.customInputWrapper}>
              <Input
                type="number"
                value={customSlippage}
                onChange={handleCustomChange}
                placeholder="0.0"
                suffix="%"
                className={styles.customInput}
                min={0}
                max={100}
                step={0.1}
                disabled={expertMode}
              />
            </div>
          </div>

          {/* 警告提示 */}
          {warning.level !== 'none' && (
            <div className={`${styles.warning} ${getWarningClass()}`}>
              <WarningOutlined />
              <span>{warning.message}</span>
            </div>
          )}

          {/* 专家模式 */}
          <div className={styles.expertSection}>
            <div className={styles.expertHeader}>
              <div>
                <div className={styles.expertTitle}>
                  {t('swap.slippageSettings.expertMode')}
                  {expertMode && (
                    <Tooltip title={t('swap.slippageSettings.expertModeTooltip')}>
                      <ExperimentOutlined className={styles.expertIconInline} />
                    </Tooltip>
                  )}
                </div>
                <div className={styles.expertDesc}>
                  {t('swap.slippageSettings.expertModeDesc')}
                </div>
              </div>
              <Switch
                checked={expertMode}
                onChange={handleExpertModeChange}
                className={styles.expertSwitch}
              />
            </div>
            {expertMode && (
              <div className={styles.expertWarning}>
                <WarningOutlined />
                <span>{t('swap.slippageSettings.expertModeWarning')}</span>
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* 确认开启专家模式弹窗 */}
      <Modal
        title={t('swap.slippageSettings.expertModeConfirm')}
        open={confirmVisible}
        onOk={handleConfirmExpertMode}
        onCancel={handleCancelExpertMode}
        okText={t('common.confirm')}
        cancelText={t('common.cancel')}
        okButtonProps={{ danger: true }}
        width={420}
      >
        <div className={styles.confirmContent}>
          <WarningOutlined className={styles.confirmIcon} />
          <p>{t('swap.slippageSettings.expertModeConfirmDesc')}</p>
        </div>
      </Modal>
    </>
  )
}

export default SlippageSettings

