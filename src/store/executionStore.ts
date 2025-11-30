/**
 * Execution Store - Manages DFA execution state
 */

import { create } from 'zustand'
import type { ExecutionResult, ExecutionStep } from '@/types'

interface ExecutionStore {
  // State
  isExecuting: boolean
  isPaused: boolean
  inputString: string
  currentStepIndex: number
  executionResult: ExecutionResult | null
  speed: number // milliseconds per step (100-2000)

  // Getters
  getCurrentStep: () => ExecutionStep | null
  getTotalSteps: () => number
  isAtStart: () => boolean
  isAtEnd: () => boolean

  // Actions
  setInputString: (input: string) => void
  setExecutionResult: (result: ExecutionResult | null) => void
  setCurrentStepIndex: (index: number) => void
  setSpeed: (speed: number) => void

  // Execution controls
  startExecution: () => void
  pauseExecution: () => void
  resumeExecution: () => void
  stopExecution: () => void
  reset: () => void

  // Step controls
  stepForward: () => void
  stepBackward: () => void
  jumpToStep: (stepIndex: number) => void
  goToStart: () => void
  goToEnd: () => void
}

export const useExecutionStore = create<ExecutionStore>((set, get) => ({
  // Initial state
  isExecuting: false,
  isPaused: false,
  inputString: '',
  currentStepIndex: 0,
  executionResult: null,
  speed: 500, // 500ms per step by default

  // Getters
  getCurrentStep: () => {
    const { executionResult, currentStepIndex } = get()
    if (!executionResult || currentStepIndex >= executionResult.steps.length) {
      return null
    }
    return executionResult.steps[currentStepIndex]
  },

  getTotalSteps: () => {
    const { executionResult } = get()
    return executionResult?.steps.length || 0
  },

  isAtStart: () => get().currentStepIndex === 0,

  isAtEnd: () => {
    const { currentStepIndex, executionResult } = get()
    return executionResult ? currentStepIndex >= executionResult.steps.length - 1 : false
  },

  // Actions
  setInputString: (input) => set({ inputString: input }),

  setExecutionResult: (result) => set({ executionResult: result }),

  setCurrentStepIndex: (index) => {
    const { executionResult } = get()
    if (!executionResult) return

    const clampedIndex = Math.max(
      0,
      Math.min(index, executionResult.steps.length - 1)
    )
    set({ currentStepIndex: clampedIndex })
  },

  setSpeed: (speed) => {
    const clampedSpeed = Math.max(100, Math.min(2000, speed))
    set({ speed: clampedSpeed })
  },

  // Execution controls
  startExecution: () => {
    set({
      isExecuting: true,
      isPaused: false,
      currentStepIndex: 0,
    })
  },

  pauseExecution: () => set({ isPaused: true }),

  resumeExecution: () => set({ isPaused: false }),

  stopExecution: () => {
    set({
      isExecuting: false,
      isPaused: false,
      currentStepIndex: 0,
    })
  },

  reset: () => {
    set({
      isExecuting: false,
      isPaused: false,
      inputString: '',
      currentStepIndex: 0,
      executionResult: null,
    })
  },

  // Step controls
  stepForward: () => {
    const { currentStepIndex, executionResult } = get()
    if (!executionResult) return

    if (currentStepIndex < executionResult.steps.length - 1) {
      set({ currentStepIndex: currentStepIndex + 1 })
    }
  },

  stepBackward: () => {
    const { currentStepIndex } = get()
    if (currentStepIndex > 0) {
      set({ currentStepIndex: currentStepIndex - 1 })
    }
  },

  jumpToStep: (stepIndex) => {
    get().setCurrentStepIndex(stepIndex)
  },

  goToStart: () => set({ currentStepIndex: 0 }),

  goToEnd: () => {
    const { executionResult } = get()
    if (executionResult) {
      set({ currentStepIndex: executionResult.steps.length - 1 })
    }
  },
}))
