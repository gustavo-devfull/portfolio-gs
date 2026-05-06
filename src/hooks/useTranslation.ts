import { useLanguageStore } from '@/store/languageStore'
import { pt } from '@/i18n/pt'
import { en } from '@/i18n/en'

type TranslationKeys = typeof pt

const translations: Record<string, TranslationKeys> = {
  pt,
  en,
}

export const useTranslation = () => {
  const lang = useLanguageStore((state) => state.lang)

  const t = (key: string): string => {
    const keys = key.split('.')
    let value: any = translations[lang]

    for (const k of keys) {
      value = value?.[k]
    }

    return typeof value === 'string' ? value : key
  }

  return { t, lang }
}
