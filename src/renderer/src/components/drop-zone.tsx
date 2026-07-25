import type { ReactNode } from 'react'
import { useEffect, useRef } from 'react'
import { useStashStore } from '@/stores/stash-store'
import { cn } from '@/lib/utils'
import { useT } from '@/lib/i18n'

interface DropZoneProps {
  children: ReactNode
}

export function DropZone({ children }: DropZoneProps) {
  const t = useT()
  const setDropActive = useStashStore((s) => s.setDropActive)
  const dropActive = useStashStore((s) => s.dropActive)
  const activeShelfId = useStashStore((s) => s.activeShelfId)
  const settings = useStashStore((s) => s.settings)
  const refresh = useStashStore((s) => s.refresh)
  const showToast = useStashStore((s) => s.showToast)
  const dragCounter = useRef(0)

  useEffect(() => {
    const onDragEnter = (e: DragEvent) => {
      e.preventDefault()
      // Ignore our own outbound native file drags
      if (document.body.dataset.stashDragging === '1') return
      dragCounter.current++
      if (e.dataTransfer?.types.includes('Files')) {
        setDropActive(true)
      }
    }
    const onDragLeave = (e: DragEvent) => {
      e.preventDefault()
      dragCounter.current--
      if (dragCounter.current <= 0) {
        dragCounter.current = 0
        setDropActive(false)
      }
    }
    const onDragOver = (e: DragEvent) => {
      if (document.body.dataset.stashDragging === '1') return
      e.preventDefault()
      if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy'
    }
    const onDrop = async (e: DragEvent) => {
      e.preventDefault()
      dragCounter.current = 0
      setDropActive(false)
      if (document.body.dataset.stashDragging === '1') return

      const fileList = e.dataTransfer?.files
      if (!fileList || fileList.length === 0) return

      const paths: string[] = []
      for (let i = 0; i < fileList.length; i++) {
        const f = fileList.item(i)
        if (!f) continue
        try {
          const p = window.stash.getPathForFile(f)
          if (p) paths.push(p)
        } catch {
          // skip
        }
      }

      if (paths.length === 0) return

      const shelfId = activeShelfId || settings?.defaultShelfId
      const result = await window.stash.addFiles(paths, shelfId)
      await refresh()
      if (result.added > 0) {
        showToast(t.filesAdded(result.added, result.shelfName))
      } else if (result.skipped > 0) {
        showToast(t.alreadyOnShelf)
      }
    }

    window.addEventListener('dragenter', onDragEnter)
    window.addEventListener('dragleave', onDragLeave)
    window.addEventListener('dragover', onDragOver)
    window.addEventListener('drop', onDrop)
    return () => {
      window.removeEventListener('dragenter', onDragEnter)
      window.removeEventListener('dragleave', onDragLeave)
      window.removeEventListener('dragover', onDragOver)
      window.removeEventListener('drop', onDrop)
    }
  }, [activeShelfId, settings, refresh, setDropActive, showToast, t])

  return (
    <div className={cn('relative flex h-full min-h-0 flex-col', dropActive && 'drop-active')}>
      {children}
    </div>
  )
}
