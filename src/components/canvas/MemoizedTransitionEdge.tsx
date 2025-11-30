/**
 * Memoized Transition Edge for better performance
 */

import { memo } from 'react'
import TransitionEdge from './TransitionEdge'

// Memoize to prevent unnecessary re-renders
export default memo(TransitionEdge, (prev, next) => {
  return (
    prev.id === next.id &&
    prev.selected === next.selected &&
    prev.data === next.data &&
    prev.sourceX === next.sourceX &&
    prev.sourceY === next.sourceY &&
    prev.targetX === next.targetX &&
    prev.targetY === next.targetY
  )
})
