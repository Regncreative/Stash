import { useStashStore } from '@/stores/stash-store'
import {
  dictionaries,
  getMessages,
  normalizeLanguage,
  type AppLanguage,
  type Messages
} from '@shared/i18n'

export type { AppLanguage, Messages }
export { dictionaries, getMessages, normalizeLanguage }

/** Reactive UI strings for the current settings language. */
export function useT(): Messages {
  const lang = useStashStore((s) => normalizeLanguage(s.settings?.language))
  return dictionaries[lang]
}

/** Static Turkish fallback — prefer useT() in components. */
export const tr = dictionaries.tr
