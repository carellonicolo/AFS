import { FC, useState } from 'react'
import { Github, HelpCircle } from 'lucide-react'
import Button from '../ui/Button'
import ThemeToggle from '../ui/ThemeToggle'
import HelpModal from '../modals/HelpModal'

const Header: FC = () => {
  const [isHelpOpen, setIsHelpOpen] = useState(false)

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
          <div className="flex items-center gap-2 mr-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="md"
              title="Aiuto"
              onClick={() => setIsHelpOpen(true)}
            >
              <HelpCircle className="w-4 h-4" />
            </Button>
          </div>

          <a
            href="https://github.com/carellonicolo/AFS"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-100/50 dark:bg-white/5 hover:bg-gray-200/50 dark:hover:bg-white/10 text-gray-700 dark:text-slate-200 transition-all duration-200 border border-gray-200/50 dark:border-white/5 hover:border-gray-300/50 dark:hover:border-white/20 group"
            title="View Source on GitHub"
          >
            <Github className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium hidden sm:block">GitHub</span>
          </a>


        </div>
      </div>
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </header>
  )
}

export default Header
