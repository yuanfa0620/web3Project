/**
 * 个人资产布局组件，处理默认跳转到缓存页面
 */
import React, { useEffect } from 'react'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import { getAssetsTab } from '@/utils/assetsStorage'

const AssetsLayout: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // 如果当前路径就是 /profile/assets，才进行跳转
    if (location.pathname === '/profile/assets') {
      // 获取缓存的tab，默认跳转到对应页面
      const cachedTab = getAssetsTab()
      navigate(`/profile/assets/${cachedTab}`, { replace: true })
    }
  }, [navigate, location.pathname])

  return <Outlet />
}

export default AssetsLayout

