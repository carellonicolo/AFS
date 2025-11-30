/**
 * Core DFA class with CRUD operations
 */

import type { DFADefinition, DFAState, DFATransition } from '@/types'

export class DFA {
  private definition: DFADefinition

  constructor(definition?: Partial<DFADefinition>) {
    this.definition = {
      states: definition?.states || [],
      transitions: definition?.transitions || [],
      alphabet: definition?.alphabet || ['0', '1'],
      metadata: {
        name: definition?.metadata?.name || 'Untitled DFA',
        description: definition?.metadata?.description || '',
        createdAt: definition?.metadata?.createdAt || new Date().toISOString(),
        modifiedAt: new Date().toISOString(),
      },
    }
  }

  // ========== State Operations ==========

  /**
   * Add a new state to the DFA
   */
  addState(state: DFAState): void {
    // If this is an initial state, remove initial flag from other states
    if (state.type === 'initial' || state.type === 'initial-accepting') {
      this.definition.states = this.definition.states.map((s) => {
        if (s.type === 'initial') return { ...s, type: 'normal' }
        if (s.type === 'initial-accepting') return { ...s, type: 'accepting' }
        return s
      })
    }

    this.definition.states.push(state)
    this.updateModifiedDate()
  }

  /**
   * Remove a state and all associated transitions
   */
  removeState(stateId: string): void {
    this.definition.states = this.definition.states.filter(
      (s) => s.id !== stateId
    )

    // Remove all transitions involving this state
    this.definition.transitions = this.definition.transitions.filter(
      (t) => t.from !== stateId && t.to !== stateId
    )

    this.updateModifiedDate()
  }

  /**
   * Update an existing state
   */
  updateState(stateId: string, updates: Partial<DFAState>): void {
    const stateIndex = this.definition.states.findIndex((s) => s.id === stateId)
    if (stateIndex === -1) {
      throw new Error(`State with id ${stateId} not found`)
    }

    const updatedState = { ...this.definition.states[stateIndex], ...updates }

    // If changing to initial state, remove initial from others
    if (
      (updatedState.type === 'initial' ||
        updatedState.type === 'initial-accepting') &&
      this.definition.states[stateIndex].type !== updatedState.type
    ) {
      this.definition.states = this.definition.states.map((s, i) => {
        if (i === stateIndex) return updatedState
        if (s.type === 'initial') return { ...s, type: 'normal' }
        if (s.type === 'initial-accepting') return { ...s, type: 'accepting' }
        return s
      })
    } else {
      this.definition.states[stateIndex] = updatedState
    }

    this.updateModifiedDate()
  }

  /**
   * Get a state by ID
   */
  getState(stateId: string): DFAState | undefined {
    return this.definition.states.find((s) => s.id === stateId)
  }

  /**
   * Get all states
   */
  getStates(): DFAState[] {
    return this.definition.states
  }

  /**
   * Get initial state
   */
  getInitialState(): DFAState | null {
    return (
      this.definition.states.find(
        (s) => s.type === 'initial' || s.type === 'initial-accepting'
      ) || null
    )
  }

  /**
   * Get all accepting states
   */
  getAcceptingStates(): DFAState[] {
    return this.definition.states.filter(
      (s) => s.type === 'accepting' || s.type === 'initial-accepting'
    )
  }

  // ========== Transition Operations ==========

  /**
   * Add a new transition
   */
  addTransition(transition: DFATransition): void {
    // Validate that states exist
    const fromState = this.getState(transition.from)
    const toState = this.getState(transition.to)

    if (!fromState) {
      throw new Error(`Source state ${transition.from} not found`)
    }
    if (!toState) {
      throw new Error(`Target state ${transition.to} not found`)
    }

    // Validate symbol is in alphabet
    if (!this.definition.alphabet.includes(transition.symbol)) {
      throw new Error(
        `Symbol '${transition.symbol}' not in alphabet {${this.definition.alphabet.join(', ')}}`
      )
    }

    this.definition.transitions.push(transition)
    this.updateModifiedDate()
  }

