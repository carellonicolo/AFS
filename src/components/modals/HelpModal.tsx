import { FC, useState } from 'react'
import Modal from '../ui/Modal'
import { BookOpen, MousePointer2, Play, Settings, Info } from 'lucide-react'
import { clsx } from 'clsx'

interface HelpModalProps {
    isOpen: boolean
    onClose: () => void
}

const HelpModal: FC<HelpModalProps> = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState<'guide' | 'theory'>('guide')

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Guida e Documentazione"
            maxWidth="2xl"
            className="h-[80vh]"
        >
            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
                <button
                    className={clsx(
                        'flex items-center gap-2 px-4 py-2 border-b-2 font-medium text-sm transition-colors',
                        activeTab === 'guide'
                            ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                            : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                    )}
                    onClick={() => setActiveTab('guide')}
                >
                    <MousePointer2 className="w-4 h-4" />
                    Guida all'Uso
                </button>
                <button
                    className={clsx(
                        'flex items-center gap-2 px-4 py-2 border-b-2 font-medium text-sm transition-colors',
                        activeTab === 'theory'
                            ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                            : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                    )}
                    onClick={() => setActiveTab('theory')}
                >
                    <BookOpen className="w-4 h-4" />
                    Teoria Automi
                </button>
            </div>

            {/* Content */}
            <div className="prose dark:prose-invert max-w-none">
                {activeTab === 'guide' ? (
                    <div className="space-y-8">
                        <section>
                            <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
                                <Settings className="w-5 h-5 text-primary-500" />
                                Creazione del Grafo
                            </h3>
                            <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
                                <li>
                                    <strong>Aggiungi Stato:</strong> Clicca il pulsante <span className="inline-flex items-center justify-center px-2 py-0.5 bg-primary-100 dark:bg-primary-900/50 rounded text-xs font-bold text-primary-700 dark:text-primary-300">+ Nuovo Stato</span> nella toolbar in basso.
                                </li>
                                <li>
                                    <strong>Crea Transizione:</strong> Trascina da una maniglia (pallino colorato) di uno stato verso un altro stato.
                                </li>
                                <li>
                                    <strong>Modifica Transizione:</strong> Clicca su una transizione per selezionarla. Usa le due maniglie bianche per modellare la curva a tuo piacimento.
                                </li>
                                <li>
                                    <strong>Stato Iniziale/Finale:</strong> Seleziona uno stato e usa il pannello delle proprietà a destra per impostarlo come Iniziale o Accettante.
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
                                <Play className="w-5 h-5 text-green-500" />
                                Simulazione
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-3">
                                Puoi testare il tuo automa in tempo reale:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
                                <li>
                                    Apri il pannello <strong>Test</strong> dalla sidebar destra.
                                </li>
                                <li>
                                    Inserisci una stringa di input e premi <strong>Avvia</strong>.
                                </li>
                                <li>
                                    Usa i controlli Play/Pausa nella toolbar per seguire l'esecuzione passo dopo passo.
                                </li>
                                <li>
                                    Gli stati attivi si illumineranno durante l'esecuzione.
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
                                <Info className="w-5 h-5 text-blue-500" />
                                Scorciatoie da Tastiera
                            </h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                                    <span className="font-mono font-bold">Canc / Backspace</span>
                                    <p className="text-gray-500 dark:text-gray-400 mt-1">Elimina elemento selezionato</p>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                                    <span className="font-mono font-bold">Ctrl + S</span>
                                    <p className="text-gray-500 dark:text-gray-400 mt-1">Salva progetto</p>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                                    <span className="font-mono font-bold">Spazio</span>
                                    <p className="text-gray-500 dark:text-gray-400 mt-1">Play / Pausa simulazione</p>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                                    <span className="font-mono font-bold">Esc</span>
                                    <p className="text-gray-500 dark:text-gray-400 mt-1">Deseleziona tutto / Chiudi modali</p>
                                </div>
                            </div>
                        </section>
                    </div>
                ) : (
                    <div className="space-y-8">
                        <section>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                Automa a Stati Finiti Deterministico (DFA)
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                Un <strong>DFA</strong> è un modello matematico di calcolo. È una macchina astratta che può trovarsi in esattamente uno di un numero finito di stati in ogni momento.
                            </p>
                        </section>

                        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-800/30">
                            <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-3">Definizione Formale</h4>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                Un DFA è definito come una quintupla <strong>M = (Q, Σ, δ, q₀, F)</strong> dove:
                            </p>
                            <ul className="space-y-2 text-sm">
                                <li className="flex gap-3">
                                    <span className="font-mono font-bold text-blue-600 dark:text-blue-400 w-6">Q</span>
                                    <span className="text-gray-600 dark:text-gray-300">Insieme finito di stati</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="font-mono font-bold text-blue-600 dark:text-blue-400 w-6">Σ</span>
                                    <span className="text-gray-600 dark:text-gray-300">Alfabeto finito di simboli di input</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="font-mono font-bold text-blue-600 dark:text-blue-400 w-6">δ</span>
                                    <span className="text-gray-600 dark:text-gray-300">Funzione di transizione δ: Q × Σ → Q</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="font-mono font-bold text-blue-600 dark:text-blue-400 w-6">q₀</span>
                                    <span className="text-gray-600 dark:text-gray-300">Stato iniziale (q₀ ∈ Q)</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="font-mono font-bold text-blue-600 dark:text-blue-400 w-6">F</span>
                                    <span className="text-gray-600 dark:text-gray-300">Insieme di stati accettanti (F ⊆ Q)</span>
                                </li>
                            </ul>
                        </div>

                        <section>
                            <h4 className="font-bold text-gray-900 dark:text-white mb-2">Funzionamento</h4>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                Il DFA inizia nello stato iniziale <strong>q₀</strong> e legge la stringa di input un simbolo alla volta. Per ogni simbolo letto, passa da uno stato all'altro seguendo la funzione di transizione <strong>δ</strong>.
                            </p>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mt-2">
                                Quando l'input è terminato, se l'automa si trova in uno stato appartenente all'insieme <strong>F</strong> (stati accettanti), la stringa viene <strong>accettata</strong>. Altrimenti, viene <strong>rifiutata</strong>.
                            </p>
                        </section>

                        <section>
                            <h4 className="font-bold text-gray-900 dark:text-white mb-2">Determinismo</h4>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                "Deterministico" significa che per ogni stato e per ogni simbolo di input, c'è <strong>esattamente una</strong> transizione possibile. Non ci sono ambiguità: dato uno stato e un input, il prossimo stato è univocamente determinato.
                            </p>
                        </section>
                    </div>
                )}
            </div>
        </Modal>
    )
}

export default HelpModal
