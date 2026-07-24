import { useEffect, useRef } from 'react'
import {
  Copy,
  ExternalLink,
  FolderOpen,
  Info,
  Pin,
  PinOff,
  Trash2,
  FolderInput
} from 'lucide-react'
import { useStashStore } from '@/stores/stash-store'
import { cn } from '@/lib/utils'
import { tr } from '@/lib/i18n'

export function ContextMenu() {
  const contextMenu = useStashStore((s) => s.contextMenu)
  const closeContextMenu = useStashStore((s) => s.closeContextMenu)
  const shelves = useStashStore((s) => s.shelves)
  const files = useStashStore((s) => s.files)
  const refresh = useStashStore((s) => s.refresh)
  const showToast = useStashStore((s) => s.showToast)
  const ref = useRef<HTMLDivElement>(null)

  const file = files.find((f) => f.id === contextMenu?.fileId)

  useEffect(() => {
    if (!contextMenu) return
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        closeContextMenu()
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeContextMenu()
    }
    window.addEventListener('mousedown', onDown)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('keydown', onKey)
    }
  }, [contextMenu, closeContextMenu])

  if (!contextMenu || !file) return null

  const run = async (fn: () => Promise<void>) => {
    closeContextMenu()
    await fn()
  }

  const items: {
    label: string
    icon: typeof ExternalLink
    danger?: boolean
    action: () => Promise<void>
  }[] = [
    {
      label: tr.open,
      icon: ExternalLink,
      action: async () => {
        const res = await window.stash.openFile(file.id)
        if (!res.ok) {
          showToast(res.error === 'missing' ? tr.fileNotFound : tr.couldNotOpen)
        }
      }
    },
    {
      label: tr.reveal,
      icon: FolderOpen,
      action: async () => {
        const res = await window.stash.revealFile(file.id)
        if (!res.ok) showToast(tr.fileNotFound)
      }
    },
    {
      label: tr.copyPath,
      icon: Copy,
      action: async () => {
        await window.stash.copyPath(file.id)
        showToast(tr.pathCopied)
      }
    },
    {
      label: file.isPinned ? tr.unpin : tr.pin,
      icon: file.isPinned ? PinOff : Pin,
      action: async () => {
        await window.stash.pinFile(file.id, !file.isPinned)
        await refresh()
      }
    },
    {
      label: tr.properties,
      icon: Info,
      action: async () => {
        const res = await window.stash.getProperties(file.id)
        if (!res.ok) showToast(tr.missingOnDisk)
      }
    },
    {
      label: tr.removeFromShelf,
      icon: Trash2,
      danger: true,
      action: async () => {
        await window.stash.removeFile(file.id)
        await refresh()
        showToast(tr.removedKept)
      }
    }
  ]

  const menuW = 220
  const menuH = 300
  const x = Math.min(contextMenu.x, window.innerWidth - menuW - 8)
  const y = Math.min(contextMenu.y, window.innerHeight - menuH - 8)

  return (
    <div
      ref={ref}
      className="fixed z-50 min-w-[220px] overflow-hidden rounded-[12px] border border-[var(--border)] bg-[var(--card)]"
      style={{ left: x, top: y, boxShadow: 'var(--hover-shadow)' }}
      role="menu"
    >
      <div className="py-1">
        {items.map((item) => (
          <button
            key={item.label}
            type="button"
            role="menuitem"
            onClick={() => void run(item.action)}
            className={cn(
              'flex w-full items-center gap-2.5 px-3 py-1.5 text-left text-[13px] transition-colors',
              'hover:bg-[var(--pill)]',
              item.danger && 'text-[var(--destructive)]'
            )}
          >
            <item.icon className="h-3.5 w-3.5 opacity-70" strokeWidth={1.75} />
            {item.label}
          </button>
        ))}

        {shelves.length > 1 && (
          <>
            <div className="my-1 border-t border-[var(--border)]" />
            <div className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
              {tr.moveToShelf}
            </div>
            {shelves
              .filter((s) => s.id !== file.shelfId)
              .map((shelf) => (
                <button
                  key={shelf.id}
                  type="button"
                  role="menuitem"
                  onClick={() =>
                    void run(async () => {
                      await window.stash.moveFile(file.id, shelf.id)
                      await refresh()
                      showToast(tr.movedTo(shelf.name))
                    })
                  }
                  className="flex w-full items-center gap-2.5 px-3 py-1.5 text-left text-[13px] hover:bg-[var(--pill)]"
                >
                  <FolderInput className="h-3.5 w-3.5 opacity-70" strokeWidth={1.75} />
                  <span className="truncate">{shelf.name}</span>
                </button>
              ))}
          </>
        )}
      </div>
    </div>
  )
}
