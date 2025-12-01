/**
 * DFA Canvas - Main React Flow canvas component
 */

import { FC, useCallback, useMemo, useRef } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  NodeChange,
  EdgeChange,
  Connection,
  BackgroundVariant,
  Node,
  Edge,
} from '@xyflow/react'
import MemoizedStateNode from './MemoizedStateNode'
import MemoizedTransitionEdge from './MemoizedTransitionEdge'
import { useDFA } from '@/hooks/useDFA'
import { useExecutionStore } from '@/store/executionStore'
import { useTheme } from '@/contexts/ThemeContext'
import { DFA } from '@/core/dfa/DFA'
import type { DFANode, DFAEdge, DFATransition } from '@/types'
import { toast } from 'react-toastify'

const nodeTypes = {
  stateNode: MemoizedStateNode,
}

const edgeTypes = {
  transitionEdge: MemoizedTransitionEdge,
}

interface DFACanvasProps {
  className?: string
}

const DFACanvas: FC<DFACanvasProps> = ({ className }) => {
  const dfa = useDFA()
  const execution = useExecutionStore()
  const { theme } = useTheme()
  const reactFlowWrapper = useRef<HTMLDivElement>(null)

  // Convert DFA states to React Flow nodes
  const states = dfa.getStates()
  const transitions = dfa.getTransitions()
  const selectedNodeId = dfa.selectedNodeId
  const selectedEdgeId = dfa.selectedEdgeId

  const nodes: DFANode[] = useMemo(() => {
    const currentStep = execution.getCurrentStep()

    return states.map((state) => ({
      id: state.id,
      type: 'stateNode',
      position: state.position,
      data: {
        ...state,
        isHighlighted: currentStep?.currentState === state.id,
        isSelected: selectedNodeId === state.id,
      },
    }))
  }, [states, execution, selectedNodeId])

  // Convert DFA transitions to React Flow edges
  const edges: DFAEdge[] = useMemo(() => {
    const currentStep = execution.getCurrentStep()
    const isExecuting = execution.isExecuting

    // Group transitions by source-target pair to calculate edge indices
    const edgeGroups = new Map<string, DFATransition[]>()

    transitions.forEach((transition) => {
      const key = `${transition.from}-${transition.to}`
      if (!edgeGroups.has(key)) {
        edgeGroups.set(key, [])
      }
      edgeGroups.get(key)!.push(transition)
    })

    return transitions.map((transition) => {
      const key = `${transition.from}-${transition.to}`
      const group = edgeGroups.get(key)!
      const edgeIndex = group.findIndex(t => t.id === transition.id)
      const totalEdges = group.length

      return {
        id: transition.id,
        source: transition.from,
        target: transition.to,
        type: 'transitionEdge',
        selected: selectedEdgeId === transition.id,
        data: {
          ...transition,
          isHighlighted: currentStep?.transitionUsed === transition.id,
          isAnimating: isExecuting && currentStep?.transitionUsed === transition.id,
          edgeIndex,
          totalEdges,
        },
      }
    })
  }, [transitions, execution, selectedEdgeId])

  // Handle node changes (position, selection, etc.)
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      changes.forEach((change) => {
        try {
          if (change.type === 'position' && change.position) {
            const states = dfa.getStates()
            const state = states.find(s => s.id === change.id)
            if (state && change.position) {
              dfa.updateState(change.id, { position: change.position })
            }
          } else if (change.type === 'select' && change.selected) {
            dfa.selectNode(change.id)
          }
        } catch (error) {
          console.error('Error handling node change:', error)
        }
      })
    },
    [dfa]
  )

  // Handle edge changes (selection, etc.)
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      changes.forEach((change) => {
        try {
          if (change.type === 'select' && change.selected) {
            dfa.selectEdge(change.id)
          } else if (change.type === 'remove') {
            dfa.removeTransition(change.id)
          }
        } catch (error) {
          console.error('Error handling edge change:', error)
        }
      })
    },
    [dfa]
  )

  // Handle new connection (creating a transition)
  const onConnect = useCallback(
    (connection: Connection) => {
      if (!connection.source || !connection.target) return

      // Get alphabet
      const alphabet = dfa.getAlphabet()

      // Find the first available symbol for this source state
      // (a symbol that doesn't already have a transition from this state)
      const allTransitions = dfa.getTransitions()
      const existingTransitions = allTransitions.filter((t: DFATransition) => t.from === connection.source)
      const usedSymbols = new Set(existingTransitions.map((t: DFATransition) => t.symbol))

      console.log('=== DEBUG onConnect ===')
      console.log('Source:', connection.source)
      console.log('Target:', connection.target)
      console.log('Alphabet:', alphabet)
      console.log('All transitions:', allTransitions)
      console.log('Existing transitions from source:', existingTransitions)
      console.log('Used symbols:', Array.from(usedSymbols))

      const availableSymbol = alphabet.find(symbol => !usedSymbols.has(symbol))
      console.log('Available symbol:', availableSymbol)

      if (!availableSymbol) {
        toast.error(
          `Lo stato sorgente ha già transizioni per tutti i simboli dell'alfabeto. Non è possibile aggiungere altre transizioni.`,
          {
            position: 'bottom-right',
            autoClose: 5000,
          }
        )
        return
      }

      // Create transition with the first available symbol
      const transition: DFATransition = {
        id: DFA.generateTransitionId(),
        from: connection.source,
        to: connection.target,
        symbol: availableSymbol,
      }

      console.log('Creating transition:', transition)

      try {
        dfa.addTransition(transition)
        console.log('Transition added successfully')
      } catch (error) {
        console.error('Error adding transition:', error)
        const errorMessage = error instanceof Error ? error.message : 'Errore sconosciuto'
        toast.error(errorMessage, {
          position: 'bottom-right',
          autoClose: 5000,
        })
      }
    },
    [dfa]
  )

  // Handle canvas click (deselect)
  const onPaneClick = useCallback(() => {
    dfa.clearSelection()
  }, [dfa])

  // Handle node click
  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      dfa.selectNode(node.id)
    },
    [dfa]
  )

  // Handle edge click
  const onEdgeClick = useCallback(
    (_event: React.MouseEvent, edge: Edge) => {
      dfa.selectEdge(edge.id)
    },
    [dfa]
  )

  // Allow multiple connections between same nodes (for different symbols)
  const isValidConnection = useCallback(
    () => {
      // Always allow connections - we'll validate in onConnect
      return true
    },
    []
  )

  return (
    <div ref={reactFlowWrapper} className={className} style={{ width: '100%', height: '100%' }}>
      {/* SVG Marker Definitions for transition arrows */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          {/* Arrow marker for light mode */}
          <marker
            id="arrow-light"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#6b7280" stroke="none" />
          </marker>

          {/* Arrow marker for dark mode */}
          <marker
            id="arrow-dark"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#9ca3af" stroke="none" />
          </marker>

          {/* Arrow marker for highlighted/executing transition */}
          <marker
            id="arrow-highlight"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" stroke="none" />
          </marker>

          {/* Arrow marker for selected transition */}
          <marker
            id="arrow-selected"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" stroke="none" />
          </marker>
        </defs>
      </svg>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onPaneClick={onPaneClick}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        isValidConnection={isValidConnection}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color={theme === 'dark' ? '#4b5563' : '#d1d5db'}
        />
        <Controls />
      </ReactFlow>
    </div>
  )
}

export default DFACanvas
