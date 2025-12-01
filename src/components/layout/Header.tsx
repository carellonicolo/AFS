import { FC } from 'react'
import { Menu } from 'lucide-react'

interface HeaderProps {
  onOpenSidebar?: () => void
}

const Header: FC<HeaderProps> = ({ onOpenSidebar }) => {
  return (
    <header className="fixed top-4 left-4 right-4 z-50">
      <div className="glass-panel px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-10 h-10 bg-primary-100 dark:bg-primary-500/20 rounded-xl overflow-hidden backdrop-blur-sm border border-primary-200 dark:border-primary-500/20">
            <img src="/logo.png" alt="DFA Simulator Logo" className="w-8 h-8 object-contain" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white tracking-tight">
              DFA Simulator
            </h1>
            <p className="text-xs text-gray-500 dark:text-slate-400 font-medium italic hidden sm:block">
              Powered by Prof. Carello
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile Menu Button */}
          <button
            onClick={onOpenSidebar}
            className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-gray-700 dark:text-slate-200 transition-colors lg:hidden"
            title="Apri Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
