import { FC, useEffect, useRef } from 'react'
import { clsx } from 'clsx'

interface TransitionSymbolSelectorProps {
    currentSymbol: string
    alphabet: string[]
    usedSymbols: string[]
    onSelect: (symbol: string) => void
    onClose: () => void
}

const TransitionSymbolSelector: FC<TransitionSymbolSelectorProps> = ({
    currentSymbol,
    alphabet,
    usedSymbols,
    onSelect,
    onClose,
}) => {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                onClose()
            }
        }

        document.addEventListener('mousedown', handleClickOutside, true)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside, true)
        }
    }, [onClose])

    return (
        <div
            ref={ref}
            className={clsx(
                'absolute z-50 min-w-[60px] max-h-[200px] overflow-y-auto',
                'bg-white dark:bg-gray-800 rounded-md shadow-lg',
                'border border-gray-200 dark:border-gray-700',
                'flex flex-col py-1'
            )}
            style={{
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
            }}
            onClick={(e) => e.stopPropagation()}
        >
            {alphabet.map((symbol) => {
                const isUsed = usedSymbols.includes(symbol) && symbol !== currentSymbol
                const isSelected = symbol === currentSymbol

                return (
                    <button
                        key={symbol}
                        disabled={isUsed}
                        onClick={() => onSelect(symbol)}
                        className={clsx(
                            'px-3 py-1.5 text-sm font-medium text-left transition-colors',
                            isSelected && 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400',
                            !isUsed && !isSelected && 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100',
                            isUsed && 'opacity-50 cursor-not-allowed text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800/50'
                        )}
                        title={isUsed ? 'Simbolo già utilizzato per un\'altra transizione da questo stato' : ''}
                    >
                        {symbol}
                    </button>
                )
            })}
        </div>
    )
}

export default TransitionSymbolSelector
