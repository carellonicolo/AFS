/**
 * Main Toolbar Component
 */

import { FC } from 'react'
import {
  Plus,
  Play,
  Pause,
  RotateCcw,
  Save,
  FolderOpen,
  Download,
  Trash2,
  HelpCircle,
} from 'lucide-react'
import Button from '../ui/Button'
import ThemeToggle from '../ui/ThemeToggle'
import { useDFA } from '@/hooks/useDFA'
import { useExecutionStore } from '@/store/executionStore'
import { DFASerializer } from '@/core/dfa/DFASerializer'

const Toolbar: FC = () => {
  const dfa = useDFA()
  const execution = useExecutionStore()
  const handleAddState = () => {
    try {
      // Will create a basic state at center with some randomness to avoid overlap
      const randomOffset = Math.random() * 50 - 25
      dfa.createState({
        x: 300 + randomOffset,
        y: 200 + randomOffset
      }, 'normal')
    } catch (error) {
      console.error('Failed to add state:', error)
    }
  }

  const handleClear = () => {
    if (confirm('Sei sicuro di voler cancellare tutto il DFA?')) {
      dfa.clearDFA()
    }
  }

  const handleSave = () => {
    const definition = dfa.getDefinition()
    DFASerializer.exportToFile(definition)
  }

  const handleLoad = async () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        try {
          const definition = await DFASerializer.importFromFile(file)
          dfa.loadDFA(definition)
        } catch (error) {
          alert('Errore nel caricamento del file: ' + error)
        }
      }
    }
    input.click()
  }

  const handleToggleExecution = () => {
    if (execution.isExecuting && !execution.isPaused) {
      execution.pauseExecution()
    } else if (execution.isPaused) {
      execution.resumeExecution()
    }
  }

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40">
      <div className="glass-panel px-4 py-2 flex items-center gap-4">
        {/* State Management */}
        <div className="flex items-center gap-2 pr-4 border-r border-gray-200 dark:border-white/10">
          <Button
            variant="primary"
            size="md"
            onClick={handleAddState}
            title="Aggiungi stato (Clicca sul canvas)"
            className="shadow-lg shadow-primary-500/20"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuovo Stato
          </Button>

          <Button
            variant="danger"
            size="md"
            onClick={handleClear}
            disabled={dfa.getStates().length === 0}
            title="Cancella tutto"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        {/* File Operations */}
        <div className="flex items-center gap-2 pr-4 border-r border-gray-200 dark:border-white/10">
          <Button
            variant="secondary"
            size="md"
            onClick={handleSave}
            disabled={dfa.getStates().length === 0}
            title="Salva DFA (Ctrl+S)"
          >
            <Save className="w-4 h-4" />
          </Button>

          <Button
            variant="secondary"
            size="md"
            onClick={handleLoad}
            title="Carica DFA"
          >
            <FolderOpen className="w-4 h-4" />
          </Button>

          <Button
            variant="secondary"
            size="md"
            disabled={dfa.getStates().length === 0}
            title="Esporta come immagine"
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>

        {/* Execution Controls */}
        {execution.executionResult && (
          <div className="flex items-center gap-2 pr-4 border-r border-gray-200 dark:border-white/10">
            <Button
              variant="primary"
              size="md"
              onClick={handleToggleExecution}
              title={execution.isPaused ? 'Riprendi (Spazio)' : 'Pausa (Spazio)'}
              className="shadow-lg shadow-primary-500/20"
            >
              {execution.isPaused || !execution.isExecuting ? (
                <Play className="w-4 h-4" />
              ) : (
                <Pause className="w-4 h-4" />
              )}
            </Button>

            <Button
              variant="secondary"
              size="md"
              onClick={() => execution.reset()}
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Help & Theme */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="md" title="Aiuto">
            <HelpCircle className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Toolbar
