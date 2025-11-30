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
    setStateLabel(value)
    if (selectedState) {
      dfa.updateState(selectedState.id, { label: value })
    }
  }

  const handleStateTypeChange = (type: StateType) => {
    setStateType(type)
    if (selectedState) {
      dfa.updateState(selectedState.id, { type })
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
        <p className="text-gray-500 text-sm">
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
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo di Stato
              </label>
              <div className="space-y-2">
                <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="stateType"
                    checked={stateType === 'normal'}
                    onChange={() => handleStateTypeChange('normal')}
                    className="mr-3"
                  />
                  <span className="flex-1">Normale</span>
                  <Badge variant="default">N</Badge>
                </label>

                <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="stateType"
                    checked={stateType === 'initial'}
                    onChange={() => handleStateTypeChange('initial')}
                    className="mr-3"
                  />
                  <span className="flex-1">Iniziale</span>
                  <Badge variant="info">I</Badge>
                </label>

                <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="stateType"
                    checked={stateType === 'accepting'}
                    onChange={() => handleStateTypeChange('accepting')}
                    className="mr-3"
                  />
                  <span className="flex-1">Accettante</span>
                  <Badge variant="success">F</Badge>
                </label>

                <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="stateType"
                    checked={stateType === 'initial-accepting'}
                    onChange={() => handleStateTypeChange('initial-accepting')}
                    className="mr-3"
                  />
                  <span className="flex-1">Iniziale e Accettante</span>
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
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              Proprietà Transizione
            </h3>

            {/* From/To States */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Da:</span>
                <Badge>
                  {dfa.getStates().find((s) => s.id === selectedTransition.from)
                    ?.label || selectedTransition.from}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-gray-600">A:</span>
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
              <p className="mt-1 text-xs text-gray-500">
                Deve essere un simbolo dell'alfabeto
              </p>
            </div>
          </div>
        </>
      )}

      {/* Delete Button */}
      <div className="pt-4 border-t border-gray-200">
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
