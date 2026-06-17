import { create } from 'zustand'
import { getTheme, saveTheme } from '@/utils/storage'

type ThemeMode = 'light' | 'dark'

interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  duration?: number
}

interface UIStore {
  sidebarCollapsed: boolean
  currentStep: number
  totalSteps: number
  isLoading: boolean
  loadingText: string
  toastMessages: ToastMessage[]
  theme: ThemeMode

  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void

  setCurrentStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  setTotalSteps: (total: number) => void

  setLoading: (loading: boolean, text?: string) => void

  showToast: (type: ToastMessage['type'], message: string, duration?: number) => void
  hideToast: (id: string) => void
  clearToasts: () => void

  setTheme: (theme: ThemeMode) => void
  toggleTheme: () => void
  initTheme: () => void
}

let toastIdCounter = 0

function generateToastId(): string {
  toastIdCounter += 1
  return `toast-${Date.now()}-${toastIdCounter}`
}

function getInitialTheme(): ThemeMode {
  const savedTheme = getTheme()
  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme
  }
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return 'light'
}

export const useUIStore = create<UIStore>((set, get) => ({
  sidebarCollapsed: false,
  currentStep: 0,
  totalSteps: 6,
  isLoading: false,
  loadingText: '加载中...',
  toastMessages: [],
  theme: 'light',

  toggleSidebar: () => {
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }))
  },

  setSidebarCollapsed: (collapsed: boolean) => {
    set({ sidebarCollapsed: collapsed })
  },

  setCurrentStep: (step: number) => {
    const { totalSteps } = get()
    const validStep = Math.max(0, Math.min(step, totalSteps - 1))
    set({ currentStep: validStep })
  },

  nextStep: () => {
    const { currentStep, totalSteps } = get()
    if (currentStep < totalSteps - 1) {
      set({ currentStep: currentStep + 1 })
    }
  },

  prevStep: () => {
    const { currentStep } = get()
    if (currentStep > 0) {
      set({ currentStep: currentStep - 1 })
    }
  },

  setTotalSteps: (total: number) => {
    set({ totalSteps: total })
  },

  setLoading: (loading: boolean, text?: string) => {
    set({
      isLoading: loading,
      loadingText: text || '加载中...',
    })
  },

  showToast: (type: ToastMessage['type'], message: string, duration: number = 3000) => {
    const id = generateToastId()
    const toast: ToastMessage = { id, type, message, duration }

    set((state) => ({
      toastMessages: [...state.toastMessages, toast],
    }))

    if (duration > 0) {
      setTimeout(() => {
        get().hideToast(id)
      }, duration)
    }
  },

  hideToast: (id: string) => {
    set((state) => ({
      toastMessages: state.toastMessages.filter((t) => t.id !== id),
    }))
  },

  clearToasts: () => {
    set({ toastMessages: [] })
  },

  setTheme: (theme: ThemeMode) => {
    set({ theme })
    saveTheme(theme)
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('light', 'dark')
      document.documentElement.classList.add(theme)
    }
  },

  toggleTheme: () => {
    const { theme } = get()
    const newTheme = theme === 'light' ? 'dark' : 'light'
    get().setTheme(newTheme)
  },

  initTheme: () => {
    const theme = getInitialTheme()
    get().setTheme(theme)
  },
}))
