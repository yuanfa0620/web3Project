import { useEffect } from 'react'
import { usePageTitle } from '@/hooks/usePageTitle'

interface PageTitleProps {
  title?: string
  children?: React.ReactNode
}

/**
 * 页面标题组件
 * 用于在具体页面中设置自定义标题
 * @param title 页面标题
 * @param children 子组件
 */
export const PageTitle: React.FC<PageTitleProps> = ({ title, children }) => {
  const { setTitle } = usePageTitle()

  useEffect(() => {
    if (title) {
      setTitle(title)
    }
  }, [title, setTitle])

  return <>{children}</>
}

export default PageTitle
