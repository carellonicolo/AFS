import { createPortal } from 'react-dom'
import { useUIStore } from '@/store/uiStore'
import Button from './Button'
import { AlertTriangle, AlertCircle } from 'lucide-react'
import { clsx } from 'clsx'
import { useEffect, useRef } from 'react'

const ConfirmDialog = () => {
  const { confirmDialog, confirmAction, cancelAction } = useUIStore()
  const cancelButtonRef = useRef<HTMLButtonElement>(null)

  // Focus su pulsante Annulla quando dialog si apre
  useEffect(() => {
    if (confirmDialog?.isOpen) {
      cancelButtonRef.current?.focus()
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = ''
      }
    }
  }, [confirmDialog?.isOpen])

  // Gestione keyboard shortcuts
  useEffect(() => {
    if (!confirmDialog?.isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        cancelAction()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [confirmDialog?.isOpen, cancelAction])

  if (!confirmDialog?.isOpen) return null

  const Icon = confirmDialog.variant === 'danger' ? AlertCircle : AlertTriangle
  const iconColor = confirmDialog.variant === 'danger'
    ? 'text-red-500 dark:text-red-400'
    : 'text-yellow-500 dark:text-yellow-400'

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 dark:bg-black/70"
        onClick={cancelAction}
      />

      {/* Dialog */}
      <div
        className={clsx(
          'relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl max-w-md w-full',
          'transition-all duration-200 ease-out'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          <Icon className={clsx('w-6 h-6 flex-shrink-0 mt-1', iconColor)} />

          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {confirmDialog.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {confirmDialog.message}
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            ref={cancelButtonRef}
            variant="secondary"
            size="md"
            onClick={cancelAction}
            className="flex-1"
          >
            {confirmDialog.cancelLabel}
          </Button>
          <Button
            variant={confirmDialog.variant === 'danger' ? 'danger' : 'primary'}
            size="md"
            onClick={confirmAction}
            className="flex-1"
          >
            {confirmDialog.confirmLabel}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default ConfirmDialog
