import { FC, useState, useEffect, useRef } from 'react'
import { useDFA } from '@/hooks/useDFA'
import { Plus, X } from 'lucide-react'

const HeaderAlphabet: FC = () => {
    const dfa = useDFA()
    const currentAlphabet = dfa.getAlphabet()
    const [alphabet, setAlphabet] = useState<string[]>(currentAlphabet)
    const [isAdding, setIsAdding] = useState(false)
    const [newSymbol, setNewSymbol] = useState('')
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        setAlphabet(currentAlphabet)
    }, [currentAlphabet])

    useEffect(() => {
        if (isAdding && inputRef.current) {
            inputRef.current.focus()
        }
    }, [isAdding])

    const handleAddSymbol = () => {
        if (!newSymbol) {
            setIsAdding(false)
            return
        }

        if (newSymbol.length === 1 && !alphabet.includes(newSymbol)) {
            const updatedAlphabet = [...alphabet, newSymbol]
            setAlphabet(updatedAlphabet)
            try {
                dfa.setAlphabet(updatedAlphabet)
            } catch (err) {
                console.error(err)
                // Revert if failed
                setAlphabet(alphabet)
            }
        }

        setNewSymbol('')
        setIsAdding(false)
    }

    const handleRemoveSymbol = (symbol: string) => {
        // Don't allow removing if it's the last symbol (optional constraint, but safer)
        if (alphabet.length <= 1) return

        const updatedAlphabet = alphabet.filter((s) => s !== symbol)
        setAlphabet(updatedAlphabet)
        try {
            dfa.setAlphabet(updatedAlphabet)
        } catch (err) {
            console.error(err)
            setAlphabet(alphabet)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleAddSymbol()
        } else if (e.key === 'Escape') {
            setIsAdding(false)
            setNewSymbol('')
        }
    }

    return (
        <div className="flex items-center gap-3 px-3 py-1.5 bg-gray-100/50 dark:bg-white/5 rounded-xl border border-gray-200/50 dark:border-white/5">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Alfabeto
            </span>

            <div className="flex items-center gap-1.5">
                {alphabet.map((symbol) => (
                    <div
                        key={symbol}
                        className="group relative flex items-center justify-center w-6 h-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm transition-all hover:scale-110 hover:border-red-200 dark:hover:border-red-900"
                    >
                        <span className="text-xs font-bold text-gray-700 dark:text-gray-200 group-hover:opacity-0 transition-opacity">
                            {symbol}
                        </span>
                        <button
                            onClick={() => handleRemoveSymbol(symbol)}
                            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 text-red-500 transition-opacity"
                            title="Rimuovi"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                ))}

                {isAdding ? (
                    <div className="w-6 h-6 relative">
                        <input
                            ref={inputRef}
                            type="text"
                            value={newSymbol}
                            onChange={(e) => setNewSymbol(e.target.value.slice(0, 1))}
                            onKeyDown={handleKeyDown}
                            onBlur={handleAddSymbol}
                            className="w-full h-full text-center bg-white dark:bg-gray-800 rounded-lg border-2 border-primary-500 text-xs font-bold outline-none"
                            maxLength={1}
                        />
                    </div>
                ) : (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="flex items-center justify-center w-6 h-6 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg border border-primary-200 dark:border-primary-800/50 hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors"
                        title="Aggiungi simbolo"
                    >
                        <Plus className="w-3 h-3" />
                    </button>
                )}
            </div>
        </div>
    )
}

export default HeaderAlphabet
