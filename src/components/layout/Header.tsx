import { FC } from 'react'
import { Activity } from 'lucide-react'

const Header: FC = () => {
  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-full px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
              <Activity className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                DFA Visual Editor
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Editor per Automi a Stati Finiti Deterministici
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Toolbar buttons will go here */}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
