/**
 * Custom State Node for React Flow
 */

import { FC, useState } from 'react'
import { Handle, Position, NodeProps, NodeToolbar } from '@xyflow/react'
import { clsx } from 'clsx'
import { Pencil } from 'lucide-react'
import type { DFANodeData, StateType } from '@/types'
import { useDFA } from '@/hooks/useDFA'
import StatePropertiesModal from '../modals/StatePropertiesModal'

/**
 * Custom Node Component for DFA States.
 * Renders a state circle with label, handling selection and styling
 * based on state type (initial, accepting, etc.).
 */
const StateNode: FC<NodeProps> = ({ id, data: rawData, selected }) => {
  const data = rawData as DFANodeData
  const dfa = useDFA()

  const [isEditingLabel, setIsEditingLabel] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [label, setLabel] = useState(data?.label || '')

  if (!data) return null

  const handleDoubleClick = () => {
    setIsEditingLabel(true)
  }

  const handleBlur = () => {
    setIsEditingLabel(false)
    if (label !== data.label) {
      dfa.updateState(id, { label })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur()
    }
  }

  const handleSaveProperties = (newLabel: string, newType: StateType) => {
    dfa.updateState(id, { label: newLabel, type: newType })
    setLabel(newLabel)
  }

  const handleDeleteState = () => {
    dfa.removeState(id)
  }

  const isInitial = data.type === 'initial' || data.type === 'initial-accepting'
  const isAccepting = data.type === 'accepting' || data.type === 'initial-accepting'
  const isHighlighted = data.isHighlighted

  return (
    <div className="relative group">
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

      {/* Edit Button - Visible on hover or when modal is open */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          setShowModal(true)
        }}
        className={clsx(
          'absolute -top-2 -right-2 z-50 p-1.5 rounded-full shadow-lg transition-all duration-200 scale-0 group-hover:scale-100',
          showModal && 'scale-100',
          'bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 border border-gray-200 dark:border-white/10 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400'
        )}
        title="Modifica Stato"
      >
        <Pencil className="w-3 h-3" />
      </button>

      {/* Properties Modal - Using NodeToolbar for correct layering */}
      <NodeToolbar
        isVisible={showModal}
        position={Position.Right}
        align="center"
        offset={20}
      >
        <StatePropertiesModal
          initialLabel={data.label}
          initialType={data.type}
          onSave={handleSaveProperties}
          onDelete={handleDeleteState}
          onClose={() => setShowModal(false)}
        />
      </NodeToolbar>

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
        {isEditingLabel ? (
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
        className="!bg-purple-500 dark:!bg-purple-400 !border-2 !border-white dark:!border-gray-800 !w-3.5 !h-3.5 opacity-0 group-hover:opacity-100 transition-opacity"
      />
      <Handle
        type="target"
        position={Position.Top}
        id="top-target"
        className="!bg-purple-500 dark:!bg-purple-400 !border-2 !border-white dark:!border-gray-800 !w-3.5 !h-3.5 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ pointerEvents: 'none' }}
      />

      {/* Bottom handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="!bg-purple-500 dark:!bg-purple-400 !border-2 !border-white dark:!border-gray-800 !w-3.5 !h-3.5 opacity-0 group-hover:opacity-100 transition-opacity"
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id="bottom-target"
        className="!bg-purple-500 dark:!bg-purple-400 !border-2 !border-white dark:!border-gray-800 !w-3.5 !h-3.5 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ pointerEvents: 'none' }}
      />

      {/* Left handle */}
      <Handle
        type="source"
        position={Position.Left}
        id="left"
        className="!bg-purple-500 dark:!bg-purple-400 !border-2 !border-white dark:!border-gray-800 !w-3.5 !h-3.5 opacity-0 group-hover:opacity-100 transition-opacity"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left-target"
        className="!bg-purple-500 dark:!bg-purple-400 !border-2 !border-white dark:!border-gray-800 !w-3.5 !h-3.5 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ pointerEvents: 'none' }}
      />

      {/* Right handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="!bg-purple-500 dark:!bg-purple-400 !border-2 !border-white dark:!border-gray-800 !w-3.5 !h-3.5 opacity-0 group-hover:opacity-100 transition-opacity"
      />
      <Handle
        type="target"
        position={Position.Right}
        id="right-target"
        className="!bg-purple-500 dark:!bg-purple-400 !border-2 !border-white dark:!border-gray-800 !w-3.5 !h-3.5 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ pointerEvents: 'none' }}
      />
    </div>
  )
}

export default StateNode

