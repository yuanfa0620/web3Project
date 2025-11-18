/**
 * 全局横幅提示组件
 * 使用 react-fast-marquee 实现滚动效果
 * 支持关闭功能，使用 sessionStorage 持久化关闭状态
 */
import React, { useState, useEffect, useMemo, useRef } from 'react'
import Marquee from 'react-fast-marquee'
import { CloseOutlined } from '@ant-design/icons'
import { fetchBannerData, type BannerItem } from '@/services/banner'
import { isBannerClosed, setBannerClosed } from '@/utils/bannerStorage'
import styles from './index.module.less'

export const Banner: React.FC = () => {
  const [items, setItems] = useState<BannerItem[]>([])
  const [loading, setLoading] = useState(true)
  const [visible, setVisible] = useState(false)
  const bannerRef = useRef<HTMLDivElement>(null)

  // 加载横幅数据
  useEffect(() => {
    const loadBannerData = async () => {
      try {
        setLoading(true)
        // 检查是否已关闭
        if (isBannerClosed()) {
          setVisible(false)
          setLoading(false)
          return
        }

        // 获取横幅数据
        const data = await fetchBannerData()
        if (data && data.length > 0) {
          setItems(data)
          setVisible(true)
        } else {
          setVisible(false)
        }
      } catch (error) {
        console.error('Failed to load banner data:', error)
        setVisible(false)
      } finally {
        setLoading(false)
      }
    }

    loadBannerData()
  }, [])

  // 处理关闭
  const handleClose = () => {
    setBannerClosed()
    setVisible(false)
  }

  // 计算需要重复的次数，确保内容足够长以产生滚动效果
  const repeatCount = useMemo(() => {
    if (items.length === 0) return 0
    // 如果只有1条内容，重复10次
    if (items.length === 1) {
      return 10
    }
    // 如果只有2条内容，重复5次
    if (items.length === 2) {
      return 5
    }
    // 如果内容项较多，至少重复2次
    return 2
  }, [items.length])

  // 生成重复的内容项
  const repeatedItems = useMemo(() => {
    if (items.length === 0) return []
    const result: BannerItem[] = []
    for (let i = 0; i < repeatCount; i++) {
      items.forEach((item) => {
        result.push({
          ...item,
          id: `${item.id}-repeat-${i}`,
        })
      })
    }
    return result
  }, [items, repeatCount])

  // 动态设置 CSS 变量，用于调整 Header 位置
  useEffect(() => {
    if (!visible || loading || repeatedItems.length === 0 || !bannerRef.current) {
      document.documentElement.style.setProperty('--banner-height', '0px')
      return
    }

    const updateBannerHeight = () => {
      if (bannerRef.current) {
        // 使用实际渲染的高度
        const height = bannerRef.current.offsetHeight
        document.documentElement.style.setProperty('--banner-height', `${height}px`)
      }
    }

    // 初始设置（延迟一下确保 DOM 已渲染）
    const timer = setTimeout(updateBannerHeight, 0)

    // 监听窗口大小变化
    window.addEventListener('resize', updateBannerHeight)

    // 使用 ResizeObserver 监听元素大小变化（更准确）
    const resizeObserver = new ResizeObserver(() => {
      updateBannerHeight()
    })
    
    if (bannerRef.current) {
      resizeObserver.observe(bannerRef.current)
    }

    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', updateBannerHeight)
      resizeObserver.disconnect()
      document.documentElement.style.setProperty('--banner-height', '0px')
    }
  }, [visible, loading, repeatedItems.length])

  // 如果正在加载或不可见，不渲染
  if (loading || !visible || repeatedItems.length === 0) {
    return null
  }

  return (
    <div ref={bannerRef} className={styles.banner}>
      <div className={styles.bannerContent}>
        <Marquee
          gradient={false}
          speed={50}
          pauseOnHover={true}
          loop={0}
          className={styles.marquee}
        >
          {repeatedItems.map((item, index) => (
            <span key={item.id} className={styles.item}>
              {item.content}
              {index < repeatedItems.length - 1 && (
                <span className={styles.separator}>•</span>
              )}
            </span>
          ))}
        </Marquee>
      </div>
      <button
        className={styles.closeButton}
        onClick={handleClose}
        aria-label="关闭横幅"
        type="button"
      >
        <CloseOutlined />
      </button>
    </div>
  )
}

