/**
 * Canvas Controls - Add state mode, etc.
 */

import { FC, useEffect, useState } from 'react'
import { useDFA } from '@/hooks/useDFA'
import type { StateType } from '@/types'

const CanvasControls: FC = () => {
  const dfa = useDFA()
  const [isAddMode, setIsAddMode] = useState(false)
  const [stateType] = useState<StateType>('normal')

  // Handle canvas click to add state
  useEffect(() => {
    if (!isAddMode) return

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      // Only add state if clicking on the react-flow pane
      if (target.classList.contains('react-flow__pane')) {
        const rect = target.getBoundingClientRect()
        const position = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        }

        dfa.createState(position, stateType)
        setIsAddMode(false)
      }
    }

    window.addEventListener('click', handleClick)
    return () => window.removeEventListener('click', handleClick)
  }, [isAddMode, stateType, dfa])

  return null
}

export default CanvasControls
