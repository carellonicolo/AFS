/**
 * Custom hook for DFA execution
 */

import { useCallback, useEffect, useRef } from 'react'
import { useExecutionStore } from '@/store/executionStore'
import { useDFAStore } from '@/store/dfaStore'
import { DFAExecutor } from '@/core/dfa/DFAExecutor'

export function useExecution() {
  const execStore = useExecutionStore()
  const dfaStore = useDFAStore()
  const timerRef = useRef<number | null>(null)

  // Auto-advance execution
  useEffect(() => {
    if (execStore.isExecuting && !execStore.isPaused) {
      if (execStore.isAtEnd()) {
        execStore.pauseExecution()
        return
      }

      timerRef.current = setTimeout(() => {
        execStore.stepForward()
      }, execStore.speed)

      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current)
        }
      }
    }
  }, [execStore.isExecuting, execStore.isPaused, execStore.currentStepIndex, execStore.speed])

  const executeInput = useCallback((input: string) => {
    const definition = dfaStore.getDefinition()
    const executor = new DFAExecutor(definition)
    const result = executor.execute(input)

    execStore.setInputString(input)
    execStore.setExecutionResult(result)
    execStore.setCurrentStepIndex(0)

    return result
  }, [dfaStore, execStore])

  const run = useCallback((input: string) => {
    const result = executeInput(input)
    if (!result.error) {
      execStore.startExecution()
    }
    return result
  }, [executeInput, execStore])

  const runStepByStep = useCallback((input: string) => {
    const result = executeInput(input)
    return result
  }, [executeInput])

  return {
    // Store state
    ...execStore,

    // Custom methods
    executeInput,
    run,
    runStepByStep,
  }
}
