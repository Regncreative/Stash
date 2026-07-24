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
          initial={{ opacity: 0, y: 14, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="pointer-events-none absolute bottom-[88px] left-1/2 z-50 max-w-[88%] -translate-x-1/2 truncate rounded-[12px] border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-[13px] text-[var(--foreground)] shadow-[var(--hover-shadow)]"
          role="status"
        >
          {toast.message}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
