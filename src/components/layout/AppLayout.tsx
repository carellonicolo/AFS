import { FC, ReactNode } from 'react'
import Header from './Header'

interface AppLayoutProps {
  children: ReactNode
  onOpenSidebar?: () => void
}

const AppLayout: FC<AppLayoutProps> = ({ children, onOpenSidebar }) => {
  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-950">
      <Header onOpenSidebar={onOpenSidebar} />
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  )
}

export default AppLayout
