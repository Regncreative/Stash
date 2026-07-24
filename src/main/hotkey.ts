import { globalShortcut } from 'electron'
import { getTray } from './tray'
import { togglePanel } from './window'

let currentHotkey = 'CommandOrControl+Shift+Space'

export function reregisterHotkey(accelerator: string): void {
  try {
    globalShortcut.unregisterAll()
  } catch {
    // ignore
  }
  currentHotkey = accelerator
  const ok = globalShortcut.register(accelerator, () => {
    togglePanel(getTray()?.getBounds())
  })
  if (!ok) {
    console.warn('Failed to register hotkey:', accelerator)
  }
}

export function getCurrentHotkey(): string {
  return currentHotkey
}

export function unregisterHotkeys(): void {
  try {
    globalShortcut.unregisterAll()
  } catch {
    // ignore
  }
}
