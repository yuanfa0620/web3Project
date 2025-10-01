import React from 'react'
import { Card, Typography, Empty, Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import styles from './index.module.less'

const { Title, Paragraph } = Typography

const NFTsPage: React.FC = () => {
  return (
    <div className={styles.nftsPage}>
      <Title level={2} className={styles.pageTitle}>
        NFT 收藏
      </Title>
      
      <Card className={styles.nftsCard}>
        <Empty
          description="暂无 NFT 收藏"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Button type="primary" icon={<PlusOutlined />}>
            添加 NFT
          </Button>
        </Empty>
      </Card>
    </div>
  )
}

export default NFTsPage
