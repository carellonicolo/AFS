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

    return transitions.map((transition) => ({
      id: transition.id,
      source: transition.from,
      target: transition.to,
      type: 'transitionEdge',
      data: {
        ...transition,
        isHighlighted: currentStep?.transitionUsed === transition.id,
        isAnimating: isExecuting && currentStep?.transitionUsed === transition.id,
      },
    }))
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

      // Get default symbol from alphabet
      const alphabet = dfa.getAlphabet()
      const defaultSymbol = alphabet[0] || '0'

      // Create transition
      const transition: DFATransition = {
        id: DFA.generateTransitionId(),
        from: connection.source,
        to: connection.target,
        symbol: defaultSymbol,
      }

      try {
        dfa.addTransition(transition)
      } catch (error) {
        console.error('Failed to create transition:', error)
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