  /**
   * Remove a transition
   */
  removeTransition(transitionId: string): void {
    this.definition.transitions = this.definition.transitions.filter(
      (t) => t.id !== transitionId
    )
    this.updateModifiedDate()
  }

  /**
   * Update an existing transition
   */
  updateTransition(
    transitionId: string,
    updates: Partial<DFATransition>
  ): void {
    const transitionIndex = this.definition.transitions.findIndex(
      (t) => t.id === transitionId
    )
    if (transitionIndex === -1) {
      throw new Error(`Transition with id ${transitionId} not found`)
    }

    const updatedTransition = {
      ...this.definition.transitions[transitionIndex],
      ...updates,
    }

    // Validate symbol if changed
    if (
      updates.symbol &&
      !this.definition.alphabet.includes(updates.symbol)
    ) {
      throw new Error(
        `Symbol '${updates.symbol}' not in alphabet {${this.definition.alphabet.join(', ')}}`
      )
    }

    this.definition.transitions[transitionIndex] = updatedTransition
    this.updateModifiedDate()
  }

  /**
   * Get a transition by ID
   */
  getTransition(transitionId: string): DFATransition | undefined {
    return this.definition.transitions.find((t) => t.id === transitionId)
  }

  /**
   * Get all transitions
   */
  getTransitions(): DFATransition[] {
    return this.definition.transitions
  }

  /**
   * Get transitions from a specific state
   */
  getTransitionsFromState(stateId: string): DFATransition[] {
    return this.definition.transitions.filter((t) => t.from === stateId)
  }

  /**
   * Get transition for a specific state and symbol
   */
  getTransitionForSymbol(
    stateId: string,
    symbol: string
  ): DFATransition | undefined {
    return this.definition.transitions.find(
      (t) => t.from === stateId && t.symbol === symbol
    )
  }

  // ========== Alphabet Operations ==========

  /**
   * Set the alphabet
   */
  setAlphabet(alphabet: string[]): void {
    // Validate that alphabet is not empty
    if (alphabet.length === 0) {
      throw new Error('Alphabet cannot be empty')
    }

    // Validate that alphabet symbols are single characters
    for (const symbol of alphabet) {
      if (symbol.length !== 1) {
        throw new Error(`Alphabet symbols must be single characters: '${symbol}'`)
      }
    }

    // Remove duplicate symbols
    this.definition.alphabet = Array.from(new Set(alphabet))
    this.updateModifiedDate()
  }

  /**
   * Get the alphabet
   */
  getAlphabet(): string[] {
    return this.definition.alphabet
  }

  // ========== Metadata Operations ==========

  /**
   * Update metadata
   */
  updateMetadata(updates: Partial<DFADefinition['metadata']>): void {
    this.definition.metadata = {
      ...this.definition.metadata,
      ...updates,
    }
    this.updateModifiedDate()
  }

  /**
   * Get metadata
   */
  getMetadata(): DFADefinition['metadata'] {
    return this.definition.metadata
  }

  // ========== Utility Methods ==========

  /**
   * Get complete DFA definition
   */
  getDefinition(): DFADefinition {
    return structuredClone(this.definition)
  }

  /**
   * Load a complete DFA definition
   */
  loadDefinition(definition: DFADefinition): void {
    this.definition = structuredClone(definition)
  }

  /**
   * Clear all states and transitions
   */
  clear(): void {
    this.definition.states = []
    this.definition.transitions = []
    this.updateModifiedDate()
  }

  /**
   * Update the modified date
   */
  private updateModifiedDate(): void {
    this.definition.metadata.modifiedAt = new Date().toISOString()
  }

  /**
   * Generate a unique state ID
   */
  static generateStateId(): string {
    return `q${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Generate a unique transition ID
   */
  static generateTransitionId(): string {
    return `t${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}
