import { FC } from 'react'
import { Activity } from 'lucide-react'

const Header: FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-full px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Activity className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                DFA Visual Editor
              </h1>
              <p className="text-sm text-gray-500">
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
