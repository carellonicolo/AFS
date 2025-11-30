import { FC } from 'react'

const Header: FC = () => {
  return (
    <header className="fixed top-4 left-4 right-4 z-50">
      <div className="glass-panel px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-10 h-10 bg-primary-500/20 rounded-xl overflow-hidden backdrop-blur-sm border border-primary-500/20">
            <img src="/logo.png" alt="DFA Simulator Logo" className="w-8 h-8 object-contain" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">
              DFA Simulator
            </h1>
            <p className="text-xs text-slate-400 font-medium italic">
              Powered by Prof. Carello
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Toolbar buttons will go here */}
        </div>
      </div>
    </header>
  )
}

export default Header
