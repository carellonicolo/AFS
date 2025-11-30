/**
 * Properties Panel - Edit selected state/transition properties
 */

import { FC, useState, useEffect } from 'react'
import { useDFA } from '@/hooks/useDFA'
import Input from '../ui/Input'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import { Trash2 } from 'lucide-react'
import type { StateType } from '@/types'

const PropertiesPanel: FC = () => {
  const dfa = useDFA()
  const selectedState = dfa.selectedNodeId
    ? dfa.getStates().find((s) => s.id === dfa.selectedNodeId)
    : null
  const selectedTransition = dfa.selectedEdgeId
    ? dfa.getTransitions().find((t) => t.id === dfa.selectedEdgeId)
    : null

  const [stateLabel, setStateLabel] = useState('')
  const [stateType, setStateType] = useState<StateType>('normal')
  const [transitionSymbol, setTransitionSymbol] = useState('')

  // Update local state when selection changes
  useEffect(() => {
    if (selectedState) {
      setStateLabel(selectedState.label)
      setStateType(selectedState.type)
    }
  }, [selectedState])

  useEffect(() => {
    if (selectedTransition) {
      setTransitionSymbol(selectedTransition.symbol)
    }
  }, [selectedTransition])

  const handleStateLabelChange = (value: string) => {
    // Limit label length
    const sanitizedValue = value.slice(0, 20)
    setStateLabel(sanitizedValue)
    if (selectedState) {
      try {
        dfa.updateState(selectedState.id, { label: sanitizedValue })
      } catch (error) {
        console.error('Failed to update state label:', error)
      }
    }
  }

  const handleStateTypeChange = (type: StateType) => {
    setStateType(type)
    if (selectedState) {
      try {
        dfa.updateState(selectedState.id, { type })
      } catch (error) {
        console.error('Failed to update state type:', error)
      }
    }
  }

  const handleTransitionSymbolChange = (value: string) => {
    setTransitionSymbol(value)
    if (selectedTransition && value.length === 1) {
      try {
        dfa.updateTransition(selectedTransition.id, { symbol: value })
      } catch (error) {
        console.error('Failed to update transition:', error)
      }
    }
  }

  const handleDelete = () => {
    if (selectedState) {
      if (confirm(`Eliminare lo stato "${selectedState.label}"?`)) {
        dfa.removeState(selectedState.id)
      }
    } else if (selectedTransition) {
      dfa.removeTransition(selectedTransition.id)
    }
  }

  if (!selectedState && !selectedTransition) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Seleziona uno stato o una transizione per modificarne le proprietà
        </p>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-6">
      {selectedState && (
        <>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wider opacity-80">
              Proprietà Stato
            </h3>

            {/* State Label */}
            <div className="mb-4">
              <Input
                label="Etichetta"
                value={stateLabel}
                onChange={(e) => handleStateLabelChange(e.target.value)}
                placeholder="es. S0, Start, A"
              />
            </div>

            {/* State Type */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-2 uppercase tracking-wider">
                Tipo di Stato
              </label>
              <div className="space-y-2">
                <label className="flex items-center p-3 border border-gray-200 dark:border-white/5 rounded-xl cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                  <input
                    type="radio"
                    name="stateType"
                    checked={stateType === 'normal'}
                    onChange={() => handleStateTypeChange('normal')}
                    className="mr-3 text-primary-500 focus:ring-primary-500 bg-gray-100 dark:bg-black/20 border-gray-300 dark:border-white/10"
                  />
                  <span className="flex-1 text-gray-700 dark:text-slate-200 text-sm">Normale</span>
                  <Badge variant="default">N</Badge>
                </label>

                <label className="flex items-center p-3 border border-gray-200 dark:border-white/5 rounded-xl cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                  <input
                    type="radio"
                    name="stateType"
                    checked={stateType === 'initial'}
                    onChange={() => handleStateTypeChange('initial')}
                    className="mr-3 text-primary-500 focus:ring-primary-500 bg-gray-100 dark:bg-black/20 border-gray-300 dark:border-white/10"
                  />
                  <span className="flex-1 text-gray-700 dark:text-slate-200 text-sm">Iniziale</span>
                  <Badge variant="info">I</Badge>
                </label>

                <label className="flex items-center p-3 border border-gray-200 dark:border-white/5 rounded-xl cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                  <input
                    type="radio"
                    name="stateType"
                    checked={stateType === 'accepting'}
                    onChange={() => handleStateTypeChange('accepting')}
                    className="mr-3 text-primary-500 focus:ring-primary-500 bg-gray-100 dark:bg-black/20 border-gray-300 dark:border-white/10"
                  />
                  <span className="flex-1 text-gray-700 dark:text-slate-200 text-sm">Accettante</span>
                  <Badge variant="success">F</Badge>
                </label>

                <label className="flex items-center p-3 border border-gray-200 dark:border-white/5 rounded-xl cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                  <input
                    type="radio"
                    name="stateType"
                    checked={stateType === 'initial-accepting'}
                    onChange={() => handleStateTypeChange('initial-accepting')}
                    className="mr-3 text-primary-500 focus:ring-primary-500 bg-gray-100 dark:bg-black/20 border-gray-300 dark:border-white/10"
                  />
                  <span className="flex-1 text-gray-700 dark:text-slate-200 text-sm">Iniziale e Accettante</span>
                  <Badge variant="warning">I+F</Badge>
                </label>
              </div>
            </div>
          </div>
        </>
      )}

      {selectedTransition && (
        <>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wider opacity-80">
              Proprietà Transizione
            </h3>

            {/* From/To States */}
            <div className="mb-4 p-3 bg-gray-100 dark:bg-black/20 border border-gray-200 dark:border-white/5 rounded-xl">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-slate-400">Da:</span>
                <Badge>
                  {dfa.getStates().find((s) => s.id === selectedTransition.from)
                    ?.label || selectedTransition.from}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-gray-500 dark:text-slate-400">A:</span>
                <Badge>
                  {dfa.getStates().find((s) => s.id === selectedTransition.to)
                    ?.label || selectedTransition.to}
                </Badge>
              </div>
            </div>

            {/* Transition Symbol */}
            <div className="mb-4">
              <Input
                label="Simbolo"
                value={transitionSymbol}
                onChange={(e) => handleTransitionSymbolChange(e.target.value)}
                placeholder="es. 0, 1, a"
                maxLength={1}
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-slate-500">
                Deve essere un simbolo dell'alfabeto
              </p>
            </div>
          </div>
        </>
      )}

      {/* Delete Button */}
      <div className="pt-4 border-t border-gray-200 dark:border-white/10">
        <Button
          variant="danger"
          size="md"
          onClick={handleDelete}
          className="w-full"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Elimina
        </Button>
      </div>
    </div>
  )
}

export default PropertiesPanel
