/**
 * Theme Context - Dark/Light Mode Management
 */

import { useEffect, useState, ReactNode } from 'react'
import { Theme } from '@/types'
import { ThemeContext, ThemeContextType } from './theme-context'

const STORAGE_KEY = 'dfa-theme'

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  // Initialize theme from localStorage or system preference
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored === 'light' || stored === 'dark') {
        return stored
      }

      // Check system preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark'
      }

      return 'light'
    } catch (error) {
      console.error('Failed to load theme from localStorage:', error)
      return 'light'
    }
  })

  // Apply theme to HTML element and persist to localStorage
  useEffect(() => {
    const root = document.documentElement

    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }

    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch (error) {
      console.error('Failed to save theme to localStorage:', error)
    }
  }, [theme])

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
  }

  const value: ThemeContextType = {
    theme,
    toggleTheme,
    setTheme,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
