import { create } from 'zustand'

export const useUIStore = create((set) => ({
  theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light',

  setTheme: (theme) => {
    if (theme !== 'light' && theme !== 'dark') return

    document.documentElement.classList.toggle('dark', theme === 'dark')
    set({ theme })

    try {
      localStorage.setItem('ghar-theme', theme)
    } catch {
      // Switching still works for this visit if storage is blocked or full.
    }
  },
}))
