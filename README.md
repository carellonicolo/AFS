# DFA Visual Editor

> Editor visuale interattivo per Automi a Stati Finiti Deterministici (DFA)

[![Licenza MIT](https://img.shields.io/badge/Licenza-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18-61dafb?logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646cff?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06b6d4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![GitHub stars](https://img.shields.io/github/stars/carellonicolo/AFS?style=social)](https://github.com/carellonicolo/AFS)
[![GitHub issues](https://img.shields.io/github/issues/carellonicolo/AFS)](https://github.com/carellonicolo/AFS/issues)
[![GitHub forks](https://img.shields.io/github/forks/carellonicolo/AFS?style=social)](https://github.com/carellonicolo/AFS/network)

## Panoramica

DFA Visual Editor e uno strumento web interattivo per la creazione, la modifica e la validazione di Automi a Stati Finiti Deterministici. Progettato come risorsa didattica per studenti e docenti di informatica teorica, consente di costruire automi in modo visuale tramite un'interfaccia drag-and-drop intuitiva, testare stringhe di input in tempo reale e verificare le proprieta formali dell'automa.

L'applicazione rappresenta un valido supporto per l'insegnamento dei linguaggi formali e della teoria degli automi, rendendo concetti astratti immediatamente tangibili e sperimentabili attraverso la visualizzazione interattiva.

## Funzionalita Principali

- **Editor visuale drag-and-drop** — Creazione e posizionamento di stati e transizioni con interfaccia grafica basata su React Flow
- **Validazione in tempo reale** — Test di stringhe di input con evidenziazione del percorso di accettazione/rifiuto
- **Gestione completa degli stati** — Definizione di stati iniziali, finali e intermedi con editing inline
- **Transizioni interattive** — Creazione di archi etichettati con simboli dell'alfabeto tramite collegamento diretto tra nodi
- **Gestione dello stato con Zustand** — Architettura reattiva per la sincronizzazione tra editor e simulatore
- **Tema chiaro/scuro** — Supporto completo per dark mode
- **Responsive design** — Utilizzabile su desktop, tablet e dispositivi mobili

## Tech Stack

| Tecnologia | Utilizzo |
|:--|:--|
| ![React](https://img.shields.io/badge/React_18-61dafb?logo=react&logoColor=white) | Framework UI |
| ![TypeScript](https://img.shields.io/badge/TypeScript_5-3178c6?logo=typescript&logoColor=white) | Linguaggio tipizzato |
| ![Vite](https://img.shields.io/badge/Vite_5-646cff?logo=vite&logoColor=white) | Build tool |
| ![React Flow](https://img.shields.io/badge/React_Flow-ff0072) | Diagrammi interattivi |
| ![Zustand](https://img.shields.io/badge/Zustand-433e38) | State management |
| ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06b6d4?logo=tailwindcss&logoColor=white) | Styling |

## Requisiti

- **Node.js** >= 18
- **npm** >= 9 (oppure bun)

## Installazione

```bash
git clone https://github.com/carellonicolo/AFS.git
cd AFS
npm install
npm run dev
```

L'applicazione sara disponibile su `http://localhost:8080`.

## Utilizzo

1. **Aggiungi stati** cliccando sulla canvas o tramite il pannello laterale
2. **Collega gli stati** trascinando da un nodo all'altro per creare transizioni
3. **Definisci l'alfabeto** etichettando le transizioni con i simboli desiderati
4. **Imposta stato iniziale e finali** tramite il menu contestuale di ogni stato
5. **Testa una stringa** inserendola nel pannello di simulazione e osservando il percorso nell'automa

## Struttura del Progetto

```
AFS/
├── src/
│   ├── components/     # Componenti React (editor, pannelli, toolbar)
│   ├── store/          # Store Zustand per lo stato dell'automa
│   ├── lib/            # Logica di validazione e simulazione DFA
│   ├── pages/          # Pagine dell'applicazione
│   └── hooks/          # Custom hooks React
├── public/             # Asset statici
├── index.html          # Entry point HTML
└── vite.config.ts      # Configurazione Vite
```

## Deploy

L'applicazione produce un bundle statico deployabile su qualsiasi piattaforma:

```bash
npm run build
```

La cartella `dist/` generata puo essere pubblicata su Cloudflare Pages, Netlify, Vercel o qualsiasi hosting statico.

## Contribuire

I contributi sono benvenuti! Consulta le [linee guida per contribuire](CONTRIBUTING.md) per maggiori dettagli.

## Licenza

Distribuito con licenza MIT. Vedi il file [LICENSE](LICENSE) per i dettagli completi.

## Autore

**Nicolo Carello**
- GitHub: [@carellonicolo](https://github.com/carellonicolo)
- Website: [nicolocarello.it](https://nicolocarello.it)

---

<sub>Sviluppato con l'ausilio dell'intelligenza artificiale.</sub>

## Progetti Correlati

Questo progetto fa parte di una collezione di strumenti didattici e applicazioni open-source:

| Progetto | Descrizione |
|:--|:--|
| [Turing Machine](https://github.com/carellonicolo/Turing-Machine) | Simulatore di Macchina di Turing |
| [Scheduler](https://github.com/carellonicolo/Scheduler) | Simulatore di scheduling CPU |
| [Subnet Calculator](https://github.com/carellonicolo/Subnet) | Calcolatore subnet IPv4/IPv6 |
| [Base Converter](https://github.com/carellonicolo/base-converter) | Suite di conversione multi-funzionale |
| [Gioco del Lotto](https://github.com/carellonicolo/giocodellotto) | Simulatore Lotto e SuperEnalotto |
| [MicroASM](https://github.com/carellonicolo/microasm) | Simulatore assembly |
| [Flow Charts](https://github.com/carellonicolo/flow-charts) | Editor di diagrammi di flusso |
| [Cypher](https://github.com/carellonicolo/cypher) | Toolkit di crittografia |
| [Snake](https://github.com/carellonicolo/snake) | Snake game retro |
| [Pong](https://github.com/carellonicolo/pongcarello) | Pong game |
| [Calculator](https://github.com/carellonicolo/calculator-carello) | Calcolatrice scientifica |
| [IPSC Score](https://github.com/carellonicolo/IPSC) | Calcolatore punteggi IPSC |
| [Quiz](https://github.com/carellonicolo/quiz) | Piattaforma quiz scolastici |
| [Carello Hub](https://github.com/carellonicolo/carello-hub) | Dashboard educativa |
| [Prof Carello](https://github.com/carellonicolo/prof-carello) | Gestionale lezioni private |
| [DOCSITE](https://github.com/carellonicolo/DOCSITE) | Piattaforma documentale |
