/**
 * 个人中心页面布局组件，用于处理父路由和子路由的渲染
 */
import React from 'react'
import { Outlet } from 'react-router-dom'

const ProfileLayout: React.FC = () => {
  return <Outlet />
}

export default ProfileLayout

