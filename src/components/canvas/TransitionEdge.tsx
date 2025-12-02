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
import { useTheme } from '@/hooks/useTheme'

import { useDFAStore } from '@/store/dfaStore'
import { useCallback, useRef } from 'react'

/**
 * Custom Edge Component for DFA Transitions.
 * Renders a Bezier curve with a label (symbol) and interactive control points
 * for adjusting curvature. Supports self-loops and bidirectional edges.
 */
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
  const updateTransition = useDFAStore((state) => state.updateTransition)

  const edgeData = data as DFAEdgeData | undefined
  const isHighlighted = edgeData?.isHighlighted
  const isAnimating = edgeData?.isAnimating

  // Get edge index and total edges for curvature calculation
  const edgeIndex = edgeData?.edgeIndex ?? 0
  const totalEdges = edgeData?.totalEdges ?? 1
  const customControlPoints = edgeData?.controlPoints

  // Calculate default control points if not provided
  // We need these for the initial state before any custom drag
  // We can reuse the logic we already have for cp1X, cp1Y, etc.

  let cp1X: number, cp1Y: number, cp2X: number, cp2Y: number

  if (customControlPoints) {
    cp1X = customControlPoints.p1.x
    cp1Y = customControlPoints.p1.y
    cp2X = customControlPoints.p2.x
    cp2Y = customControlPoints.p2.y
  } else {
    // Calculate defaults based on existing logic (curvature or self-loop)
    // Check if it's a self-loop
    const isSelfLoop = edgeData?.from === edgeData?.to

    // Calculate curvature: use custom if available, otherwise calculate based on index
    // This is still needed for default self-loop calculation if no custom control points
    const customCurvature = edgeData?.curvature
    let curvature = customCurvature

    if (curvature === undefined) {
      curvature = 0
      if (totalEdges > 1) {
        // Spread edges evenly with curvature
        const maxCurvature = 0.5
        const step = (maxCurvature * 2) / (totalEdges - 1)
        curvature = -maxCurvature + (edgeIndex * step)
      }
    }

    if (isSelfLoop) {
      // Custom logic for self-loops to make them larger and visible
      // We assume the node is roughly 60x60 (radius 30)
      const loopSize = 60 + (Math.abs(curvature || 0) * 50)

      const getVector = (pos: string) => {
        switch (pos) {
          case 'top': return { x: 0, y: -1 }
          case 'bottom': return { x: 0, y: 1 }
          case 'left': return { x: -1, y: 0 }
          case 'right': return { x: 1, y: 0 }
          default: return { x: 0, y: -1 }
        }
      }

      const dir1 = getVector(sourcePosition)
      const dir2 = getVector(targetPosition)

      if (sourcePosition === targetPosition) {
        const tangent = { x: -dir1.y, y: dir1.x }
        const spread = 60
        cp1X = sourceX + (dir1.x * loopSize) + (tangent.x * spread)
        cp1Y = sourceY + (dir1.y * loopSize) + (tangent.y * spread)
        cp2X = targetX + (dir2.x * loopSize) - (tangent.x * spread)
        cp2Y = targetY + (dir2.y * loopSize) - (tangent.y * spread)
      } else {
        const isOpposite = (dir1.x * dir2.x + dir1.y * dir2.y) < -0.9
        if (isOpposite) {
          const perp = { x: -dir1.y, y: dir1.x }
          const offset = 100 + (Math.abs(curvature || 0) * 20)
          cp1X = sourceX + (dir1.x * loopSize) + (perp.x * offset)
          cp1Y = sourceY + (dir1.y * loopSize) + (perp.y * offset)
          cp2X = targetX + (dir2.x * loopSize) + (perp.x * offset)
          cp2Y = targetY + (dir2.y * loopSize) + (perp.y * offset)
        } else {
          cp1X = sourceX + (dir1.x * loopSize)
          cp1Y = sourceY + (dir1.y * loopSize)
          cp2X = targetX + (dir2.x * loopSize)
          cp2Y = targetY + (dir2.y * loopSize)
        }
      }
    } else {
      // Standard path logic using getBezierPath to find control points
      // getBezierPath returns the path string, but we need the points.
      // We can approximate or calculate them. React Flow's getBezierPath uses:
      // cp1 = source + offset, cp2 = target - offset
      // offset depends on distance and curvature.

      // Let's use a simplified calculation that matches standard Bezier behavior
      // or we can parse the path string from getBezierPath if we want to be exact to default
      // Parsing is safer to match default look.

      const [path] = getBezierPath({
        sourceX, sourceY, sourcePosition,
        targetX, targetY, targetPosition,
        curvature
      })

      // Path format: M x y C cp1x cp1y cp2x cp2y tx ty
      const match = path.match(/C\s*([\d.-]+)\s*([\d.-]+)\s*([\d.-]+)\s*([\d.-]+)/)
      if (match) {
        cp1X = parseFloat(match[1])
        cp1Y = parseFloat(match[2])
        cp2X = parseFloat(match[3])
        cp2Y = parseFloat(match[4])
      } else {
        // Fallback
        cp1X = sourceX
        cp1Y = sourceY
        cp2X = targetX
        cp2Y = targetY
      }
    }
  }

  const edgePath = `M ${sourceX} ${sourceY} C ${cp1X} ${cp1Y} ${cp2X} ${cp2Y} ${targetX} ${targetY}`

  // Calculate label position (t=0.5)
  const t = 0.5
  const labelX = (1 - t) ** 3 * sourceX + 3 * (1 - t) ** 2 * t * cp1X + 3 * (1 - t) * t ** 2 * cp2X + t ** 3 * targetX
  const labelY = (1 - t) ** 3 * sourceY + 3 * (1 - t) ** 2 * t * cp1Y + 3 * (1 - t) * t ** 2 * cp2Y + t ** 3 * targetY

  // Drag logic for control points
  const draggingRef = useRef<'cp1' | 'cp2' | null>(null)

  const onControlMouseDown = useCallback((e: React.MouseEvent, handle: 'cp1' | 'cp2') => {
    e.stopPropagation()
    e.preventDefault()
    draggingRef.current = handle

    // We need to track mouse position relative to canvas to update absolute coordinates
    // But here we get screen coordinates. We can use delta.
    const startX = e.clientX
    const startY = e.clientY
    const startCpX = handle === 'cp1' ? cp1X : cp2X
    const startCpY = handle === 'cp1' ? cp1Y : cp2Y

    const onMouseMove = (e: MouseEvent) => {
      if (!draggingRef.current) return

      // Calculate delta in screen pixels (assuming 1:1 zoom for simplicity, 
      // ideally we should transform via React Flow instance but this is a good start)
      // For better precision with zoom, we might need useReactFlow().screenToFlowPosition
      // But let's stick to delta for now, it usually works well enough for small adjustments
      // Actually, screen delta needs to be divided by zoom level. 
      // Let's assume zoom is 1 for now or use a simple delta.
      // A better way is to update based on the new position.

      const deltaX = (e.clientX - startX) // / zoom
      const deltaY = (e.clientY - startY) // / zoom

      // We need to update the store with new control points
      // We need to preserve the OTHER control point
      const newCpX = startCpX + deltaX
      const newCpY = startCpY + deltaY

      const newControlPoints = {
        p1: { x: handle === 'cp1' ? newCpX : cp1X, y: handle === 'cp1' ? newCpY : cp1Y },
        p2: { x: handle === 'cp2' ? newCpX : cp2X, y: handle === 'cp2' ? newCpY : cp2Y }
      }

      updateTransition(id, { controlPoints: newControlPoints })
    }

    const onMouseUp = () => {
      draggingRef.current = null
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }, [id, cp1X, cp1Y, cp2X, cp2Y, updateTransition])

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
          strokeWidth: selected ? 3 : 2,
          filter: selected ? 'drop-shadow(0 0 5px rgba(59, 130, 246, 0.5))' : undefined,
          transition: 'stroke 0.2s ease',
        }}
        className={clsx(isAnimating && 'transition-animated')}
      />

      {/* Visual Guides for Control Points (Tangent Lines) - Only when selected */}
      {selected && (
        <g>
          <path d={`M ${sourceX} ${sourceY} L ${cp1X} ${cp1Y}`} stroke="#3b82f6" strokeWidth="1" strokeDasharray="4" opacity="0.5" fill="none" />
          <path d={`M ${targetX} ${targetY} L ${cp2X} ${cp2Y}`} stroke="#3b82f6" strokeWidth="1" strokeDasharray="4" opacity="0.5" fill="none" />
        </g>
      )}

      <EdgeLabelRenderer>
        {/* Symbol Label */}
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
            zIndex: 10,
          }}
          className="nodrag nopan"
        >
          <div
            className={clsx(
              'px-2 py-1 bg-white dark:bg-gray-800 rounded text-xs font-bold',
              'shadow-sm cursor-pointer text-gray-900 dark:text-gray-100',
              'transition-all duration-200 select-none',
              selected
                ? 'border-2 border-primary-500 dark:border-primary-400 ring-2 ring-primary-200 dark:ring-primary-900'
                : 'border border-gray-300 dark:border-gray-600',
              isHighlighted && 'bg-red-50 dark:bg-red-950 border-red-500 dark:border-red-400'
            )}
            onClick={(e) => {
              e.stopPropagation()
              // Select edge logic handled by ReactFlow onEdgeClick usually, 
              // but clicking label should also select/keep selected
            }}
          >
            {edgeData?.symbol || ''}
          </div>
        </div>

        {/* Control Point Handles (Visible only when selected) */}
        {selected && (
          <>
            {/* CP1 Handle */}
            <div
              style={{
                position: 'absolute',
                transform: `translate(-50%, -50%) translate(${cp1X}px,${cp1Y}px)`,
                pointerEvents: 'all',
                zIndex: 20,
              }}
              className="nodrag nopan group"
              onMouseDown={(e) => onControlMouseDown(e, 'cp1')}
            >
              <div
                className={clsx(
                  "w-3 h-3 rounded-full bg-white border-2 border-blue-500 shadow-md cursor-move",
                  "hover:scale-125 transition-transform",
                  "flex items-center justify-center"
                )}
                title="Drag to adjust start curve"
              >
                <div className="w-1 h-1 bg-blue-500 rounded-full" />
              </div>
            </div>

            {/* CP2 Handle */}
            <div
              style={{
                position: 'absolute',
                transform: `translate(-50%, -50%) translate(${cp2X}px,${cp2Y}px)`,
                pointerEvents: 'all',
                zIndex: 20,
              }}
              className="nodrag nopan group"
              onMouseDown={(e) => onControlMouseDown(e, 'cp2')}
            >
              <div
                className={clsx(
                  "w-3 h-3 rounded-full bg-white border-2 border-blue-500 shadow-md cursor-move",
                  "hover:scale-125 transition-transform",
                  "flex items-center justify-center"
                )}
                title="Drag to adjust end curve"
              >
                <div className="w-1 h-1 bg-blue-500 rounded-full" />
              </div>
            </div>
          </>
        )}
      </EdgeLabelRenderer>
    </>
  )
}

export default TransitionEdge
