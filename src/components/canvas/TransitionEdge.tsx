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
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  const edgeData = data as DFAEdgeData | undefined
  const isHighlighted = edgeData?.isHighlighted
  const isAnimating = edgeData?.isAnimating

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: isHighlighted ? COLORS.highlight : COLORS.transition,
          strokeWidth: selected ? 3 : 2,
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
              'px-2 py-1 bg-white dark:bg-gray-800 border-2 rounded text-sm font-semibold',
              'shadow-sm cursor-pointer text-gray-900 dark:text-gray-100',
              selected ? 'border-primary-500 dark:border-primary-400' : 'border-gray-300 dark:border-gray-600',
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
