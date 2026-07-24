import type { FileFilter } from '@shared/types'
import { useStashStore } from '@/stores/stash-store'
import { cn } from '@/lib/utils'

/** Compact single-row filters — no horizontal scrollbar */
const FILTERS: { id: FileFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'images', label: 'Images' },
  { id: 'videos', label: 'Videos' },
  { id: 'pdf', label: 'PDF' },
  { id: 'office', label: 'Office' },
  { id: 'folders', label: 'Folders' },
  { id: 'archives', label: 'Zips' },
  { id: 'code', label: 'Code' },
  { id: 'audio', label: 'Audio' }
]

export function FilterBar() {
  const filter = useStashStore((s) => s.filter)
  const setFilter = useStashStore((s) => s.setFilter)

  return (
    <div className="shrink-0 px-6 pb-2.5">
      <div className="flex flex-nowrap items-center gap-1 overflow-hidden">
        {FILTERS.map((f) => {
          const active = filter === f.id
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={cn(
                'shrink-0 rounded-full px-2.5 py-[5px] text-[11px] font-medium transition-all duration-150',
                active
                  ? 'bg-[#2563EB] text-white'
                  : 'bg-transparent text-[#9CA3AF] hover:bg-[var(--pill)] hover:text-white'
              )}
            >
              {f.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
