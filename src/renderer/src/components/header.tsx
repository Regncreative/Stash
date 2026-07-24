import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Settings, X } from 'lucide-react'
import { useStashStore } from '@/stores/stash-store'
import { formatBytes } from '@/lib/format'
import { cn } from '@/lib/utils'
import { tr } from '@/lib/i18n'

export function Header() {
  const searchQuery = useStashStore((s) => s.searchQuery)
  const setSearch = useStashStore((s) => s.setSearch)
  const stats = useStashStore((s) => s.stats)
  const setShowSettings = useStashStore((s) => s.setShowSettings)
  const showSettings = useStashStore((s) => s.showSettings)
  const [searchOpen, setSearchOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus()
  }, [searchOpen])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (searchOpen || searchQuery) {
          setSearchOpen(false)
          setSearch('')
        } else if (showSettings) {
          setShowSettings(false)
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [searchQuery, searchOpen, showSettings, setSearch, setShowSettings])

  return (
    <header className="z-30 shrink-0 px-6 pb-3 pt-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px]"
            style={{ background: 'linear-gradient(145deg, #3b82f6 0%, #2563eb 100%)' }}
            aria-hidden
          >
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
              <rect x="2.5" y="3" width="11" height="2.2" rx="0.7" fill="white" />
              <rect x="2.5" y="6.9" width="11" height="2.2" rx="0.7" fill="white" opacity="0.8" />
              <rect x="2.5" y="10.8" width="8" height="2.2" rx="0.7" fill="white" opacity="0.55" />
            </svg>
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-[22px] font-semibold leading-none tracking-[-0.02em] text-[var(--foreground)]">
              Stash
            </h1>
            <p className="mt-1.5 truncate text-[13px] font-normal leading-none text-[var(--muted-foreground)]">
              {stats.shelfCount} {tr.shelvesCap} · {stats.fileCount} {tr.filesCap} ·{' '}
              {formatBytes(stats.totalSize)}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-0.5">
          <button
            type="button"
            className={cn('icon-btn', (searchOpen || searchQuery) && 'active')}
            aria-label={tr.search}
            onClick={() => setSearchOpen((v) => !v)}
          >
            <Search size={18} strokeWidth={1.75} />
          </button>
          <button
            type="button"
            className={cn('icon-btn', showSettings && 'active')}
            aria-label={tr.settings}
            aria-pressed={showSettings}
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings size={18} strokeWidth={1.75} />
          </button>
          <button
            type="button"
            className="icon-btn"
            aria-label={tr.close}
            onClick={() => void window.stash.hideWindow()}
          >
            <X size={18} strokeWidth={1.75} />
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            <div className="relative">
              <Search
                size={15}
                strokeWidth={1.75}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]"
              />
              <input
                ref={inputRef}
                value={searchQuery}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={tr.searchPlaceholder}
                aria-label={tr.search}
                className="h-9 w-full rounded-[10px] border border-[var(--border)] bg-[var(--pill)] pl-9 pr-9 text-[13px] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] transition duration-150 focus:border-[var(--accent)]"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                  onClick={() => setSearch('')}
                  aria-label={tr.clearSearch}
                >
                  <X size={14} strokeWidth={1.75} />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
