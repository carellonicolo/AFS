import { useCallback } from 'react'
import { useUIStore } from '@/store/uiStore'

interface ConfirmConfig {
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'warning'
}

export function useConfirm() {
  const { openConfirm } = useUIStore()

  const confirm = useCallback(
    (config: ConfirmConfig): Promise<boolean> => {
      return new Promise((resolve) => {
        openConfirm({
          ...config,
          onConfirm: () => resolve(true),
          onCancel: () => resolve(false),
          variant: config.variant || 'warning',
          confirmLabel: config.confirmLabel || 'Conferma',
          cancelLabel: config.cancelLabel || 'Annulla'
        })
      })
    },
    [openConfirm]
  )

  return { confirm }
}
