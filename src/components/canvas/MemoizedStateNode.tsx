/**
 * Memoized State Node for better performance
 */

import { memo } from 'react'
import StateNode from './StateNode'

// Memoize to prevent unnecessary re-renders
export default memo(StateNode, (prev, next) => {
  // Only re-render if data actually changed
  return (
    prev.id === next.id &&
    prev.selected === next.selected &&
    JSON.stringify(prev.data) === JSON.stringify(next.data)
  )
})
