import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Language } from '@/types'

interface LanguageStore {
  lang: Language
  setLang: (lang: Language) => void
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      lang: 'pt',
      setLang: (lang: Language) => set({ lang }),
    }),
    {
      name: 'language-store',
      partialize: (state) => ({ lang: state.lang }),
    }
  )
)
