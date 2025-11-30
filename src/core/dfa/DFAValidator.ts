/**
 * DFA Validator - Validates DFA structure and properties
 */

import type {
  DFADefinition,
  ValidationResult,
  ValidationError,
  ValidationWarning,
} from '@/types'

export class DFAValidator {
  private definition: DFADefinition

  constructor(definition: DFADefinition) {
    this.definition = definition
  }

  /**
   * Validate the entire DFA
   */
  validate(): ValidationResult {
    const errors: ValidationError[] = []
    const warnings: ValidationWarning[] = []

    // 1. Validate initial state
    const initialStateErrors = this.validateInitialState()
    errors.push(...initialStateErrors)

    // 2. Check for accepting states (warning only)
    const acceptingStateWarnings = this.validateAcceptingStates()
    warnings.push(...acceptingStateWarnings)

    // 3. Validate determinism
    const determinismErrors = this.validateDeterminism()
    errors.push(...determinismErrors)

    // 4. Validate transitions completeness
    const completenessWarnings = this.validateCompleteness()
    warnings.push(...completenessWarnings)

    // 5. Validate reachability
    const reachabilityWarnings = this.validateReachability()
    warnings.push(...reachabilityWarnings)

    // 6. Validate transition symbols
    const symbolErrors = this.validateTransitionSymbols()
    errors.push(...symbolErrors)

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    }
  }

  /**
   * Validate that there is exactly one initial state
   */
  private validateInitialState(): ValidationError[] {
    const errors: ValidationError[] = []

    const initialStates = this.definition.states.filter(
      (s) => s.type === 'initial' || s.type === 'initial-accepting'
    )

    if (initialStates.length === 0) {
      errors.push({
        type: 'NO_INITIAL_STATE',
        message: 'Il DFA deve avere esattamente uno stato iniziale',
      })
    } else if (initialStates.length > 1) {
      errors.push({
        type: 'MULTIPLE_INITIAL_STATES',
        message: `Il DFA ha ${initialStates.length} stati iniziali. Deve averne esattamente uno.`,
      })
    }

    return errors
  }

  /**
   * Validate that there is at least one accepting state (warning)
   */
  private validateAcceptingStates(): ValidationWarning[] {
    const warnings: ValidationWarning[] = []

    const acceptingStates = this.definition.states.filter(
      (s) => s.type === 'accepting' || s.type === 'initial-accepting'
    )

    if (acceptingStates.length === 0) {
      warnings.push({
        type: 'NO_ACCEPTING_STATE',
        message:
          'Il DFA non ha stati accettanti - rigetter\u00e0 tutti gli input',
      })
    }

    return warnings
  }

  /**
   * Validate determinism - each state must have at most one transition per symbol
   */
  private validateDeterminism(): ValidationError[] {
    const errors: ValidationError[] = []

    for (const state of this.definition.states) {
      // Count transitions per symbol from this state
      const symbolMap = new Map<string, number>()

      const transitionsFromState = this.definition.transitions.filter(
        (t) => t.from === state.id
      )

      for (const transition of transitionsFromState) {
        const count = symbolMap.get(transition.symbol) || 0
        symbolMap.set(transition.symbol, count + 1)
      }

      // Check for duplicate transitions
      for (const [symbol, count] of symbolMap.entries()) {
        if (count > 1) {
          errors.push({
            type: 'NON_DETERMINISTIC',
            message: `Lo stato "${state.label}" ha ${count} transizioni per il simbolo '${symbol}'. Un DFA deve essere deterministico.`,
            stateId: state.id,
          })
        }
      }
    }

    return errors
  }

  /**
   * Validate completeness - warn if states are missing transitions
   */
  private validateCompleteness(): ValidationWarning[] {
    const warnings: ValidationWarning[] = []

    for (const state of this.definition.states) {
      // Get transitions from this state
      const transitionsFromState = this.definition.transitions.filter(
        (t) => t.from === state.id
      )

      const symbolsWithTransitions = new Set(
        transitionsFromState.map((t) => t.symbol)
      )

      // Check for missing transitions
      for (const symbol of this.definition.alphabet) {
        if (!symbolsWithTransitions.has(symbol)) {
          warnings.push({
            type: 'INCOMPLETE_TRANSITIONS',
            message: `Lo stato "${state.label}" non ha transizioni per il simbolo '${symbol}'`,
            stateId: state.id,
          })
        }
      }
    }

    return warnings
  }

  /**
   * Validate reachability - warn about unreachable states
   */
  private validateReachability(): ValidationWarning[] {
    const warnings: ValidationWarning[] = []

    const initialState = this.definition.states.find(
      (s) => s.type === 'initial' || s.type === 'initial-accepting'
    )

    if (!initialState) {
      // No initial state - can't check reachability
      return warnings
    }

    const reachableStates = this.findReachableStates(initialState.id)

    for (const state of this.definition.states) {
      if (!reachableStates.has(state.id)) {
        warnings.push({
          type: 'UNREACHABLE_STATE',
          message: `Lo stato "${state.label}" non è raggiungibile dallo stato iniziale`,
          stateId: state.id,
        })
      }
    }

    return warnings
  }

  /**
   * Validate that all transition symbols are in the alphabet
   */
  private validateTransitionSymbols(): ValidationError[] {
    const errors: ValidationError[] = []

    for (const transition of this.definition.transitions) {
      if (!this.definition.alphabet.includes(transition.symbol)) {
        errors.push({
          type: 'INVALID_SYMBOL',
          message: `La transizione usa il simbolo '${transition.symbol}' che non è nell'alfabeto {${this.definition.alphabet.join(', ')}}`,
          transitionId: transition.id,
        })
      }
    }

    return errors
  }

  /**
   * Find all reachable states from a given state using BFS
   */
  private findReachableStates(startStateId: string): Set<string> {
    const reachable = new Set<string>()
    const queue: string[] = [startStateId]

    while (queue.length > 0) {
      const currentStateId = queue.shift()!

      if (reachable.has(currentStateId)) {
        continue
      }

      reachable.add(currentStateId)

      // Find all transitions from current state
      const outgoingTransitions = this.definition.transitions.filter(
        (t) => t.from === currentStateId
      )

      // Add target states to queue
      for (const transition of outgoingTransitions) {
        if (!reachable.has(transition.to)) {
          queue.push(transition.to)
        }
      }
    }

    return reachable
  }

  /**
   * Quick check if DFA is valid (has no errors)
   */
  isValid(): boolean {
    return this.validate().isValid
  }

  /**
   * Get only errors
   */
  getErrors(): ValidationError[] {
    return this.validate().errors
  }

  /**
   * Get only warnings
   */
  getWarnings(): ValidationWarning[] {
    return this.validate().warnings
  }
}
