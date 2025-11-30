/**
 * Alphabet Panel - Manage DFA alphabet
 */

import { FC, useState, useEffect } from 'react'
import { useDFA } from '@/hooks/useDFA'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { Plus, X } from 'lucide-react'

const AlphabetPanel: FC = () => {
  const dfa = useDFA()
  const currentAlphabet = dfa.getAlphabet()
  const [alphabet, setAlphabet] = useState<string[]>(currentAlphabet)
  const [newSymbol, setNewSymbol] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    setAlphabet(currentAlphabet)
  }, [currentAlphabet.join(',')]) // Use string representation to avoid infinite loop

  const handleAddSymbol = () => {
    setError('')

    if (!newSymbol) {
      setError('Inserisci un simbolo')
      return
    }

    if (newSymbol.length !== 1) {
      setError('Il simbolo deve essere un singolo carattere')
      return
    }

    if (alphabet.includes(newSymbol)) {
      setError('Simbolo già presente nell\'alfabeto')
      return
    }

    const updatedAlphabet = [...alphabet, newSymbol]
    setAlphabet(updatedAlphabet)

    try {
      dfa.setAlphabet(updatedAlphabet)
      setNewSymbol('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore')
    }
  }

  const handleRemoveSymbol = (symbol: string) => {
    const updatedAlphabet = alphabet.filter((s) => s !== symbol)
    setAlphabet(updatedAlphabet)

    try {
      dfa.setAlphabet(updatedAlphabet)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore')
      // Revert on error
      setAlphabet(alphabet)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddSymbol()
    }
  }

  return (
    <div className="p-4 space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">
          Alfabeto
        </h3>

        {/* Current Alphabet */}
        <div className="flex flex-wrap gap-2 mb-4">
          {alphabet.map((symbol) => (
            <div
              key={symbol}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary-100 text-primary-800 rounded-full"
            >
              <span className="font-mono font-semibold">{symbol}</span>
              <button
                onClick={() => handleRemoveSymbol(symbol)}
                className="ml-1 hover:bg-primary-200 rounded-full p-0.5"
                title="Rimuovi simbolo"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

        {/* Add New Symbol */}
        <div className="flex gap-2">
          <Input
            value={newSymbol}
            onChange={(e) => setNewSymbol(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Nuovo simbolo"
            maxLength={1}
            error={error}
          />
          <Button
            variant="primary"
            size="md"
            onClick={handleAddSymbol}
            title="Aggiungi simbolo"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <p className="mt-2 text-xs text-gray-500">
          Premi Invio o clicca + per aggiungere un simbolo
        </p>
      </div>
    </div>
  )
}

export default AlphabetPanel
