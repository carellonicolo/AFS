/**
 * Custom hook for DFA operations
 */

import { useCallback } from 'react'
import { useDFAStore } from '@/store/dfaStore'
import { DFA } from '@/core/dfa/DFA'
import type { DFAState, DFATransition } from '@/types'

export function useDFA() {
  const store = useDFAStore()

  const createState = useCallback((position: { x: number; y: number }, type: DFAState['type'] = 'normal') => {
    const stateCount = store.getStates().length
    const state: DFAState = {
      id: DFA.generateStateId(),
      label: `S${stateCount}`,
      type,
      position,
    }
    store.addState(state)
    store.selectNode(state.id)
    return state
  }, [store])

  const createTransition = useCallback((from: string, to: string, symbol: string) => {
    const transition: DFATransition = {
      id: DFA.generateTransitionId(),
      from,
      to,
      symbol,
    }
    store.addTransition(transition)
    store.selectEdge(transition.id)
    return transition
  }, [store])

  const deleteSelected = useCallback(() => {
    const { selectedNodeId, selectedEdgeId } = store
    if (selectedNodeId) {
      store.removeState(selectedNodeId)
    } else if (selectedEdgeId) {
      store.removeTransition(selectedEdgeId)
    }
  }, [store])

  return {
    // Store methods
    ...store,

    // Helper methods
    createState,
    createTransition,
    deleteSelected,
  }
}
