# DFA Visual Editor

Editor visuale per Automi a Stati Finiti Deterministici (DFA) - Un'applicazione web intuitiva per creare, testare e visualizzare DFA.

## Caratteristiche

### Funzionalità Core
- **Editor Visuale**: Crea stati e transizioni con drag & drop usando React Flow
- **Tipi di Stati**: Normale, Iniziale, Accettante, Iniziale+Accettante
- **Gestione Transizioni**: Collega stati con transizioni etichettate
- **Gestione Alfabeto**: Personalizza l'alfabeto del tuo DFA
- **Validazione Automatica**: Il sistema valida automaticamente il DFA per errori comuni:
  - Verifica stato iniziale unico
  - Controlla determinismo
  - Rileva stati non raggiungibili
  - Avvisa per transizioni incomplete

### Esecuzione e Test
- **Esecuzione Step-by-Step**: Esegui il DFA passo dopo passo
- **Animazioni**: Visualizzazione animata dello stato corrente e delle transizioni
- **Modalità Auto**: Esecuzione automatica con velocità configurabile
- **Risultati Chiari**: Indica chiaramente se l'input è accettato o rifiutato

### Persistenza
- **Autosave**: Salvataggio automatico ogni 5 secondi su localStorage
- **Export JSON**: Esporta il DFA in formato JSON
- **Import JSON**: Carica DFA da file JSON

### UI/UX
- **Keyboard Shortcuts**:
  - `Canc/Backspace`: Elimina elemento selezionato
  - `Ctrl/Cmd+S`: Salva DFA
  - `Esc`: Deseleziona
  - `Space`: Play/Pause esecuzione
  - `←/→`: Naviga tra i passi dell'esecuzione
- **Responsive**: Funziona su desktop e mobile
- **Sidebar Collassabile**: Pannello proprietà e test facilmente accessibile

## Tecnologie Utilizzate

- **React 18** - Framework UI
- **TypeScript** - Type safety
- **Vite** - Build tool ultra-veloce
- **React Flow** - Libreria per grafi e diagrammi
- **Zustand** - State management leggero
- **Tailwind CSS** - Styling utility-first
- **Lucide React** - Icone moderne

## Installazione e Avvio

### Prerequisiti
- Node.js 18+
- npm o yarn

### Istruzioni

1. **Clona il repository**
   ```bash
   git clone <repository-url>
   cd AFS
   ```

2. **Installa le dipendenze**
   ```bash
   npm install
   ```

3. **Avvia il server di sviluppo**
   ```bash
   npm run dev
   ```

4. **Apri il browser**
   L'applicazione sarà disponibile su `http://localhost:5173`

## Build per Produzione

```bash
npm run build
```

Il build ottimizzato sarà creato nella cartella `dist/`.

## Guida Rapida

### Creare il tuo primo DFA

1. **Aggiungi Stati**:
   - Clicca su "Nuovo Stato" nella toolbar
   - Uno stato verrà creato al centro del canvas
   - Trascina lo stato nella posizione desiderata

2. **Configura Stati**:
   - Clicca su uno stato per selezionarlo
   - Nel pannello "Proprietà" (sidebar destra):
     - Modifica l'etichetta
     - Seleziona il tipo (Normale, Iniziale, Accettante, etc.)

3. **Crea Transizioni**:
   - Trascina da un cerchietto (handle) di uno stato verso un altro stato
   - La transizione verrà creata con il primo simbolo dell'alfabeto
   - Clicca sulla transizione per modificare il simbolo

4. **Gestisci Alfabeto**:
   - Nel pannello "Proprietà", sezione Alfabeto
   - Aggiungi o rimuovi simboli
   - L'alfabeto di default è {0, 1}

5. **Testa il DFA**:
   - Vai al tab "Test" nella sidebar
   - Inserisci una stringa di input
   - Clicca "Esegui" per esecuzione automatica
   - Oppure usa il pulsante step-by-step per avanzare manualmente
   - Osserva l'animazione sul canvas

6. **Salva il tuo Lavoro**:
   - Il DFA viene salvato automaticamente ogni 5 secondi
   - Usa "Salva" per scaricare un file JSON
   - Usa "Carica" per importare un DFA salvato

## Struttura del Progetto

```
src/
├── components/          # Componenti React
│   ├── canvas/         # Canvas React Flow + nodi custom
│   ├── controls/       # Toolbar, pannelli controllo
│   ├── layout/         # Layout componenti
│   └── ui/             # Componenti UI riusabili
├── core/               # Logica core DFA
│   └── dfa/           # Classi DFA, Validator, Executor
├── store/              # Zustand stores
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── styles/             # CSS e animazioni
```

## Architettura

L'applicazione segue un'architettura modulare:

- **Core Logic**: Separata dall'UI in `src/core/dfa/`
  - `DFA.ts`: Classe principale con operazioni CRUD
  - `DFAValidator.ts`: Validazione determinismo e completezza
  - `DFAExecutor.ts`: Algoritmo di esecuzione
  - `DFASerializer.ts`: Import/Export JSON

- **State Management**: Zustand con 3 store principali
  - `dfaStore`: Stato DFA corrente
  - `executionStore`: Stato esecuzione
  - `uiStore`: Stato UI (dialoghi, pannelli)

- **Canvas**: React Flow con componenti custom
  - `StateNode`: Nodo custom per stati
  - `TransitionEdge`: Arco custom per transizioni
  - `DFACanvas`: Canvas principale con sync bidirezionale

## Esempi di DFA

### DFA che accetta stringhe binarie con numero pari di 1
```json
{
  "states": [
    {"id": "q0", "label": "Even", "type": "initial-accepting", "position": {"x": 100, "y": 100}},
    {"id": "q1", "label": "Odd", "type": "normal", "position": {"x": 300, "y": 100}}
  ],
  "transitions": [
    {"id": "t1", "from": "q0", "to": "q0", "symbol": "0"},
    {"id": "t2", "from": "q0", "to": "q1", "symbol": "1"},
    {"id": "t3", "from": "q1", "to": "q1", "symbol": "0"},
    {"id": "t4", "from": "q1", "to": "q0", "symbol": "1"}
  ],
  "alphabet": ["0", "1"],
  "metadata": {
    "name": "Even Ones",
    "description": "Accepts binary strings with even number of 1s",
    "createdAt": "2025-11-30T00:00:00.000Z",
    "modifiedAt": "2025-11-30T00:00:00.000Z"
  }
}
```

## Sviluppo Futuro

Funzionalità pianificate per versioni future:
- Export come immagine PNG/SVG
- Galleria di DFA predefiniti
- Tutorial interattivo per principianti
- Modalità dark
- Condivisione DFA via URL
- Supporto NFA (Non-deterministic Finite Automata)
- Conversione DFA ↔ Regex
- Algoritmo di minimizzazione DFA

## Contribuire

Contributi sono benvenuti! Per favore:
1. Fai un fork del repository
2. Crea un branch per la tua feature (`git checkout -b feature/AmazingFeature`)
3. Commit le tue modifiche (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

## Licenza

Questo progetto è distribuito sotto licenza MIT. Vedi il file `LICENSE` per dettagli.

## Autore

Nicolò Carello - [info@nicolocarello.it](mailto:info@nicolocarello.it)

## Ringraziamenti

- [React Flow](https://reactflow.dev/) per l'eccellente libreria di grafi
- La comunità open source per le librerie utilizzate
- Studenti e insegnanti di teoria della computazione per l'ispirazione
