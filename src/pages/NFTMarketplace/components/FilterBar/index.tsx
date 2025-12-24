import React from 'react'
import { Card, Row, Col, Select, Button, Input } from 'antd'
import type { TFunction } from 'i18next'
import styles from './index.module.less'

const { Option } = Select

interface FilterBarProps {
  t: TFunction
  filters: {
    searchText: string
    nftContract: string
    tokenId: string
    depositor: string
    status: number | undefined
    sortBy: string
  }
  collections: string[]
  onFilterChange: (key: string, value: any) => void
  onReset: () => void
}

export const FilterBar: React.FC<FilterBarProps> = ({
  t,
  filters,
  collections,
  onFilterChange,
  onReset,
}) => {
  return (
    <Card className={styles.filterCard}>
      <div className={styles.filterContainer}>
        <Row gutter={[16, 16]} align="middle" className={styles.filterRow}>
          <Col xs={24} sm={12} md={6}>
            <div className={styles.filterItem}>
              <span className={styles.filterLabel}>{t('nftMarketplace.contractAddress') || '合约地址'}:</span>
              <Input
                placeholder={t('nftMarketplace.contractAddressPlaceholder') || '输入合约地址'}
                value={filters.nftContract}
                onChange={(e) => onFilterChange('nftContract', e.target.value)}
                className={styles.filterInput}
                allowClear
              />
            </div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div className={styles.filterItem}>
              <span className={styles.filterLabel}>{t('nftMarketplace.tokenId') || 'Token ID'}:</span>
              <Input
                placeholder={t('nftMarketplace.tokenIdPlaceholder') || '输入 Token ID'}
                value={filters.tokenId}
                onChange={(e) => onFilterChange('tokenId', e.target.value)}
                className={styles.filterInput}
                allowClear
              />
            </div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div className={styles.filterItem}>
              <span className={styles.filterLabel}>{t('nftMarketplace.seller') || '卖家地址'}:</span>
              <Input
                placeholder={t('nftMarketplace.sellerPlaceholder') || '输入卖家地址'}
                value={filters.depositor}
                onChange={(e) => onFilterChange('depositor', e.target.value)}
                className={styles.filterInput}
                allowClear
              />
            </div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div className={styles.filterItem}>
              <span className={styles.filterLabel}>{t('nftMarketplace.status') || '状态'}:</span>
              <Select
                value={filters.status}
                onChange={(value) => onFilterChange('status', value)}
                className={styles.filterSelect}
                style={{ width: '100%' }}
                allowClear
                placeholder={t('nftMarketplace.allStatus') || '全部状态'}
              >
                <Option value={0}>{t('nftMarketplace.statusListed') || '已上架'}</Option>
                <Option value={1}>{t('nftMarketplace.statusCancelled') || '已取消'}</Option>
                <Option value={3}>{t('nftMarketplace.statusWithdrawn') || '已撤回'}</Option>
              </Select>
            </div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div className={styles.filterItem}>
              <span className={styles.filterLabel}>{t('nftMarketplace.sortBy')}:</span>
              <Select
                value={filters.sortBy}
                onChange={(value) => onFilterChange('sortBy', value)}
                className={styles.filterSelect}
                style={{ width: '100%' }}
              >
                <Option value="price-low">{t('nftMarketplace.priceLowToHigh')}</Option>
                <Option value="price-high">{t('nftMarketplace.priceHighToLow')}</Option>
                <Option value="createdAt-desc">{t('nftMarketplace.newest') || '最新'}</Option>
                <Option value="createdAt-asc">{t('nftMarketplace.oldest') || '最旧'}</Option>
              </Select>
            </div>
          </Col>
        </Row>
        <Button type="default" onClick={onReset} className={styles.resetButton}>
          {t('nftMarketplace.reset')}
        </Button>
      </div>
    </Card>
  )
}

