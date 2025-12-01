/**
 * DFA Store - Manages DFA state using Zustand
 */

import { create } from 'zustand'
import { DFA } from '@/core/dfa/DFA'
import { DFAValidator } from '@/core/dfa/DFAValidator'
import type { DFADefinition, DFAState, DFATransition, ValidationResult } from '@/types'

interface DFAStore {
  // State
  dfa: DFA
  selectedNodeId: string | null
  selectedEdgeId: string | null
  validationResult: ValidationResult | null

  // State getters
  getDefinition: () => DFADefinition
  getStates: () => DFAState[]
  getTransitions: () => DFATransition[]
  getAlphabet: () => string[]

  // State actions
  addState: (state: DFAState) => void
  removeState: (stateId: string) => void
  updateState: (stateId: string, updates: Partial<DFAState>) => void

  // Transition actions
  addTransition: (transition: DFATransition) => void
  removeTransition: (transitionId: string) => void
  updateTransition: (transitionId: string, updates: Partial<DFATransition>) => void

  // Alphabet actions
  setAlphabet: (alphabet: string[]) => void

  // Selection actions
  selectNode: (nodeId: string | null) => void
  selectEdge: (edgeId: string | null) => void
  clearSelection: () => void

  // Bulk actions
  loadDFA: (definition: DFADefinition) => void
  clearDFA: () => void
  updateMetadata: (updates: Partial<DFADefinition['metadata']>) => void

  // Validation
  validate: () => ValidationResult
  isValid: () => boolean
}

export const useDFAStore = create<DFAStore>()((set, get) => ({
  // Initial state
  dfa: new DFA(),
  selectedNodeId: null,
  selectedEdgeId: null,
  validationResult: null,

  // Getters
  getDefinition: () => get().dfa.getDefinition(),
  getStates: () => get().dfa.getStates(),
  getTransitions: () => get().dfa.getTransitions(),
  getAlphabet: () => get().dfa.getAlphabet(),

  // State actions
  addState: (state) => {
    const { dfa } = get()
    dfa.addState(state)
    set({ dfa: new DFA(dfa.getDefinition()) })
    get().validate()
  },

  removeState: (stateId) => {
    const { dfa, selectedNodeId } = get()
    dfa.removeState(stateId)
    set({
      dfa: new DFA(dfa.getDefinition()),
      selectedNodeId: selectedNodeId === stateId ? null : selectedNodeId,
    })
    get().validate()
  },

  updateState: (stateId, updates) => {
    const { dfa } = get()
    dfa.updateState(stateId, updates)
    set({ dfa: new DFA(dfa.getDefinition()) })
    get().validate()
  },

  // Transition actions
  addTransition: (transition) => {
    const { dfa } = get()
    try {
      dfa.addTransition(transition)
      set({ dfa: new DFA(dfa.getDefinition()) })
      get().validate()
    } catch (error) {
      console.error('Failed to add transition:', error)
      throw error
    }
  },

  removeTransition: (transitionId) => {
    const { dfa, selectedEdgeId } = get()
    dfa.removeTransition(transitionId)
    set({
      dfa: new DFA(dfa.getDefinition()),
      selectedEdgeId: selectedEdgeId === transitionId ? null : selectedEdgeId,
    })
    get().validate()
  },

  updateTransition: (transitionId, updates) => {
    const { dfa } = get()
    try {
      dfa.updateTransition(transitionId, updates)
      set({ dfa: new DFA(dfa.getDefinition()) })
      get().validate()
    } catch (error) {
      console.error('Failed to update transition:', error)
      throw error
    }
  },

  // Alphabet actions
  setAlphabet: (alphabet) => {
    const { dfa } = get()
    try {
      dfa.setAlphabet(alphabet)
      set({ dfa: new DFA(dfa.getDefinition()) })
      get().validate()
    } catch (error) {
      console.error('Failed to set alphabet:', error)
      throw error
    }
  },

  // Selection actions
  selectNode: (nodeId) => set({ selectedNodeId: nodeId, selectedEdgeId: null }),
  selectEdge: (edgeId) => set({ selectedEdgeId: edgeId, selectedNodeId: null }),
  clearSelection: () => set({ selectedNodeId: null, selectedEdgeId: null }),

  // Bulk actions
  loadDFA: (definition) => {
    const dfa = new DFA(definition)
    set({
      dfa,
      selectedNodeId: null,
      selectedEdgeId: null,
    })
    get().validate()
  },

  clearDFA: () => {
    const dfa = new DFA()
    set({
      dfa,
      selectedNodeId: null,
      selectedEdgeId: null,
      validationResult: null,
    })
  },

  updateMetadata: (updates) => {
    const { dfa } = get()
    dfa.updateMetadata(updates)
    set({ dfa: new DFA(dfa.getDefinition()) })
  },

  // Validation
  validate: () => {
    const { dfa } = get()
    const validator = new DFAValidator(dfa.getDefinition())
    const result = validator.validate()
    set({ validationResult: result })
    return result
  },

  isValid: () => {
    const result = get().validationResult || get().validate()
    return result.isValid
  },
}))
