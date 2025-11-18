import React from 'react'
import { Card, Row, Col, Select, Button } from 'antd'
import type { TFunction } from 'i18next'
import styles from '../../index.module.less'

const { Option } = Select

interface FilterBarProps {
  t: TFunction
  collections: string[]
  selectedCollection: string
  onCollectionChange: (value: string) => void
  sortBy: string
  onSortChange: (value: string) => void
  onReset: () => void
}

export const FilterBar: React.FC<FilterBarProps> = ({
  t,
  collections,
  selectedCollection,
  onCollectionChange,
  sortBy,
  onSortChange,
  onReset,
}) => {
  return (
    <Card className={styles.filterCard}>
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} sm={12} md={6}>
          <div className={styles.filterItem}>
            <span className={styles.filterLabel}>{t('nftMarketplace.collection')}:</span>
            <Select
              value={selectedCollection}
              onChange={onCollectionChange}
              className={styles.filterSelect}
              style={{ width: '100%' }}
            >
              <Option value="all">{t('nftMarketplace.allCollections')}</Option>
              {collections.map((collection) => (
                <Option key={collection} value={collection}>
                  {collection}
                </Option>
              ))}
            </Select>
          </div>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <div className={styles.filterItem}>
            <span className={styles.filterLabel}>{t('nftMarketplace.sortBy')}:</span>
            <Select
              value={sortBy}
              onChange={onSortChange}
              className={styles.filterSelect}
              style={{ width: '100%' }}
            >
              <Option value="price-low">{t('nftMarketplace.priceLowToHigh')}</Option>
              <Option value="price-high">{t('nftMarketplace.priceHighToLow')}</Option>
              <Option value="volume-high">{t('nftMarketplace.volumeHighToLow')}</Option>
              <Option value="name">{t('nftMarketplace.name')}</Option>
            </Select>
          </div>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Button type="default" onClick={onReset}>
            {t('nftMarketplace.reset')}
          </Button>
        </Col>
      </Row>
    </Card>
  )
}

