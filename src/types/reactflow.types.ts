/**
 * Type definitions for React Flow integration
 */

import { Node, Edge } from '@xyflow/react'
import { DFAState, DFATransition } from './dfa.types'

// Custom node data extending DFAState
export interface DFANodeData extends DFAState, Record<string, unknown> {
  isHighlighted?: boolean // For execution visualization
  isSelected?: boolean
}

// Custom edge data extending DFATransition
export interface DFAEdgeData extends DFATransition, Record<string, unknown> {
  isHighlighted?: boolean // For execution visualization
  isAnimating?: boolean
  edgeIndex?: number
  totalEdges?: number
  curvature?: number
  controlPoints?: {
    p1: { x: number; y: number }
    p2: { x: number; y: number }
  }
}

// React Flow node with DFA data
export type DFANode = Node<DFANodeData>

// React Flow edge with DFA data
export type DFAEdge = Edge<DFAEdgeData>

// Canvas state
export interface CanvasState {
  nodes: DFANode[]
  edges: DFAEdge[]
  selectedNodeId: string | null
  selectedEdgeId: string | null
}
