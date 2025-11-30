/**
 * Validation utilities
 */

/**
 * Validate that a string contains only symbols from the alphabet
 */
export function validateInputString(input: string, alphabet: string[]): {
  isValid: boolean
  error?: string
  invalidSymbol?: string
} {
  for (const char of input) {
    if (!alphabet.includes(char)) {
      return {
        isValid: false,
        error: `Simbolo '${char}' non presente nell'alfabeto {${alphabet.join(', ')}}`,
        invalidSymbol: char,
      }
    }
  }

  return { isValid: true }
}

/**
 * Debounce function for performance
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: number | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      if (timeout) clearTimeout(timeout)
      func(...args)
    }

    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait) as unknown as number
  }
}

/**
 * Safely parse JSON with error handling
 */
export function safeJSONParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T
  } catch {
    return fallback
  }
}
