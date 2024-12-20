import React from 'react'
import { Card, Skeleton } from 'antd'

const BlogCardSkeleton: React.FC = () => {
  return (
    <Card
      style={{ width: 380, margin: '0 10px 20px' }}
      cover={
        <Skeleton.Image
          style={{ width: '100%', height: 250 }}
          active={true}
        />
      }
    >
      <Skeleton loading={true} avatar active>
        <Card.Meta
          title={
            <Skeleton.Input style={{ width: 200 }} active={true} size="small" />
          }
          description={
            <Skeleton
              active={true}
              paragraph={{ rows: 2, width: ['100%', '80%'] }}
            />
          }
        />
      </Skeleton>
    </Card>
  )
}

export default BlogCardSkeleton

