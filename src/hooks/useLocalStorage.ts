/**
 * Custom hook for localStorage autosave
 */

import { useEffect, useRef } from 'react'
import { useDFAStore } from '@/store/dfaStore'

const AUTOSAVE_DELAY = 5000 // 5 seconds
const STORAGE_KEY = 'dfa-autosave'

export function useAutoSave() {
  const definition = useDFAStore((state) => state.getDefinition())
  const timerRef = useRef<number | null>(null)
  const lastSavedRef = useRef<string>('')

  useEffect(() => {
    // Clear existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    const currentData = JSON.stringify(definition)

    // Only save if data actually changed
    if (currentData === lastSavedRef.current) {
      return
    }

    timerRef.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, currentData)
        lastSavedRef.current = currentData
      } catch (error) {
        console.error('Failed to autosave:', error)
      }
    }, AUTOSAVE_DELAY) as unknown as number

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
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
