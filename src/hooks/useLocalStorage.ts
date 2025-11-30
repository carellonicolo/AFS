/**
 * Custom hook for localStorage autosave
 */

import { useEffect } from 'react'
import { useDFAStore } from '@/store/dfaStore'

const AUTOSAVE_DELAY = 5000 // 5 seconds
const STORAGE_KEY = 'dfa-autosave'

export function useAutoSave() {
  const definition = useDFAStore((state) => state.getDefinition())

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(definition))
      } catch (error) {
        console.error('Failed to autosave:', error)
      }
    }, AUTOSAVE_DELAY)

    return () => clearTimeout(timer)
  }, [definition])
}

export function useLoadSaved() {
  const loadDFA = useDFAStore((state) => state.loadDFA)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const definition = JSON.parse(saved)
        loadDFA(definition)
      }
    } catch (error) {
      console.error('Failed to load saved DFA:', error)
    }
  }, [loadDFA])
}
