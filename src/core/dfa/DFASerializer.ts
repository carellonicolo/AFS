/**
 * DFA Serializer - Handles JSON serialization and deserialization
 */

import type { DFADefinition } from '@/types'

export class DFASerializer {
  /**
   * Serialize DFA to JSON string
   */
  static toJSON(definition: DFADefinition, prettify = true): string {
    return JSON.stringify(definition, null, prettify ? 2 : 0)
  }

  /**
   * Deserialize JSON string to DFA definition
   */
  static fromJSON(json: string): DFADefinition {
    try {
      const parsed = JSON.parse(json)
      this.validateSchema(parsed)
      return parsed as DFADefinition
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error('Invalid JSON format')
      }
      throw error
    }
  }

  /**
   * Validate that parsed JSON matches DFA schema
   */
  private static validateSchema(obj: unknown): void {
    if (typeof obj !== 'object' || obj === null) {
      throw new Error('DFA definition must be an object')
    }

    const def = obj as Record<string, unknown>

    // Validate states array
    if (!Array.isArray(def.states)) {
      throw new Error('DFA must have a states array')
    }

    for (const state of def.states) {
      this.validateState(state)
    }

    // Validate transitions array
    if (!Array.isArray(def.transitions)) {
      throw new Error('DFA must have a transitions array')
    }

    for (const transition of def.transitions) {
      this.validateTransition(transition)
    }

    // Validate alphabet array
    if (!Array.isArray(def.alphabet)) {
      throw new Error('DFA must have an alphabet array')
    }

    if (def.alphabet.length === 0) {
      throw new Error('Alphabet cannot be empty')
    }

    for (const symbol of def.alphabet) {
      if (typeof symbol !== 'string') {
        throw new Error('Alphabet symbols must be strings')
      }
    }

    // Validate metadata
    if (typeof def.metadata !== 'object' || def.metadata === null) {
      throw new Error('DFA must have metadata object')
    }

    const metadata = def.metadata as Record<string, unknown>

    if (typeof metadata.name !== 'string') {
      throw new Error('Metadata must have a name string')
    }

    if (typeof metadata.description !== 'string') {
      throw new Error('Metadata must have a description string')
    }

    if (typeof metadata.createdAt !== 'string') {
      throw new Error('Metadata must have a createdAt string')
    }

    if (typeof metadata.modifiedAt !== 'string') {
      throw new Error('Metadata must have a modifiedAt string')
    }
  }

  /**
   * Validate state object
   */
  private static validateState(state: unknown): void {
    if (typeof state !== 'object' || state === null) {
      throw new Error('State must be an object')
    }

    const s = state as Record<string, unknown>

    if (typeof s.id !== 'string') {
      throw new Error('State must have an id string')
    }

    if (typeof s.label !== 'string') {
      throw new Error('State must have a label string')
    }

    if (
      s.type !== 'normal' &&
      s.type !== 'initial' &&
      s.type !== 'accepting' &&
      s.type !== 'initial-accepting'
    ) {
      throw new Error('State type must be one of: normal, initial, accepting, initial-accepting')
    }

    if (
      typeof s.position !== 'object' ||
      s.position === null ||
      typeof (s.position as Record<string, unknown>).x !== 'number' ||
      typeof (s.position as Record<string, unknown>).y !== 'number'
    ) {
      throw new Error('State must have a position object with x and y numbers')
    }
  }

  /**
   * Validate transition object
   */
  private static validateTransition(transition: unknown): void {
    if (typeof transition !== 'object' || transition === null) {
      throw new Error('Transition must be an object')
    }

    const t = transition as Record<string, unknown>

    if (typeof t.id !== 'string') {
      throw new Error('Transition must have an id string')
    }

    if (typeof t.from !== 'string') {
      throw new Error('Transition must have a from string')
    }

    if (typeof t.to !== 'string') {
      throw new Error('Transition must have a to string')
    }

    if (typeof t.symbol !== 'string') {
      throw new Error('Transition must have a symbol string')
    }
  }

  /**
   * Export DFA to file (browser download)
   */
  static exportToFile(definition: DFADefinition, filename?: string): void {
    const json = this.toJSON(definition)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = filename || `${definition.metadata.name}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    URL.revokeObjectURL(url)
  }

  /**
   * Import DFA from file (browser upload)
   */
  static async importFromFile(file: File): Promise<DFADefinition> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = (e) => {
        try {
          const json = e.target?.result as string
          const definition = this.fromJSON(json)
          resolve(definition)
        } catch (error) {
          reject(error)
        }
      }

      reader.onerror = () => {
        reject(new Error('Failed to read file'))
      }

      reader.readAsText(file)
    })
  }
}
