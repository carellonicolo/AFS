/**
 * DFA Executor - Simulates DFA execution on input strings
 */

import type {
  DFADefinition,
  ExecutionResult,
  ExecutionStep,
} from '@/types'

export class DFAExecutor {
  private definition: DFADefinition

  constructor(definition: DFADefinition) {
    this.definition = definition
  }

  /**
   * Execute DFA on input string and return complete result
   */
  execute(input: string): ExecutionResult {
    // Find initial state
    const initialState = this.definition.states.find(
      (s) => s.type === 'initial' || s.type === 'initial-accepting'
    )

    if (!initialState) {
      return {
        accepted: false,
        steps: [],
        finalState: null,
        error: 'Nessuno stato iniziale definito',
      }
    }

    // Validate input against alphabet
    for (const char of input) {
      if (!this.definition.alphabet.includes(char)) {
        return {
          accepted: false,
          steps: [],
          finalState: null,
          error: `Simbolo invalido '${char}' non nell'alfabeto {${this.definition.alphabet.join(', ')}}`,
        }
      }
    }

    // Execute step by step
    const steps: ExecutionStep[] = []
    let currentState = initialState
    let remainingInput = input

    // Initial step
    steps.push({
      stepNumber: 0,
      currentState: currentState.id,
      remainingInput,
      consumedSymbol: null,
      transitionUsed: null,
    })

    // Process each symbol
    for (let i = 0; i < input.length; i++) {
      const symbol = input[i]

      // Find transition for this symbol
      const transition = this.definition.transitions.find(
        (t) => t.from === currentState.id && t.symbol === symbol
      )

      if (!transition) {
        return {
          accepted: false,
          steps,
          finalState: currentState.id,
          error: `Nessuna transizione dallo stato "${currentState.label}" per il simbolo '${symbol}'`,
        }
      }

      // Find next state
      const nextState = this.definition.states.find(
        (s) => s.id === transition.to
      )

      if (!nextState) {
        return {
          accepted: false,
          steps,
          finalState: currentState.id,
          error: `Stato di destinazione invalido: ${transition.to}`,
        }
      }

      // Update state
      currentState = nextState
      remainingInput = input.slice(i + 1)

      // Record step
      steps.push({
        stepNumber: i + 1,
        currentState: currentState.id,
        remainingInput,
        consumedSymbol: symbol,
        transitionUsed: transition.id,
      })
    }

    // Check if final state is accepting
    const isAccepting =
      currentState.type === 'accepting' ||
      currentState.type === 'initial-accepting'

    return {
      accepted: isAccepting,
      steps,
      finalState: currentState.id,
    }
  }

  /**
   * Execute only up to a specific step
   */
  executeUpToStep(input: string, targetStep: number): ExecutionResult {
    const fullResult = this.execute(input)

    if (fullResult.error) {
      return fullResult
    }

    // Trim steps to target
    const steps = fullResult.steps.slice(0, targetStep + 1)
    const lastStep = steps[steps.length - 1]

    // Determine if current state is accepting
    const currentState = this.definition.states.find(
      (s) => s.id === lastStep.currentState
    )

    const isAccepting =
      currentState?.type === 'accepting' ||
      currentState?.type === 'initial-accepting'

    return {
      accepted: isAccepting && lastStep.remainingInput === '',
      steps,
      finalState: lastStep.currentState,
    }
  }

  /**
   * Quick check if input is accepted (without returning steps)
   */
  accepts(input: string): boolean {
    const result = this.execute(input)
    return result.accepted
  }

  /**
   * Get the step count for a given input
   */
  getStepCount(input: string): number {
    return input.length + 1 // Initial step + one per character
  }
}
