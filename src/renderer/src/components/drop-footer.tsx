import { Upload } from 'lucide-react'
import { useStashStore } from '@/stores/stash-store'
import { cn } from '@/lib/utils'
import { tr } from '@/lib/i18n'

export function DropFooter() {
  const dropActive = useStashStore((s) => s.dropActive)

  return (
    <div className="shrink-0 px-6 pb-5 pt-2">
      <div
        className={cn(
          'flex items-center justify-center gap-2.5 rounded-[14px] border border-dashed px-4 py-3.5 transition-all duration-150',
          dropActive
            ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]'
            : 'border-[var(--drop-border)] bg-[var(--drop-bg)] text-[var(--muted-foreground)]'
        )}
      >
        <Upload size={18} strokeWidth={1.75} className="shrink-0" />
        <p className="text-[13px] font-medium leading-none">
          {dropActive ? tr.releaseToStash : tr.dropHere}
        </p>
      </div>
    </div>
  )
}
