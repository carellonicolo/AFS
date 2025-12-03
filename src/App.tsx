import { FC, useState } from 'react'
import AppLayout from './components/layout/AppLayout'
import DFACanvas from './components/canvas/DFACanvas'
import Toolbar from './components/controls/Toolbar'
import Sidebar from './components/layout/Sidebar'
import PropertiesPanel from './components/controls/PropertiesPanel'
import TestPanel from './components/controls/TestPanel'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import { useAutoSave, useLoadSaved } from './hooks/useLocalStorage'
import { useUIStore } from './store/uiStore'
import ConfirmDialog from './components/ui/ConfirmDialog'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { Settings, Play } from 'lucide-react'
import { clsx } from 'clsx'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ReactFlowProvider } from '@xyflow/react'

const App: FC = () => {
  const { isSidebarOpen, closeSidebar, openSidebar } = useUIStore()
  const [activeTab, setActiveTab] = useState<'properties' | 'test'>('properties')

  // Enable keyboard shortcuts
  useKeyboardShortcuts()

  // Enable autosave & autoload
  useAutoSave()
  useLoadSaved()

  return (
    <ThemeProvider>
      <ReactFlowProvider>
        <AppLayout onOpenSidebar={openSidebar}>
          <div className="flex flex-col h-full">
            <Toolbar />
            <div className="flex flex-1 overflow-hidden">
              <div className="flex-1 relative">
                <DFACanvas className="w-full h-full" />
              </div>

              <Sidebar
                isOpen={isSidebarOpen}
                onClose={closeSidebar}
                title="Pannello"
              >
                {/* Tab Navigation */}
                <div className="flex border-b border-gray-200 dark:border-gray-700 -mx-4 px-4 mb-4">
                  <button
                    className={clsx(
                      'flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium border-b-2 transition-colors',
                      activeTab === 'properties'
                        ? 'border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600'
                    )}
                    onClick={() => setActiveTab('properties')}
                  >
                    <Settings className="w-4 h-4" />
                    Proprietà
                  </button>

                  <button
                    className={clsx(
                      'flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium border-b-2 transition-colors',
                      activeTab === 'test'
                        ? 'border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600'
                    )}
                    onClick={() => setActiveTab('test')}
                  >
                    <Play className="w-4 h-4" />
                    Test
                  </button>
                </div>

                {/* Tab Content */}
                <div>
                  {activeTab === 'properties' && (
                    <div className="space-y-6">
                      <PropertiesPanel />
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                        {/* Alphabet moved to header */}
                      </div>
                    </div>
                  )}

                  {activeTab === 'test' && (
                    <TestPanel />
                  )}
                </div>
              </Sidebar>
            </div>
          </div>
        </AppLayout>
      </ReactFlowProvider>
      <ConfirmDialog />
      <ToastContainer
        position="bottom-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </ThemeProvider>
  )
}

export default App
