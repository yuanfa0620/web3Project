import React from 'react'
import { Card, Table, Typography, Input } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { PageTitle } from '@/components/PageTitle'
import { useTokenColumns } from './hooks/useTokenColumns'
import { useTokenSearch } from './hooks/useTokenSearch'
import { useTokenData } from './hooks/useTokenData'
import styles from './index.module.less'

const { Title } = Typography
const { Search } = Input

const TokensPage: React.FC = () => {
  const { t } = useTranslation()

  // 获取代币数据
  const { tokenList } = useTokenData()

  // 搜索功能
  const { searchText, filteredTokens, handleSearchChange } = useTokenSearch(tokenList)

  // 表格列定义
  const { columns } = useTokenColumns()

  return (
    <PageTitle title={t('pageTitle.tokens')}>
      <div className={styles.tokensPage}>
        <div className={styles.pageHeader}>
          <Title level={2} className={styles.pageTitle}>
            {t('tokens.title')}
          </Title>
          <Search
            placeholder={t('tokens.searchTokens')}
            allowClear
            className={styles.searchInput}
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => handleSearchChange(e.target.value)}
            onSearch={handleSearchChange}
          />
        </div>

        <Card className={styles.tokensCard}>
          <Table
            columns={columns}
            dataSource={filteredTokens}
            pagination={false}
            className={styles.tokensTable}
            scroll={{ x: true }}
            rowKey="key"
          />
        </Card>
      </div>
    </PageTitle>
  )
}

export default TokensPage
