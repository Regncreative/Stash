import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useStashStore } from '@/stores/stash-store'

export function Toast() {
  const toast = useStashStore((s) => s.toast)
  const clearToast = useStashStore((s) => s.clearToast)

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(clearToast, 2800)
    return () => clearTimeout(t)
  }, [toast, clearToast])

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, y: 12, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 420, damping: 32 }}
          className="pointer-events-none absolute bottom-24 left-5 right-5 z-50"
          role="status"
        >
          <div className="mx-auto w-fit max-w-full rounded-[14px] border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-center text-[13px] leading-snug text-[var(--foreground)] shadow-[var(--hover-shadow)]">
            <span className="block whitespace-normal break-words">{toast.message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
