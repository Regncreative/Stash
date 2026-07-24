import { Rectangle } from 'electron'
import {
  BrowserWindow,
  screen,
  nativeTheme,
  app,
  ipcMain
} from 'electron'
import { join } from 'path'
import { IpcChannels } from '../shared/ipc'

const PANEL_WIDTH = 420
const PANEL_HEIGHT = 650

let panelWindow: BrowserWindow | null = null
let isPinned = false

export function setQuitting(_value: boolean): void {
  // Kept for callers; panel no longer auto-hides on blur.
}

export function getPanelWindow(): BrowserWindow | null {
  return panelWindow
}

export function isPanelPinned(): boolean {
  return isPinned
}

export function createPanelWindow(): BrowserWindow {
  panelWindow = new BrowserWindow({
    width: PANEL_WIDTH,
    height: PANEL_HEIGHT,
    show: false,
    frame: false,
    resizable: false,
    maximizable: false,
    minimizable: false,
    fullscreenable: false,
    skipTaskbar: true,
    alwaysOnTop: true,
    transparent: true,
    hasShadow: false,
    roundedCorners: false,
    backgroundColor: '#00000000',
    thickFrame: false,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      spellcheck: false,
      backgroundThrottling: false
    }
  })

  panelWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })

  if (process.env.ELECTRON_RENDERER_URL) {
    panelWindow.loadURL(process.env.ELECTRON_RENDERER_URL)
  } else {
    panelWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  // Panel stays open until closed via X button or tray icon toggle.

  panelWindow.on('closed', () => {
    panelWindow = null
  })

  panelWindow.webContents.on('will-navigate', (e) => e.preventDefault())

  return panelWindow
}

export function positionPanelNearTray(trayBounds?: Rectangle): void {
  if (!panelWindow) return

  // Anchor to the display that hosts the tray/cursor.
  const anchorPoint =
    trayBounds && trayBounds.width > 0
      ? { x: Math.round(trayBounds.x + trayBounds.width / 2), y: trayBounds.y }
      : screen.getCursorScreenPoint()
  const display = screen.getDisplayNearestPoint(anchorPoint)
  const workArea = display.workArea
  // The window has a 12px transparent gutter for the CSS shadow,
  // so 0 here still leaves ~12px of visual breathing room.
  const margin = 0

  // Detect taskbar edge from the difference between full bounds and work area.
  const bounds = display.bounds
  const taskbarBottom = workArea.y + workArea.height < bounds.y + bounds.height
  const taskbarTop = workArea.y > bounds.y

  let x: number
  let y: number

  // Horizontal: follow the tray icon, otherwise hug the right corner (PC Manager style).
  if (trayBounds && trayBounds.width > 0) {
    x = Math.round(trayBounds.x + trayBounds.width / 2 - PANEL_WIDTH / 2)
  } else {
    x = workArea.x + workArea.width - PANEL_WIDTH - margin
  }

  // Vertical: always flush against the taskbar edge — no floating gap.
  if (taskbarTop) {
    y = workArea.y + margin
  } else {
    // Bottom taskbar (default) or side taskbar → sit just above the work area bottom.
    void taskbarBottom
    y = workArea.y + workArea.height - PANEL_HEIGHT - margin
  }

  // Clamp inside the work area so it never spills off-screen.
  x = Math.max(workArea.x + margin, Math.min(x, workArea.x + workArea.width - PANEL_WIDTH - margin))
  y = Math.max(workArea.y + margin, Math.min(y, workArea.y + workArea.height - PANEL_HEIGHT - margin))

  panelWindow.setPosition(x, y, false)
}

export function showPanel(trayBounds?: Rectangle): void {
  if (!panelWindow) {
    createPanelWindow()
  }
  if (!panelWindow) return

  positionPanelNearTray(trayBounds)
  panelWindow.setAlwaysOnTop(true, 'pop-up-menu')
  panelWindow.show()
  panelWindow.focus()
}

export function hidePanel(): void {
  panelWindow?.hide()
}

export function togglePanel(trayBounds?: Rectangle): void {
  if (panelWindow?.isVisible()) {
    hidePanel()
  } else {
    showPanel(trayBounds)
  }
}

export function setPinned(pinned: boolean): void {
  isPinned = pinned
  if (panelWindow) {
    panelWindow.setAlwaysOnTop(pinned || true, pinned ? 'floating' : 'pop-up-menu')
  }
}

export function registerWindowIpc(): void {
  ipcMain.handle(IpcChannels.WINDOW_HIDE, () => {
    hidePanel()
  })

  ipcMain.handle(IpcChannels.WINDOW_PIN, (_e, pinned: boolean) => {
    setPinned(pinned)
    return isPinned
  })

  ipcMain.handle(IpcChannels.WINDOW_IS_PINNED, () => isPinned)

  ipcMain.handle(IpcChannels.THEME_GET, () => {
    return nativeTheme.shouldUseDarkColors ? 'dark' : 'light'
  })

  nativeTheme.on('updated', () => {
    panelWindow?.webContents.send(
      IpcChannels.THEME_CHANGED,
      nativeTheme.shouldUseDarkColors ? 'dark' : 'light'
    )
  })
}

export function isDev(): boolean {
  return !app.isPackaged
}
