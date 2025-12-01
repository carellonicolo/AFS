/**
 * Custom Transition Edge for React Flow
 */

import { FC } from 'react'
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
} from '@xyflow/react'
import { clsx } from 'clsx'
import type { DFAEdgeData } from '@/types'
import { COLORS } from '@/utils/constants'
import { useTheme } from '@/contexts/ThemeContext'

const TransitionEdge: FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
}) => {
  const { theme } = useTheme()

  const edgeData = data as DFAEdgeData | undefined
  const isHighlighted = edgeData?.isHighlighted
  const isAnimating = edgeData?.isAnimating

  // Get edge index and total edges for curvature calculation
  const edgeIndex = edgeData?.edgeIndex ?? 0
  const totalEdges = edgeData?.totalEdges ?? 1

  // Calculate curvature offset for multiple edges between same nodes
  let curvature = 0
  if (totalEdges > 1) {
    // Spread edges evenly with curvature
    const maxCurvature = 0.5
    const step = (maxCurvature * 2) / (totalEdges - 1)
    curvature = -maxCurvature + (edgeIndex * step)
  }

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    curvature,
  })

  // Determine which marker to use based on state
  const getMarkerEnd = () => {
    if (isHighlighted) return 'url(#arrow-highlight)'
    if (selected) return 'url(#arrow-selected)'
    return theme === 'dark' ? 'url(#arrow-dark)' : 'url(#arrow-light)'
  }

  // Determine stroke color based on state
  const getStrokeColor = () => {
    if (isHighlighted) return COLORS.highlight
    if (selected) return '#3b82f6'
    return COLORS.transition
  }

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={getMarkerEnd()}
        style={{
          stroke: getStrokeColor(),
          strokeWidth: selected ? 5 : 2,
          filter: selected ? 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.8)) drop-shadow(0 0 20px rgba(59, 130, 246, 0.4))' : undefined,
          transition: 'all 0.2s ease',
        }}
        className={clsx(isAnimating && 'transition-animated')}
      />

      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          <div
            className={clsx(
              'px-2 py-1 bg-white dark:bg-gray-800 rounded text-sm font-semibold',
              'shadow-sm cursor-pointer text-gray-900 dark:text-gray-100',
              'transition-all duration-200',
              selected
                ? 'border-4 border-primary-500 dark:border-primary-400 scale-110 shadow-lg ring-2 ring-primary-300 dark:ring-primary-600'
                : 'border-2 border-gray-300 dark:border-gray-600',
              isHighlighted && 'bg-red-50 dark:bg-red-950 border-red-500 dark:border-red-400'
            )}
          >
            {edgeData?.symbol || ''}
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  )
}

export default TransitionEdge
