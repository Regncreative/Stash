import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Header } from './components/header'
import { ShelfBar } from './components/shelf-bar'
import { FileList } from './components/file-list'
import { DropZone } from './components/drop-zone'
import { ContextMenu } from './components/context-menu'
import { Toast } from './components/toast'
import { SettingsPanel } from './components/settings-panel'
import { useStashStore } from './stores/stash-store'
import { tr } from './lib/i18n'

export default function App() {
  const ready = useStashStore((s) => s.ready)
  const init = useStashStore((s) => s.init)
  const refresh = useStashStore((s) => s.refresh)
  const showSettings = useStashStore((s) => s.showSettings)
  const setShowSettings = useStashStore((s) => s.setShowSettings)
  const setTheme = useStashStore((s) => s.setTheme)
  const showToast = useStashStore((s) => s.showToast)

  useEffect(() => {
    void init()
  }, [init])

  useEffect(() => {
    const unsubAdded = window.stash.onFilesAdded((result) => {
      void refresh()
      if (result.added > 0) {
        showToast(tr.filesAdded(result.added, result.shelfName))
      }
    })
    const unsubTheme = window.stash.onThemeChanged((theme) => {
      const mode = useStashStore.getState().settings?.theme
      if (mode === 'system' || !mode) {
        setTheme(theme)
      }
    })
    const unsubNav = window.stash.onNavigateSettings(() => setShowSettings(true))
    return () => {
      unsubAdded()
      unsubTheme()
      unsubNav()
    }
  }, [refresh, setShowSettings, setTheme, showToast])

  if (!ready) {
    return (
      <div className="app-shell flex items-center justify-center">
        <div className="h-5 w-5 animate-pulse rounded-full bg-[var(--accent)] opacity-70" />
      </div>
    )
  }

  return (
    <motion.div
      className="app-shell relative"
      initial={{ opacity: 0, y: 18, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
    >
      <DropZone>
        <Header />
        {showSettings ? (
          <SettingsPanel />
        ) : (
          <>
            <ShelfBar />
            <FileList />
          </>
        )}
        <ContextMenu />
        <Toast />
      </DropZone>
    </motion.div>
  )
}
