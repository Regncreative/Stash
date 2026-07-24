import { create } from 'zustand'
import type {
  AppSettings,
  FileFilter,
  Shelf,
  ShelfStats,
  StashFile
} from '@shared/types'
import { matchesFilter } from '@shared/types'

interface StashState {
  ready: boolean
  shelves: Shelf[]
  files: StashFile[]
  stats: ShelfStats
  settings: AppSettings | null
  activeShelfId: string | null
  searchQuery: string
  filter: FileFilter
  pinned: boolean
  showSettings: boolean
  theme: 'light' | 'dark'
  toast: { message: string; id: number } | null
  contextMenu: {
    x: number
    y: number
    fileId: string
  } | null
  dropActive: boolean

  init: () => Promise<void>
  refresh: () => Promise<void>
  setActiveShelf: (id: string | null) => void
  setSearch: (q: string) => void
  setFilter: (f: FileFilter) => void
  setPinned: (p: boolean) => Promise<void>
  setShowSettings: (v: boolean) => void
  setTheme: (t: 'light' | 'dark') => void
  showToast: (message: string) => void
  clearToast: () => void
  openContextMenu: (x: number, y: number, fileId: string) => void
  closeContextMenu: () => void
  setDropActive: (v: boolean) => void
  updateSettings: (partial: Partial<AppSettings>) => Promise<void>
  getVisibleFiles: () => StashFile[]
}

export const useStashStore = create<StashState>((set, get) => ({
  ready: false,
  shelves: [],
  files: [],
  stats: { shelfCount: 0, fileCount: 0, totalSize: 0 },
  settings: null,
  activeShelfId: null,
  searchQuery: '',
  filter: 'all',
  pinned: false,
  showSettings: false,
  theme: 'dark',
  toast: null,
  contextMenu: null,
  dropActive: false,

  init: async () => {
    const [shelves, settings, systemTheme, pinned] = await Promise.all([
      window.stash.listShelves(),
      window.stash.getSettings(),
      window.stash.getSystemTheme(),
      window.stash.isPinned()
    ])

    const theme =
      settings.theme === 'system' ? systemTheme : (settings.theme as 'light' | 'dark')

    document.documentElement.style.setProperty('--accent', settings.accentColor)
    document.documentElement.classList.toggle('light', theme === 'light')
    document.documentElement.classList.toggle('dark', theme === 'dark')

    const activeShelfId = settings.defaultShelfId || shelves[0]?.id || null
    const [files, stats] = await Promise.all([
      window.stash.listFiles(null),
      window.stash.getStats()
    ])

    set({
      ready: true,
      shelves,
      files,
      stats,
      settings,
      activeShelfId,
      pinned,
      theme
    })
  },

  refresh: async () => {
    const [shelves, files, stats, settings] = await Promise.all([
      window.stash.listShelves(),
      window.stash.listFiles(null),
      window.stash.getStats(),
      window.stash.getSettings()
    ])
    set({ shelves, files, stats, settings })
  },

  setActiveShelf: (id) => set({ activeShelfId: id }),
  setSearch: (q) => set({ searchQuery: q }),
  setFilter: (f) => set({ filter: f }),

  setPinned: async (p) => {
    await window.stash.setPinned(p)
    set({ pinned: p })
  },

  setShowSettings: (v) => set({ showSettings: v }),
  setTheme: (t) => {
    document.documentElement.classList.toggle('light', t === 'light')
    document.documentElement.classList.toggle('dark', t === 'dark')
    set({ theme: t })
  },

  showToast: (message) => set({ toast: { message, id: Date.now() } }),
  clearToast: () => set({ toast: null }),

  openContextMenu: (x, y, fileId) => set({ contextMenu: { x, y, fileId } }),
  closeContextMenu: () => set({ contextMenu: null }),
  setDropActive: (v) => set({ dropActive: v }),

  updateSettings: async (partial) => {
    const next = await window.stash.setSettings(partial)
    set({ settings: next })
    if (partial.accentColor) {
      document.documentElement.style.setProperty('--accent', partial.accentColor)
    }
    if (partial.theme) {
      const systemTheme = await window.stash.getSystemTheme()
      const theme =
        partial.theme === 'system' ? systemTheme : (partial.theme as 'light' | 'dark')
      get().setTheme(theme)
    }
  },

  getVisibleFiles: () => {
    const { files, activeShelfId, searchQuery, filter } = get()
    let result = files

    if (activeShelfId) {
      result = result.filter((f) => f.shelfId === activeShelfId)
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.extension.toLowerCase().includes(q) ||
          f.absolutePath.toLowerCase().includes(q) ||
          (q === 'pinned' && f.isPinned)
      )
    }

    if (filter !== 'all') {
      result = result.filter((f) => matchesFilter(f, filter))
    }

    return result
  }
}))
