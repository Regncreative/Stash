import { Plus } from 'lucide-react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ShelfIcon } from './file-icon'
import { useStashStore } from '@/stores/stash-store'
import { cn } from '@/lib/utils'
import { tr } from '@/lib/i18n'

export function ShelfBar() {
  const shelves = useStashStore((s) => s.shelves)
  const activeShelfId = useStashStore((s) => s.activeShelfId)
  const setActiveShelf = useStashStore((s) => s.setActiveShelf)
  const refresh = useStashStore((s) => s.refresh)
  const files = useStashStore((s) => s.files)
  const [creating, setCreating] = useState(false)
  const [name, setName] = useState('')

  const countFor = (id: string) => files.filter((f) => f.shelfId === id).length

  const create = async () => {
    const trimmed = name.trim()
    if (!trimmed) {
      setCreating(false)
      return
    }
    const shelf = await window.stash.createShelf({ name: trimmed, icon: 'folder' })
    setName('')
    setCreating(false)
    await refresh()
    setActiveShelf(shelf.id)
  }

  return (
    <div className="shrink-0 px-6 pb-3">
      <div className="flex items-center gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {shelves.map((shelf) => {
          const active = activeShelfId === shelf.id
          return (
            <motion.button
              key={shelf.id}
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15 }}
              onClick={() => setActiveShelf(shelf.id)}
              onContextMenu={async (e) => {
                e.preventDefault()
                const next = window.prompt(tr.renameShelf, shelf.name)
                if (next && next.trim() && next.trim() !== shelf.name) {
                  await window.stash.renameShelf(shelf.id, next.trim())
                  await refresh()
                }
              }}
              className={cn(
                'flex h-10 shrink-0 items-center gap-2 rounded-full px-4 text-[13px] font-medium transition-colors duration-150',
                active
                  ? 'bg-[var(--accent)] text-white shadow-[var(--accent-glow)]'
                  : 'bg-[var(--pill)] text-[var(--muted-foreground)] hover:bg-[var(--pill-hover)] hover:text-[var(--foreground)]'
              )}
            >
              <ShelfIcon
                name={shelf.icon}
                className="h-[16px] w-[16px]"
                color={active ? '#ffffff' : 'var(--muted-foreground)'}
              />
              <span className="max-w-[100px] truncate">{shelf.name}</span>
              <span
                className={cn(
                  'tabular-nums',
                  active ? 'text-white/85' : 'text-[var(--muted-foreground)]'
                )}
              >
                {countFor(shelf.id)}
              </span>
            </motion.button>
          )
        })}

        {creating ? (
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') void create()
              if (e.key === 'Escape') {
                setCreating(false)
                setName('')
              }
            }}
            onBlur={() => void create()}
            placeholder={tr.shelfName}
            className="h-10 w-[110px] shrink-0 rounded-full border border-[var(--border)] bg-[var(--pill)] px-3 text-[13px] text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
          />
        ) : (
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--pill)] text-[var(--muted-foreground)] transition-colors duration-150 hover:bg-[var(--pill-hover)] hover:text-[var(--foreground)]"
            aria-label={tr.createShelf}
            onClick={() => setCreating(true)}
          >
            <Plus size={18} strokeWidth={1.75} />
          </motion.button>
        )}
      </div>
    </div>
  )
}
