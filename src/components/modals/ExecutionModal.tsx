/**
 * Execution Modal - Test DFA with input strings from the toolbar
 */

import { FC, useState, useEffect, useRef } from 'react'
import { useExecution } from '@/hooks/useExecution'
import { useDFA } from '@/hooks/useDFA'
import Input from '../ui/Input'
import Button from '../ui/Button'
import Badge from '../ui/Badge'
import {
    X,
    Play,
    Pause,
    StepForward,
    SkipBack,
    SkipForward,
    RotateCcw,
    CheckCircle,
    XCircle,
    AlertCircle,
} from 'lucide-react'

interface ExecutionModalProps {
    isOpen: boolean
    onClose: () => void
}

const ExecutionModal: FC<ExecutionModalProps> = ({ isOpen, onClose }) => {
    const execution = useExecution()
    const dfa = useDFA()
    const [inputString, setInputString] = useState('')
    const [inputError, setInputError] = useState('')
    const modalRef = useRef<HTMLDivElement>(null)

    // Close when clicking outside
    useEffect(() => {
        if (!isOpen) return

        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose()
            }
        }

        // Add event listener with a small delay
        const timeoutId = setTimeout(() => {
            document.addEventListener('mousedown', handleClickOutside)
        }, 100)

        return () => {
            clearTimeout(timeoutId)
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen, onClose])

    // Handle ESC key
    useEffect(() => {
        if (!isOpen) return

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose()
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [isOpen, onClose])

    const validateInput = (input: string): boolean => {
        if (!input) {
            setInputError('Inserisci una stringa di input')
            return false
        }

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

        dfa.clearSelection()
        execution.run(inputString)
    }

    const handleStepByStep = () => {
        if (!validateInput(inputString)) return

        const validationResult = dfa.validate()
        if (!validationResult.isValid) {
            setInputError('Il DFA non è valido.')
            return
        }

        dfa.clearSelection()
        execution.runStepByStep(inputString)
    }

    const handleInputChange = (value: string) => {
        setInputString(value)
        setInputError('')
    }

    const currentStep = execution.getCurrentStep()
    const result = execution.executionResult

    if (!isOpen) return null

    return (
        <div
            ref={modalRef}
            className="nodrag nopan w-96 p-4 rounded-2xl glass-panel animate-scale-in cursor-default bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl shadow-2xl border border-white/20 dark:border-white/10"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onWheel={(e) => e.stopPropagation()}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                    Esegui DFA
                </h3>
                <button
                    onClick={onClose}
                    className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-gray-500 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Input Section */}
            {!result && (
                <div className="space-y-3">
                    <Input
                        label="Stringa di input"
                        value={inputString}
                        onChange={(e) => handleInputChange(e.target.value)}
                        placeholder="es. 0110, 101"
                        error={inputError}
                        disabled={execution.isExecuting}
                        className="nodrag"
                        onMouseDown={(e: React.MouseEvent) => e.stopPropagation()}
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Alfabeto: {'{'}
                        {dfa.getAlphabet().join(', ')}
                        {'}'}
                    </p>

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
                </div>
            )}

            {/* Execution Display */}
            {result && (
                <div className="space-y-3">
                    {/* Result Badge */}
                    <div
                        className={`p-3 rounded-lg border-2 ${result.accepted
                            ? 'bg-green-50 border-green-500 dark:bg-green-950 dark:border-green-600'
                            : result.error
                                ? 'bg-red-50 border-red-500 dark:bg-red-950 dark:border-red-600'
                                : 'bg-red-50 border-red-500 dark:bg-red-950 dark:border-red-600'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            {result.accepted ? (
                                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                            ) : result.error ? (
                                <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                            ) : (
                                <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                            )}
                            <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                                {result.accepted ? 'Accettato' : result.error ? 'Errore' : 'Rifiutato'}
                            </span>
                        </div>

                        {result.error && (
                            <p className="text-xs text-red-700 dark:text-red-300 mt-1">{result.error}</p>
                        )}
                    </div>

                    {/* Reset button for errors */}
                    {result.error && (
                        <Button
                            variant="primary"
                            size="md"
                            onClick={() => execution.reset()}
                            className="w-full"
                        >
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Riprova
                        </Button>
                    )}

                    {/* Current Step Info */}
                    {!result.error && currentStep && (
                        <div className="p-3 bg-gray-50 dark:bg-black/20 rounded-lg border border-gray-200 dark:border-white/10 space-y-2">
                            <div className="text-xs text-gray-700 dark:text-gray-300">
                                <span className="font-medium">Passo:</span>{' '}
                                {currentStep.stepNumber} / {result.steps.length - 1}
                            </div>
                            <div className="text-xs text-gray-700 dark:text-gray-300">
                                <span className="font-medium">Stato corrente:</span>{' '}
                                <Badge>
                                    {dfa.getStates().find((s) => s.id === currentStep.currentState)?.label ||
                                        currentStep.currentState}
                                </Badge>
                            </div>
                            {currentStep.consumedSymbol && (
                                <div className="text-xs text-gray-700 dark:text-gray-300">
                                    <span className="font-medium">Simbolo letto:</span>{' '}
                                    <Badge variant="info">{currentStep.consumedSymbol}</Badge>
                                </div>
                            )}
                            <div className="text-xs text-gray-700 dark:text-gray-300">
                                <span className="font-medium">Rimane:</span>{' '}
                                <code className="px-2 py-0.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded font-mono text-xs">
                                    {currentStep.remainingInput || '(vuoto)'}
                                </code>
                            </div>
                        </div>
                    )}

                    {/* Control Buttons */}
                    {!result.error && (
                        <div className="flex items-center gap-1.5">
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
                                {execution.isPaused || !execution.isExecuting ? (
                                    <Play className="w-4 h-4" />
                                ) : (
                                    <Pause className="w-4 h-4" />
                                )}
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
                    )}

                    {/* Speed Control */}
                    {!result.error && (
                        <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                Velocità: {execution.speed}ms
                            </label>
                            <input
                                type="range"
                                min="100"
                                max="2000"
                                step="100"
                                value={execution.speed}
                                onChange={(e) => execution.setSpeed(Number(e.target.value))}
                                className="nodrag w-full"
                                onMouseDown={(e) => e.stopPropagation()}
                            />
                            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                <span>Veloce</span>
                                <span>Lento</span>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Validation Errors */}
            {dfa.validationResult && !dfa.validationResult.isValid && (
                <div className="mt-3 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                        <div className="text-xs text-red-700 dark:text-red-300">
                            <p className="font-semibold mb-1">Errori di validazione:</p>
                            <ul className="list-disc list-inside space-y-0.5">
                                {dfa.validationResult.errors.map((error, i) => (
                                    <li key={i}>{error.message}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ExecutionModal
