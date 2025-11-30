/**
 * Custom State Node for React Flow
 */

import { FC, useState } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import { clsx } from 'clsx'
import type { DFANodeData } from '@/types'
import { COLORS } from '@/utils/constants'

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

  // Get colors based on state type
  const getBgColor = () => {
    switch (data.type) {
      case 'initial':
        return COLORS.state.initial
      case 'accepting':
        return COLORS.state.accepting
      case 'initial-accepting':
        return COLORS.state.initialAccepting
      default:
        return COLORS.state.normal
    }
  }

  const getBorderColor = () => {
    switch (data.type) {
      case 'initial':
        return COLORS.stateBorder.initial
      case 'accepting':
        return COLORS.stateBorder.accepting
      case 'initial-accepting':
        return COLORS.stateBorder.initialAccepting
      default:
        return COLORS.stateBorder.normal
    }
  }

  return (
    <div className="relative">
      {/* Initial state arrow */}
      {isInitial && (
        <div
          className="absolute -left-8 top-1/2 transform -translate-y-1/2"
          style={{ color: getBorderColor() }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M5 12l14 0M15 8l4 4-4 4" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
        </div>
      )}

      {/* Main circle */}
      <div
        className={(() => clsx(
          'w-16 h-16 rounded-full flex items-center justify-center',
          'border-2 transition-all duration-200',
          isHighlighted && 'state-node-highlighted',
          selected && 'ring-2 ring-primary-500 ring-offset-2'
        ))()}
        style={{
          backgroundColor: getBgColor(),
          borderColor: getBorderColor(),
        }}
        onDoubleClick={handleDoubleClick}
      >
        {/* Accepting state: inner circle */}
        {isAccepting && (
          <div
            className="absolute w-12 h-12 rounded-full border-2"
            style={{ borderColor: getBorderColor() }}
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
            className="w-10 text-center bg-transparent border-none outline-none text-sm font-semibold"
            style={{ color: '#1f2937' }}
          />
        ) : (
          <span className="text-sm font-semibold text-gray-900 z-10">
            {data.label}
          </span>
        )}
      </div>

      {/* Connection handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-gray-400 !border-2 !border-white !w-3 !h-3"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-gray-400 !border-2 !border-white !w-3 !h-3"
      />
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-gray-400 !border-2 !border-white !w-3 !h-3"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-gray-400 !border-2 !border-white !w-3 !h-3"
      />
    </div>
  )
}

export default StateNode
