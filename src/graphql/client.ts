// GraphQL 客户端配置
import { GraphQLClient } from 'graphql-request'
import { CONFIG } from '@/config/constants'

// 创建 GraphQL 客户端实例
export const graphqlClient = new GraphQLClient(CONFIG.GRAPHQL.ENDPOINT, {
  headers: {
    'Content-Type': 'application/json',
  },
})

// 导出请求方法
export const request = <T = any>(query: string, variables?: any): Promise<T> => {
  return graphqlClient.request<T>(query, variables)
}
