/**
 * Application constants
 */

// Node dimensions
export const NODE_WIDTH = 60
export const NODE_HEIGHT = 60

// Colors
export const COLORS = {
  state: {
    normal: '#e5e7eb', // gray-200
    initial: '#dbeafe', // blue-100
    accepting: '#d1fae5', // green-100
    initialAccepting: '#fef3c7', // yellow-100
  },
  stateBorder: {
    normal: '#9ca3af', // gray-400
    initial: '#3b82f6', // blue-500
    accepting: '#10b981', // green-500
    initialAccepting: '#f59e0b', // yellow-500
  },
  highlight: '#ef4444', // red-500
  transition: '#6b7280', // gray-500
}

// Grid settings
export const GRID_SIZE = 20

// Animation speeds (ms)
export const ANIMATION_SPEEDS = {
  slow: 1500,
  medium: 500,
  fast: 150,
}

// Default alphabet
export const DEFAULT_ALPHABET = ['0', '1']

// Max label length
export const MAX_LABEL_LENGTH = 10
