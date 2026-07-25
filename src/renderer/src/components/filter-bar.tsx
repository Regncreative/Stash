import type { FileFilter } from '@shared/types'
import { useStashStore } from '@/stores/stash-store'
import { cn } from '@/lib/utils'
import { useT } from '@/lib/i18n'

export function FilterBar() {
  const t = useT()
  const filter = useStashStore((s) => s.filter)
  const setFilter = useStashStore((s) => s.setFilter)

  const filters: { id: FileFilter; label: string }[] = [
    { id: 'all', label: t.filterAll },
    { id: 'images', label: t.filterImages },
    { id: 'videos', label: t.filterVideos },
    { id: 'pdf', label: t.filterPdf },
    { id: 'office', label: t.filterOffice },
    { id: 'folders', label: t.filterFolders },
    { id: 'archives', label: t.filterArchives },
    { id: 'code', label: t.filterCode },
    { id: 'audio', label: t.filterAudio }
  ]

  return (
    <div className="shrink-0 px-6 pb-2.5">
      <div className="flex flex-nowrap items-center gap-1 overflow-hidden">
        {filters.map((f) => {
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
                  : 'bg-transparent text-[var(--muted-foreground)] hover:bg-[var(--pill)] hover:text-[var(--foreground)]'
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
