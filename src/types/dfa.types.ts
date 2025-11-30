/**
 * Type definitions for Deterministic Finite Automaton (DFA)
 */

// State type classification
export type StateType = 'normal' | 'initial' | 'accepting' | 'initial-accepting'

// DFA State representation
export interface DFAState {
  id: string // Unique identifier (e.g., 'q0', 'q1')
  label: string // Display name (e.g., 'S0', 'Start')
  type: StateType // State classification
  position: { x: number; y: number } // Canvas position
  metadata?: {
    description?: string
    color?: string
  }
}

// DFA Transition representation
export interface DFATransition {
  id: string // Unique identifier
  from: string // Source state ID
  to: string // Target state ID
  symbol: string // Input symbol (single character)
  metadata?: {
    color?: string
  }
}

// Complete DFA definition
export interface DFADefinition {
  states: DFAState[]
  transitions: DFATransition[]
  alphabet: string[] // Valid input symbols (e.g., ['0', '1'])
  metadata: {
    name: string
    description: string
    createdAt: string
    modifiedAt: string
  }
}

// Execution step during DFA simulation
export interface ExecutionStep {
  stepNumber: number
  currentState: string // Current state ID
  remainingInput: string // Unprocessed input
  consumedSymbol: string | null // Symbol just consumed
  transitionUsed: string | null // Transition ID used
}

// Execution result
export interface ExecutionResult {
  accepted: boolean // Whether input was accepted
  steps: ExecutionStep[] // Step-by-step execution history
  finalState: string | null // Final state ID reached
  error?: string // Error message if execution failed
}

// Validation error
export interface ValidationError {
  type:
    | 'NO_INITIAL_STATE'
    | 'MULTIPLE_INITIAL_STATES'
    | 'NON_DETERMINISTIC'
    | 'INVALID_TRANSITION'
    | 'UNREACHABLE_STATE'
    | 'INCOMPLETE_TRANSITIONS'
    | 'INVALID_SYMBOL'
  message: string
  stateId?: string
  transitionId?: string
}

// Validation warning
export interface ValidationWarning {
  type:
    | 'NO_ACCEPTING_STATE'
    | 'UNREACHABLE_STATE'
    | 'INCOMPLETE_TRANSITIONS'
  message: string
  stateId?: string
}

// Validation result
export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
  warnings: ValidationWarning[]
}

// Export/Import formats
export type ExportFormat = 'json' | 'png' | 'svg'

// Tutorial step
export interface TutorialStep {
  id: string
  title: string
  description: string
  target: string // CSS selector for spotlight
  action: 'click' | 'input' | 'observe'
  validation: () => boolean
}
