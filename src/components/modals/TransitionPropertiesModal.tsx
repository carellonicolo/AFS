/**
 * Transition Properties Modal - Edit transition symbol and delete
 */

import { FC, useState, useEffect, useRef } from 'react'
import { X, Trash2 } from 'lucide-react'
import { useDFA } from '@/hooks/useDFA'
import Input from '../ui/Input'
import Badge from '../ui/Badge'

interface TransitionPropertiesModalProps {
    transitionId: string
    isOpen: boolean
    onClose: () => void
}

const TransitionPropertiesModal: FC<TransitionPropertiesModalProps> = ({
    transitionId,
    isOpen,
    onClose,
}) => {
    const dfa = useDFA()
    const modalRef = useRef<HTMLDivElement>(null)
    const transition = dfa.getTransitions().find((t) => t.id === transitionId)
    const [symbol, setSymbol] = useState(transition?.symbol || '')

    // Update symbol when transition changes
    useEffect(() => {
        if (transition) {
            setSymbol(transition.symbol)
        }
    }, [transition])

    // Close when clicking outside
    useEffect(() => {
        if (!isOpen) return

        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose()
            }
        }

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

    const handleSymbolChange = (value: string) => {
        // Only allow single character
        const newSymbol = value.slice(0, 1)
        setSymbol(newSymbol)

        if (newSymbol && transition) {
            dfa.updateTransition(transitionId, { symbol: newSymbol })
        }
    }

    const handleDelete = () => {
        dfa.removeTransition(transitionId)
        onClose()
    }

    if (!isOpen || !transition) return null

    const fromState = dfa.getStates().find((s) => s.id === transition.from)
    const toState = dfa.getStates().find((s) => s.id === transition.to)

    return (
        <div
            ref={modalRef}
            className="nodrag nopan w-80 p-4 rounded-2xl glass-panel animate-scale-in cursor-default bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl shadow-2xl border border-white/20 dark:border-white/10"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onWheel={(e) => e.stopPropagation()}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                    Modifica Transizione
                </h3>
                <div className="flex items-center gap-1">
                    <button
                        onClick={handleDelete}
                        className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors"
                        title="Elimina Transizione"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-gray-500 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* From/To States */}
            <div className="mb-4 p-3 bg-gray-50 dark:bg-black/20 rounded-lg border border-gray-200 dark:border-white/10">
                <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-500 dark:text-slate-400 font-medium">Da:</span>
                    <Badge>{fromState?.label || transition.from}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-slate-400 font-medium">A:</span>
                    <Badge>{toState?.label || transition.to}</Badge>
                </div>
            </div>

            {/* Symbol Input */}
            <div className="mb-4">
                <Input
                    label="Simbolo"
                    value={symbol}
                    onChange={(e) => handleSymbolChange(e.target.value)}
                    placeholder="es. 0, 1, a"
                    maxLength={1}
                    className="nodrag"
                    onMouseDown={(e: React.MouseEvent) => e.stopPropagation()}
                    autoFocus
                />
                <p className="mt-1.5 text-xs text-gray-500 dark:text-slate-400">
                    Deve essere un simbolo dell'alfabeto: {'{'}
                    {dfa.getAlphabet().join(', ')}
                    {'}'}
                </p>
            </div>
        </div>
    )
}

export default TransitionPropertiesModal
