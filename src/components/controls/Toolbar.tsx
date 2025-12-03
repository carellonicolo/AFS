/**
 * Main Toolbar Component
 */

import { FC, useState } from 'react'
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
import { useConfirm } from '@/hooks/useConfirm'
import { useExecutionStore } from '@/store/executionStore'
import { DFASerializer } from '@/core/dfa/DFASerializer'
import HelpModal from '../modals/HelpModal'

import { useReactFlow, getNodesBounds } from '@xyflow/react'
import { toPng } from 'html-to-image'
import { toast } from 'react-toastify'

const Toolbar: FC = () => {
  const [isHelpOpen, setIsHelpOpen] = useState(false)
  const dfa = useDFA()
  const { confirm } = useConfirm()
  const execution = useExecutionStore()
  const { getNodes } = useReactFlow()

  const handleDownloadImage = async () => {
    const nodes = getNodes()

    if (nodes.length === 0) {
      toast.info('Nessun elemento da esportare.')
      return
    }

    try {
      // Get the React Flow wrapper element
      const reactFlowWrapper = document.querySelector('.react-flow') as HTMLElement

      if (!reactFlowWrapper) {
        toast.error('Impossibile trovare il canvas per l\'esportazione.')
        return
      }

      // Calculate bounds of all nodes with extra padding for edges
      const nodesBounds = getNodesBounds(nodes)

      // Generous padding to ensure curved transitions are captured
      const padding = 100

      // Calculate final dimensions
      const imageWidth = nodesBounds.width + padding * 2
      const imageHeight = nodesBounds.height + padding * 2

      // Calculate the center point
      const centerX = nodesBounds.x + nodesBounds.width / 2
      const centerY = nodesBounds.y + nodesBounds.height / 2

      // Get the viewport element
      const viewportElement = reactFlowWrapper.querySelector('.react-flow__viewport') as HTMLElement

      if (!viewportElement) {
        toast.error('Impossibile trovare il viewport.')
        return
      }

      // Store original transform
      const originalTransform = viewportElement.style.transform

      // Apply transform to center and fit all nodes
      const scale = Math.min(
        imageWidth / (nodesBounds.width + padding * 2),
        imageHeight / (nodesBounds.height + padding * 2)
      )

      viewportElement.style.transform =
        `translate(${imageWidth / 2 - centerX * scale}px, ${imageHeight / 2 - centerY * scale}px) scale(${scale})`

      // Export with high quality settings
      const dataUrl = await toPng(viewportElement, {
        backgroundColor: '#ffffff',
        width: imageWidth,
        height: imageHeight,
        pixelRatio: 3, // Higher resolution (3x)
        quality: 1.0,
        cacheBust: true,
        style: {
          width: `${imageWidth}px`,
          height: `${imageHeight}px`,
        },
      })

      // Restore original transform
      viewportElement.style.transform = originalTransform

      // Download the image
      const link = document.createElement('a')
      link.download = `dfa-export-${Date.now()}.png`
      link.href = dataUrl
      link.click()

      toast.success('Immagine scaricata con successo!')
    } catch (error) {
      console.error('Export failed:', error)
      toast.error('Errore durante l\'esportazione dell\'immagine.')
    }
  }

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

  const handleClear = async () => {
    const confirmed = await confirm({
      title: 'Cancella DFA',
      message: 'Sei sicuro di voler cancellare tutto il DFA? Tutti gli stati e transizioni saranno eliminati. Questa azione non può essere annullata.',
      variant: 'danger',
      confirmLabel: 'Cancella Tutto',
      cancelLabel: 'Annulla'
    })

    if (confirmed) {
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
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-fit">
      <div className="glass-panel px-3 sm:px-4 py-2 flex items-center gap-2 sm:gap-4 overflow-x-auto custom-scrollbar">
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
            onClick={handleDownloadImage}
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
          <Button
            variant="ghost"
            size="md"
            title="Aiuto"
            onClick={() => setIsHelpOpen(true)}
          >
            <HelpCircle className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  )
}

export default Toolbar
