/**
 * UI Store - Manages UI state (dialogs, panels, etc.)
 */

import { create } from 'zustand'

type DialogType = 'export' | 'import' | 'gallery' | 'tutorial' | 'help' | null
type PanelType = 'properties' | 'test' | 'history' | null

interface ConfirmDialogState {
  isOpen: boolean
  title: string
  message: string
  confirmLabel: string
  cancelLabel: string
  variant: 'danger' | 'warning'
  onConfirm: () => void
  onCancel?: () => void
}

interface UIStore {
  // State
  activeDialog: DialogType
  isSidebarOpen: boolean
  activePanel: PanelType
  tutorialStep: number
  isTutorialActive: boolean
  showValidationErrors: boolean
  confirmDialog: ConfirmDialogState | null

  // Dialog actions
  openDialog: (dialog: DialogType) => void
  closeDialog: () => void

  // Confirm dialog actions
  openConfirm: (config: Omit<ConfirmDialogState, 'isOpen'>) => void
  closeConfirm: () => void
  confirmAction: () => void
  cancelAction: () => void

  // Sidebar actions
  toggleSidebar: () => void
  openSidebar: () => void
  closeSidebar: () => void

  // Panel actions
  setActivePanel: (panel: PanelType) => void
  closePanel: () => void

  // Tutorial actions
  startTutorial: () => void
  stopTutorial: () => void
  nextTutorialStep: () => void
  prevTutorialStep: () => void
  setTutorialStep: (step: number) => void

  // Validation
  setShowValidationErrors: (show: boolean) => void
  toggleValidationErrors: () => void
}

export const useUIStore = create<UIStore>((set, get) => ({
  // Initial state
  activeDialog: null,
  isSidebarOpen: true,
  activePanel: 'properties',
  tutorialStep: 0,
  isTutorialActive: false,
  showValidationErrors: true,
  confirmDialog: null,

  // Dialog actions
  openDialog: (dialog) => set({ activeDialog: dialog }),
  closeDialog: () => set({ activeDialog: null }),

  // Confirm dialog actions
  openConfirm: (config) => set({
    confirmDialog: {
      ...config,
      isOpen: true,
      confirmLabel: config.confirmLabel || 'Conferma',
      cancelLabel: config.cancelLabel || 'Annulla'
    }
  }),

  closeConfirm: () => set({ confirmDialog: null }),

  confirmAction: () => {
    const dialog = get().confirmDialog
    if (dialog) {
      dialog.onConfirm()
      get().closeConfirm()
    }
  },

  cancelAction: () => {
    const dialog = get().confirmDialog
    if (dialog) {
      dialog.onCancel?.()
      get().closeConfirm()
    }
  },

  // Sidebar actions
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  openSidebar: () => set({ isSidebarOpen: true }),
  closeSidebar: () => set({ isSidebarOpen: false }),

  // Panel actions
  setActivePanel: (panel) => set({ activePanel: panel }),
  closePanel: () => set({ activePanel: null }),

  // Tutorial actions
  startTutorial: () =>
    set({
      isTutorialActive: true,
      tutorialStep: 0,
      activeDialog: 'tutorial',
    }),

  stopTutorial: () =>
    set({
      isTutorialActive: false,
      tutorialStep: 0,
      activeDialog: null,
    }),

  nextTutorialStep: () =>
    set((state) => ({ tutorialStep: state.tutorialStep + 1 })),

  prevTutorialStep: () =>
    set((state) => ({
      tutorialStep: Math.max(0, state.tutorialStep - 1),
    })),

  setTutorialStep: (step) => set({ tutorialStep: Math.max(0, step) }),

  // Validation
  setShowValidationErrors: (show) => set({ showValidationErrors: show }),
  toggleValidationErrors: () =>
    set((state) => ({ showValidationErrors: !state.showValidationErrors })),
}))
