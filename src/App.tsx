import { FC } from 'react'
import AppLayout from './components/layout/AppLayout'
import DFACanvas from './components/canvas/DFACanvas'
import Toolbar from './components/controls/Toolbar'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import { useAutoSave, useLoadSaved } from './hooks/useLocalStorage'
import ConfirmDialog from './components/ui/ConfirmDialog'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ReactFlowProvider } from '@xyflow/react'

const App: FC = () => {
  // Enable keyboard shortcuts
  useKeyboardShortcuts()

  // Enable autosave & autoload
  useAutoSave()
  useLoadSaved()

  return (
    <ThemeProvider>
      <ReactFlowProvider>
        <AppLayout>
          <div className="flex flex-col h-full">
            <Toolbar />
            <div className="flex-1 relative">
              <DFACanvas className="w-full h-full" />
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
