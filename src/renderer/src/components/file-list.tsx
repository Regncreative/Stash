import { useMemo, useRef, useState, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Package } from 'lucide-react'
import { FileCard } from './file-card'
import { DropFooter } from './drop-footer'
import { useStashStore } from '@/stores/stash-store'
import { cn } from '@/lib/utils'
import { useT } from '@/lib/i18n'

/** Card ~72px + 8px gap */
const ITEM_HEIGHT = 80
const OVERSCAN = 5

export function FileList() {
  const t = useT()
  const getVisibleFiles = useStashStore((s) => s.getVisibleFiles)
  const files = useStashStore((s) => s.files)
  const searchQuery = useStashStore((s) => s.searchQuery)
  const filter = useStashStore((s) => s.filter)
  const activeShelfId = useStashStore((s) => s.activeShelfId)
  const dropActive = useStashStore((s) => s.dropActive)
  const fileSort = useStashStore((s) => s.settings?.fileSort)

  const visible = useMemo(
    () => getVisibleFiles(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [files, searchQuery, filter, activeShelfId, fileSort, getVisibleFiles]
  )

  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollTop, setScrollTop] = useState(0)
  const [height, setHeight] = useState(400)
  const [scrolling, setScrolling] = useState(false)
  const scrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver((entries) => {
      setHeight(entries[0]?.contentRect.height ?? 400)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0
      setScrollTop(0)
    }
  }, [activeShelfId, filter, searchQuery])

  const onScroll = useCallback(() => {
    setScrollTop(containerRef.current?.scrollTop ?? 0)
    setScrolling(true)
    if (scrollTimer.current) clearTimeout(scrollTimer.current)
    scrollTimer.current = setTimeout(() => setScrolling(false), 700)
  }, [])

  const totalHeight = visible.length * ITEM_HEIGHT
  const startIndex = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT) - OVERSCAN)
  const endIndex = Math.min(
    visible.length,
    Math.ceil((scrollTop + height) / ITEM_HEIGHT) + OVERSCAN
  )
  const slice = visible.slice(startIndex, endIndex)

  if (visible.length === 0) {
    return (
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex flex-1 flex-col items-center px-8 pt-10">
          <motion.div
            key={`${activeShelfId}-${filter}-${searchQuery}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center text-center"
          >
            <div
              className={cn(
                'mb-3.5 flex h-14 w-14 items-center justify-center rounded-[16px] transition-colors duration-150',
                dropActive ? 'bg-[var(--accent-soft)]' : 'bg-[var(--pill)]'
              )}
            >
              <Package
                size={26}
                strokeWidth={1.5}
                className={dropActive ? 'text-[var(--accent)]' : 'text-[var(--muted-foreground)]'}
              />
            </div>
            <p className="text-[15px] font-semibold text-[var(--foreground)]">
              {searchQuery || filter !== 'all' ? t.noMatch : t.emptyTitle}
            </p>
            <p className="mt-2 max-w-[220px] text-[13px] leading-snug text-[var(--muted-foreground)]">
              {searchQuery || filter !== 'all' ? t.trySearch : t.emptyHint}
            </p>
          </motion.div>
        </div>
        <DropFooter />
      </div>
    )
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <motion.div
        key={activeShelfId ?? 'all'}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
        ref={containerRef}
        onScroll={onScroll}
        className={cn(
          'scroll-autohide min-h-0 flex-1 overflow-y-auto overflow-x-hidden',
          scrolling && 'is-scrolling'
        )}
        role="list"
        aria-label="Stashed files"
      >
        <div style={{ height: totalHeight, position: 'relative' }}>
          <AnimatePresence initial={false}>
            {slice.map((file, i) => {
              const index = startIndex + i
              return (
                <div
                  key={file.id}
                  style={{
                    position: 'absolute',
                    top: index * ITEM_HEIGHT,
                    left: 0,
                    right: 0,
                    height: ITEM_HEIGHT
                  }}
                >
                  <FileCard file={file} index={index} />
                </div>
              )
            })}
          </AnimatePresence>
        </div>
      </motion.div>
      <DropFooter />
    </div>
  )
}
