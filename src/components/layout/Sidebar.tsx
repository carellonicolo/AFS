import { FC, ReactNode } from 'react'
import { X } from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

const Sidebar: FC<SidebarProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className={`
        fixed right-4 top-24 bottom-4 w-80 glass-panel z-40
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-[110%]'}
        lg:translate-x-0
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-white/10">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors lg:hidden text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {children}
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar
