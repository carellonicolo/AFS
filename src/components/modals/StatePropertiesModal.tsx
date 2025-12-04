import { FC, useState, useEffect, useRef } from 'react'
import { X, Trash2 } from 'lucide-react'
import { StateType } from '@/types'
import Badge from '../ui/Badge'

interface StatePropertiesModalProps {
    initialLabel: string
    initialType: StateType
    onSave: (label: string, type: StateType) => void
    onDelete: () => void
    onClose: () => void
}

const StatePropertiesModal: FC<StatePropertiesModalProps> = ({
    initialLabel,
    initialType,
    onSave,
    onDelete,
    onClose,
}) => {
    const [label, setLabel] = useState(initialLabel)
    const [type, setType] = useState<StateType>(initialType)
    const modalRef = useRef<HTMLDivElement>(null)

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose()
            }
        }

        // Add event listener with a small delay to prevent immediate closing if the click that opened it propagates
        const timeoutId = setTimeout(() => {
            document.addEventListener('mousedown', handleClickOutside)
        }, 100)

        return () => {
            clearTimeout(timeoutId)
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [onClose])

    const handleTypeChange = (newType: StateType) => {
        setType(newType)
        onSave(label, newType)
    }

    const handleLabelBlur = () => {
        if (label !== initialLabel) {
            onSave(label, type)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleLabelBlur()
            onClose()
        } else if (e.key === 'Escape') {
            onClose()
        }
    }

    return (
        <div
            ref={modalRef}
            className="nodrag nopan w-72 p-4 rounded-2xl glass-panel animate-scale-in cursor-default bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl shadow-2xl border border-white/20 dark:border-white/10"
            onKeyDown={handleKeyDown}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => {
                e.stopPropagation()
            }}
            onWheel={(e) => e.stopPropagation()} // Stop zoom propagation
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                    Modifica Stato
                </h3>
                <div className="flex items-center gap-1">
                    <button
                        onClick={onDelete}
                        className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors"
                        title="Elimina Stato"
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

            {/* Label Input */}
            <div className="mb-4">
                <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                    Etichetta
                </label>
                <input
                    type="text"
                    value={label}
                    onChange={(e) => {
                        const newLabel = e.target.value
                        setLabel(newLabel)
                        onSave(newLabel, type)
                    }}
                    onMouseDown={(e) => e.stopPropagation()} // Double check for input
                    className="nodrag w-full px-3 py-2 rounded-xl bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none text-sm text-gray-900 dark:text-white transition-all placeholder:text-gray-400 cursor-text"
                    placeholder="Nome stato"
                    autoFocus
                />
            </div>

            {/* Type Selection */}
            <div className="mb-1">
                <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                    Tipo
                </label>
                <div className="grid grid-cols-2 gap-2">
                    {[
                        { value: 'normal', label: 'Normale', badge: 'N', badgeVariant: 'default' },
                        { value: 'initial', label: 'Iniziale', badge: 'I', badgeVariant: 'info' },
                        { value: 'accepting', label: 'Finale', badge: 'F', badgeVariant: 'success' },
                        { value: 'initial-accepting', label: 'Iniz+Fin', badge: 'I+F', badgeVariant: 'warning' },
                    ].map((option) => (
                        <button
                            key={option.value}
                            onClick={() => handleTypeChange(option.value as StateType)}
                            className={`
                flex items-center justify-between px-2 py-2 rounded-lg border text-xs transition-all
                ${type === option.value
                                    ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-500 text-primary-700 dark:text-primary-300'
                                    : 'bg-transparent border-gray-200 dark:border-white/10 text-gray-600 dark:text-slate-400 hover:border-gray-300 dark:hover:border-white/20'
                                }
              `}
                        >
                            <span>{option.label}</span>
                            {/* @ts-ignore */}
                            <Badge variant={option.badgeVariant} size="sm">{option.badge}</Badge>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default StatePropertiesModal
