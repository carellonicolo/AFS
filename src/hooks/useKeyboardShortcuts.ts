/**
 * Custom hook for keyboard shortcuts
 */

import { useEffect } from 'react'
import { useDFA } from './useDFA'
import { useExecution } from './useExecution'
import { DFASerializer } from '@/core/dfa/DFASerializer'

export function useKeyboardShortcuts() {
  const dfa = useDFA()
  const execution = useExecution()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
      const modifier = isMac ? e.metaKey : e.ctrlKey

      // Delete selected element
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault()
        dfa.deleteSelected()
      }

      // Save (Ctrl/Cmd + S)
      if (modifier && e.key === 's') {
        e.preventDefault()
        DFASerializer.exportToFile(dfa.getDefinition())
      }

      // Clear selection (Escape)
      if (e.key === 'Escape') {
        e.preventDefault()
        dfa.clearSelection()
      }

      // Toggle execution (Space)
      if (e.key === ' ' && execution.executionResult) {
        e.preventDefault()
        if (execution.isExecuting && !execution.isPaused) {
          execution.pauseExecution()
        } else if (execution.isPaused) {
          execution.resumeExecution()
        }
      }

      // Step forward (Right Arrow)
      if (e.key === 'ArrowRight' && execution.executionResult && !execution.isExecuting) {
        e.preventDefault()
        execution.stepForward()
      }

      // Step backward (Left Arrow)
      if (e.key === 'ArrowLeft' && execution.executionResult && !execution.isExecuting) {
        e.preventDefault()
        execution.stepBackward()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [dfa, execution])
}
