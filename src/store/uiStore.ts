/**
 * UI Store - Manages UI state (dialogs, panels, etc.)
 */

import { create } from 'zustand'

type DialogType = 'export' | 'import' | 'gallery' | 'tutorial' | 'help' | null
type PanelType = 'properties' | 'test' | 'history' | null

interface UIStore {
  // State
  activeDialog: DialogType
  isSidebarOpen: boolean
  activePanel: PanelType
  tutorialStep: number
  isTutorialActive: boolean
  showValidationErrors: boolean

  // Dialog actions
  openDialog: (dialog: DialogType) => void
  closeDialog: () => void

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

export const useUIStore = create<UIStore>((set) => ({
  // Initial state
  activeDialog: null,
  isSidebarOpen: true,
  activePanel: 'properties',
  tutorialStep: 0,
  isTutorialActive: false,
  showValidationErrors: true,

  // Dialog actions
  openDialog: (dialog) => set({ activeDialog: dialog }),
  closeDialog: () => set({ activeDialog: null }),

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
