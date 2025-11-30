/**
 * DFA Canvas - Main React Flow canvas component
 */

import { FC, useCallback, useMemo, useRef } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  NodeChange,
  EdgeChange,
  Connection,
  BackgroundVariant,
  Node,
  Edge,
} from '@xyflow/react'
import StateNode from './StateNode'
import TransitionEdge from './TransitionEdge'
import { useDFA } from '@/hooks/useDFA'
import { useExecutionStore } from '@/store/executionStore'
import { DFA } from '@/core/dfa/DFA'
import type { DFANode, DFAEdge, DFATransition, DFANodeData } from '@/types'

const nodeTypes = {
  stateNode: StateNode,
}

const edgeTypes = {
  transitionEdge: TransitionEdge,
}

interface DFACanvasProps {
  className?: string
}

const DFACanvas: FC<DFACanvasProps> = ({ className }) => {
  const dfa = useDFA()
  const execution = useExecutionStore()
  const reactFlowWrapper = useRef<HTMLDivElement>(null)

  // Convert DFA states to React Flow nodes
  const nodes: DFANode[] = useMemo(() => {
    const currentStep = execution.getCurrentStep()

    return dfa.getStates().map((state) => ({
      id: state.id,
      type: 'stateNode',
      position: state.position,
      data: {
        ...state,
        isHighlighted: currentStep?.currentState === state.id,
        isSelected: dfa.selectedNodeId === state.id,
      },
    }))
  }, [dfa.getStates(), dfa.selectedNodeId, execution.getCurrentStep()])

  // Convert DFA transitions to React Flow edges
  const edges: DFAEdge[] = useMemo(() => {
    const currentStep = execution.getCurrentStep()

    return dfa.getTransitions().map((transition) => ({
      id: transition.id,
      source: transition.from,
      target: transition.to,
      type: 'transitionEdge',
      data: {
        ...transition,
        isHighlighted: currentStep?.transitionUsed === transition.id,
        isAnimating: execution.isExecuting && currentStep?.transitionUsed === transition.id,
      },
    }))
  }, [dfa.getTransitions(), dfa.selectedEdgeId, execution.getCurrentStep(), execution.isExecuting])

  // Handle node changes (position, selection, etc.)
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      changes.forEach((change) => {
        if (change.type === 'position' && change.position) {
          const states = dfa.getStates()
          const state = states.find(s => s.id === change.id)
          if (state && change.position) {
            dfa.updateState(change.id, { position: change.position })
          }
        } else if (change.type === 'select' && change.selected) {
          dfa.selectNode(change.id)
        }
      })
    },
    [dfa]
  )

  // Handle edge changes (selection, etc.)
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      changes.forEach((change) => {
        if (change.type === 'select' && change.selected) {
          dfa.selectEdge(change.id)
        } else if (change.type === 'remove') {
          dfa.removeTransition(change.id)
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
        attributionPosition="bottom-left"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="#d1d5db"
        />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            const data = node.data as DFANodeData
            if (data.type === 'initial' || data.type === 'initial-accepting') {
              return '#3b82f6'
            }
            if (data.type === 'accepting') {
              return '#10b981'
            }
            return '#9ca3af'
          }}
          pannable
          zoomable
        />
      </ReactFlow>
    </div>
  )
}

export default DFACanvas
