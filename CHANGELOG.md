# Changelog

## [1.0.2] - 2025-11-30

### Added
- **Dark Mode**: Implementata modalità scura completa
  - Toggle tema con icona luna/sole nella toolbar
  - Supporto per tutte le componenti UI (Button, Input, Badge)
  - Layout completamente adattato (Header, Sidebar, AppLayout)
  - Pannelli aggiornati (Properties, Alphabet, Test)
  - Canvas con background adattivo
  - Transizioni ed etichette ottimizzate per dark mode
  - Persistenza preferenza tema su localStorage
  - Rilevamento automatico preferenze di sistema all'avvio

### Improved
- ThemeContext con React Context API per gestione globale del tema
- Hook useTheme per accesso semplice al tema in qualsiasi componente
- Transizioni smooth tra modalità chiara e scura
- Contrasto ottimizzato per accessibilità in entrambe le modalità

## [1.0.1] - 2025-11-30

### Fixed
- **Memory Leak**: Fixato memory leak nel timer di esecuzione automatica
  - Il timer ora viene correttamente pulito quando cambia la velocità o lo stato di esecuzione
  - Aggiunto cleanup esplicito in useEffect

- **Performance**: Ottimizzati re-render eccessivi
  - Implementata memoizzazione custom per StateNode e TransitionEdge
  - Ottimizzati useMemo in DFACanvas per evitare calcoli ripetuti
  - Ridotti re-render non necessari del canvas

- **Infinite Loop**: Fixato loop infinito in AlphabetPanel
  - Usato string representation dell'alfabeto come dipendenza
  - Evitato confronto diretto di array che causa re-render continui

- **Error Handling**: Aggiunto error handling robusto
  - Try-catch in tutti gli handler di canvas (onNodesChange, onEdgesChange)
  - Gestione errori in rehydration da localStorage
  - Validazione migliorata dell'input prima dell'esecuzione

- **Autosave**: Ottimizzato localStorage autosave
  - Implementato debounce corretto con ref
  - Solo salva se i dati sono effettivamente cambiati
  - Evitati salvataggi ridondanti

- **Validazione Input**: Migliorata validazione
  - Check per input vuoto prima dell'esecuzione
  - Limiti di lunghezza per le label degli stati (max 20 caratteri)
  - Sanitizzazione input in tutti i form

- **Stabilità Stati**: Aggiunta randomizzazione posizione nuovi stati
  - Piccolo offset casuale per evitare sovrapposizioni
  - Migliore esperienza utente quando si aggiungono stati multipli

### Performance Improvements
- Componenti canvas memoizzati per ridurre re-render
- Autosave ottimizzato con confronto dati
- Callback ottimizzati con dipendenze corrette
- Timer cleanup migliorato

## [1.0.0] - 2025-11-30

### Added
- Primo rilascio dell'applicazione DFA Visual Editor
- Editor visuale con React Flow
- Validazione DFA completa
- Esecuzione step-by-step con animazioni
- Persistenza localStorage con autosave
- Import/Export JSON
- Keyboard shortcuts
- Pannello proprietà e alfabeto
- Pannello test con controlli esecuzione
