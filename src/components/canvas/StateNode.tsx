/**
 * Custom State Node for React Flow
 */

import { FC, useState } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import { clsx } from 'clsx'
import type { DFANodeData } from '@/types'

const StateNode: FC<NodeProps> = ({ data: rawData, selected }) => {
  const data = rawData as DFANodeData
  if (!data) return null

  const [isEditing, setIsEditing] = useState(false)
  const [label, setLabel] = useState(data.label)

  const handleDoubleClick = () => {
    setIsEditing(true)
  }

  const handleBlur = () => {
    setIsEditing(false)
    // Update label in store would go here
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setIsEditing(false)
    }
  }

  const isInitial = data.type === 'initial' || data.type === 'initial-accepting'
  const isAccepting = data.type === 'accepting' || data.type === 'initial-accepting'
  const isHighlighted = data.isHighlighted

  return (
    <div className="relative">
      {/* Initial state arrow */}
      {isInitial && (
        <div
          className={clsx(
            'absolute -left-8 top-1/2 transform -translate-y-1/2',
            data.type === 'initial' && 'text-blue-500 dark:text-blue-400',
            data.type === 'initial-accepting' && 'text-yellow-500 dark:text-yellow-400'
          )}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M5 12l14 0M15 8l4 4-4 4" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
        </div>
      )}

      {/* Main circle */}
      <div
        className={clsx(
          'w-16 h-16 rounded-full flex items-center justify-center',
          'border-2 transition-all duration-200',
          // Background colors with dark mode support
          data.type === 'normal' && 'bg-gray-200 dark:bg-gray-700',
          data.type === 'initial' && 'bg-blue-100 dark:bg-blue-900',
          data.type === 'accepting' && 'bg-green-100 dark:bg-green-900',
          data.type === 'initial-accepting' && 'bg-yellow-100 dark:bg-yellow-900',
          // Border colors with dark mode support
          data.type === 'normal' && 'border-gray-400 dark:border-gray-500',
          data.type === 'initial' && 'border-blue-500 dark:border-blue-400',
          data.type === 'accepting' && 'border-green-500 dark:border-green-400',
          data.type === 'initial-accepting' && 'border-yellow-500 dark:border-yellow-400',
          isHighlighted && 'state-node-highlighted',
          selected && 'ring-2 ring-primary-500 ring-offset-2 dark:ring-offset-gray-900'
        )}
        onDoubleClick={handleDoubleClick}
      >
        {/* Accepting state: inner circle */}
        {isAccepting && (
          <div
            className={clsx(
              'absolute w-12 h-12 rounded-full border-2',
              data.type === 'accepting' && 'border-green-500 dark:border-green-400',
              data.type === 'initial-accepting' && 'border-yellow-500 dark:border-yellow-400'
            )}
          />
        )}

        {/* Label */}
        {isEditing ? (
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            autoFocus
            className="w-10 text-center bg-transparent border-none outline-none text-sm font-semibold text-gray-900 dark:text-gray-100"
          />
        ) : (
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 z-10">
            {data.label}
          </span>
        )}
      </div>

      {/* Connection handles - all bidirectional (source + target) */}
      {/* Top handle */}
      <Handle
        type="source"
        position={Position.Top}
        id="top"
        className="!bg-purple-500 dark:!bg-purple-400 !border-2 !border-white dark:!border-gray-800 !w-3.5 !h-3.5"
      />
      <Handle
        type="target"
        position={Position.Top}
        id="top-target"
        className="!bg-purple-500 dark:!bg-purple-400 !border-2 !border-white dark:!border-gray-800 !w-3.5 !h-3.5"
        style={{ pointerEvents: 'none' }}
      />

      {/* Bottom handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="!bg-purple-500 dark:!bg-purple-400 !border-2 !border-white dark:!border-gray-800 !w-3.5 !h-3.5"
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id="bottom-target"
        className="!bg-purple-500 dark:!bg-purple-400 !border-2 !border-white dark:!border-gray-800 !w-3.5 !h-3.5"
        style={{ pointerEvents: 'none' }}
      />

      {/* Left handle */}
      <Handle
        type="source"
        position={Position.Left}
        id="left"
        className="!bg-purple-500 dark:!bg-purple-400 !border-2 !border-white dark:!border-gray-800 !w-3.5 !h-3.5"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left-target"
        className="!bg-purple-500 dark:!bg-purple-400 !border-2 !border-white dark:!border-gray-800 !w-3.5 !h-3.5"
        style={{ pointerEvents: 'none' }}
      />

      {/* Right handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="!bg-purple-500 dark:!bg-purple-400 !border-2 !border-white dark:!border-gray-800 !w-3.5 !h-3.5"
      />
      <Handle
        type="target"
        position={Position.Right}
        id="right-target"
        className="!bg-purple-500 dark:!bg-purple-400 !border-2 !border-white dark:!border-gray-800 !w-3.5 !h-3.5"
        style={{ pointerEvents: 'none' }}
      />
    </div>
  )
}

export default StateNode
