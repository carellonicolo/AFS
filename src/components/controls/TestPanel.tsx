/**
 * Test Panel - Test DFA with input strings
 */

import { FC, useState } from 'react'
import { useExecution } from '@/hooks/useExecution'
import { useDFA } from '@/hooks/useDFA'
import Input from '../ui/Input'
import Button from '../ui/Button'
import Badge from '../ui/Badge'
import { Play, StepForward, SkipBack, SkipForward, RotateCcw, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

const TestPanel: FC = () => {
  const execution = useExecution()
  const dfa = useDFA()
  const [inputString, setInputString] = useState('')
  const [inputError, setInputError] = useState('')

  const validateInput = (input: string): boolean => {
    const alphabet = dfa.getAlphabet()

    for (const char of input) {
      if (!alphabet.includes(char)) {
        setInputError(`Simbolo '${char}' non nell'alfabeto {${alphabet.join(', ')}}`)
        return false
      }
    }

    setInputError('')
    return true
  }

  const handleRun = () => {
    if (!validateInput(inputString)) return

    const validationResult = dfa.validate()
    if (!validationResult.isValid) {
      setInputError('Il DFA non è valido. Controlla gli errori.')
      return
    }

    execution.run(inputString)
  }

  const handleStepByStep = () => {
    if (!validateInput(inputString)) return

    const validationResult = dfa.validate()
    if (!validationResult.isValid) {
      setInputError('Il DFA non è valido.')
      return
    }

    execution.runStepByStep(inputString)
  }

  const handleInputChange = (value: string) => {
    setInputString(value)
    setInputError('')
  }

  const currentStep = execution.getCurrentStep()
  const result = execution.executionResult

  return (
    <div className="p-4 space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">
          Testa il DFA
        </h3>

        {/* Input String */}
        <div className="mb-4">
          <Input
            label="Stringa di input"
            value={inputString}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="es. 0110, 101"
            error={inputError}
            disabled={execution.isExecuting}
          />
          <p className="mt-1 text-xs text-gray-500">
            Alfabeto: {'{'}
            {dfa.getAlphabet().join(', ')}
            {'}'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="primary"
            size="md"
            onClick={handleRun}
            disabled={!inputString || execution.isExecuting}
            className="flex-1"
          >
            <Play className="w-4 h-4 mr-2" />
            Esegui
          </Button>

          <Button
            variant="secondary"
            size="md"
            onClick={handleStepByStep}
            disabled={!inputString || execution.isExecuting}
            title="Esecuzione passo-passo"
          >
            <StepForward className="w-4 h-4" />
          </Button>
        </div>

        {/* Execution Result */}
        {result && (
          <div className="mt-4 p-4 rounded-lg border-2" style={{
            backgroundColor: result.accepted ? '#f0fdf4' : result.error ? '#fef2f2' : '#fafafa',
            borderColor: result.accepted ? '#10b981' : result.error ? '#ef4444' : '#d1d5db'
          }}>
            <div className="flex items-center gap-2 mb-2">
              {result.accepted ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : result.error ? (
                <XCircle className="w-5 h-5 text-red-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-gray-600" />
              )}
              <span className="font-semibold text-gray-900">
                {result.accepted ? 'Accettato' : result.error ? 'Errore' : 'Rifiutato'}
              </span>
            </div>

            {result.error && (
              <p className="text-sm text-red-700">{result.error}</p>
            )}

            {!result.error && currentStep && (
              <div className="text-sm text-gray-700 space-y-1">
                <div>
                  <span className="font-medium">Passo:</span>{' '}
                  {currentStep.stepNumber} / {result.steps.length - 1}
                </div>
                <div>
                  <span className="font-medium">Stato corrente:</span>{' '}
                  <Badge>
                    {dfa.getStates().find(s => s.id === currentStep.currentState)?.label || currentStep.currentState}
                  </Badge>
                </div>
                {currentStep.consumedSymbol && (
                  <div>
                    <span className="font-medium">Simbolo letto:</span>{' '}
                    <Badge variant="info">{currentStep.consumedSymbol}</Badge>
                  </div>
                )}
                <div>
                  <span className="font-medium">Rimane:</span>{' '}
                  <code className="px-2 py-1 bg-gray-100 rounded font-mono text-xs">
                    {currentStep.remainingInput || '(vuoto)'}
                  </code>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step Controls */}
        {result && !result.error && (
          <div className="mt-4">
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => execution.goToStart()}
                disabled={execution.isAtStart()}
                title="Vai all'inizio"
              >
                <SkipBack className="w-4 h-4" />
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => execution.stepBackward()}
                disabled={execution.isAtStart() || execution.isExecuting}
                title="Passo indietro"
              >
                <StepForward className="w-4 h-4 transform rotate-180" />
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  if (execution.isExecuting && !execution.isPaused) {
                    execution.pauseExecution()
                  } else if (execution.isPaused) {
                    execution.resumeExecution()
                  }
                }}
                disabled={!execution.isExecuting && !execution.isPaused}
                className="flex-1"
                title={execution.isPaused ? 'Riprendi' : 'Pausa'}
              >
                <Play className="w-4 h-4" />
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => execution.stepForward()}
                disabled={execution.isAtEnd() || execution.isExecuting}
                title="Passo avanti"
              >
                <StepForward className="w-4 h-4" />
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => execution.goToEnd()}
                disabled={execution.isAtEnd()}
                title="Vai alla fine"
              >
                <SkipForward className="w-4 h-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => execution.reset()}
                title="Reset"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>

            {/* Speed Control */}
            <div className="mt-3">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Velocità: {execution.speed}ms
              </label>
              <input
                type="range"
                min="100"
                max="2000"
                step="100"
                value={execution.speed}
                onChange={(e) => execution.setSpeed(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Veloce</span>
                <span>Lento</span>
              </div>
            </div>
          </div>
        )}

        {/* Validation Errors */}
        {dfa.validationResult && !dfa.validationResult.isValid && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-700">
                <p className="font-semibold mb-1">Errori di validazione:</p>
                <ul className="list-disc list-inside space-y-1">
                  {dfa.validationResult.errors.map((error, i) => (
                    <li key={i}>{error.message}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TestPanel
