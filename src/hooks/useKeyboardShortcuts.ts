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

      // Check if user is typing in an input/textarea
      const target = e.target as HTMLElement
      const isInputFocused =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable

      // Delete selected element (Delete/Backspace)
      if ((e.key === 'Delete' || e.key === 'Backspace') && !isInputFocused) {
        // Get selected state for confirmation
        const selectedState = dfa.selectedNodeId
          ? dfa.getStates().find((s) => s.id === dfa.selectedNodeId)
          : null

        // For states, show confirmation dialog
        if (selectedState) {
          if (confirm(`Eliminare lo stato "${selectedState.label}"?`)) {
            e.preventDefault()
            dfa.deleteSelected()
          }
        }
        // For transitions, delete without confirmation
        else if (dfa.selectedEdgeId) {
          e.preventDefault()
          dfa.deleteSelected()
        }
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
