import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useStashStore } from '@/stores/stash-store'
import { cn } from '@/lib/utils'
import { useT } from '@/lib/i18n'

export function ConfirmDialog() {
  const t = useT()
  const confirm = useStashStore((s) => s.confirm)
  const resolveConfirm = useStashStore((s) => s.resolveConfirm)
  const [promptValue, setPromptValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const isPrompt = confirm?.promptDefault !== undefined || confirm?.promptPlaceholder !== undefined

  useEffect(() => {
    if (!confirm) return
    setPromptValue(confirm.promptDefault ?? '')
    if (isPrompt) {
      const t = window.setTimeout(() => inputRef.current?.focus(), 30)
      return () => window.clearTimeout(t)
    }
  }, [confirm, isPrompt])

  useEffect(() => {
    if (!confirm) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        resolveConfirm(null)
      }
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [confirm, resolveConfirm])

  return (
    <AnimatePresence>
      {confirm && (
        <motion.div
          className="absolute inset-0 z-[80] flex items-center justify-center bg-black/45 px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) resolveConfirm(null)
          }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="stash-confirm-title"
            className="w-full max-w-[320px] rounded-[16px] border border-[var(--border)] bg-[var(--card)] p-4 shadow-[var(--hover-shadow)]"
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 420, damping: 30 }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <h3
              id="stash-confirm-title"
              className="text-[15px] font-semibold text-[var(--foreground)]"
            >
              {confirm.title}
            </h3>
            <p className="mt-2 text-[13px] leading-relaxed text-[var(--muted-foreground)]">
              {confirm.message}
            </p>

            {isPrompt && (
              <input
                ref={inputRef}
                value={promptValue}
                onChange={(e) => setPromptValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    resolveConfirm(promptValue.trim() || null)
                  }
                }}
                placeholder={confirm.promptPlaceholder}
                className="mt-3 h-10 w-full rounded-[10px] border border-[var(--border)] bg-[var(--bg)] px-3 text-[13px] text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
              />
            )}

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                className="h-9 rounded-full px-3.5 text-[13px] font-medium text-[var(--muted-foreground)] transition-colors hover:bg-[var(--pill)] hover:text-[var(--foreground)]"
                onClick={() => resolveConfirm(null)}
              >
                {confirm.cancelLabel ?? t.cancel}
              </button>
              <button
                type="button"
                className={cn(
                  'h-9 rounded-full px-3.5 text-[13px] font-medium text-white transition-opacity hover:opacity-90',
                  confirm.danger ? 'bg-[var(--destructive)]' : 'bg-[var(--accent)]'
                )}
                onClick={() =>
                  resolveConfirm(isPrompt ? promptValue.trim() || null : true)
                }
              >
                {confirm.confirmLabel ?? t.confirm}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
