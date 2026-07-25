import { app, Notification } from 'electron'
import { autoUpdater, type UpdateInfo } from 'electron-updater'
import { getPanelWindow } from './window'
import { IpcChannels } from '../shared/ipc'
import { getSettings } from './database'
import { getMessages } from '../shared/i18n'
import type { UpdateStatus } from '../shared/types'

let lastStatus: UpdateStatus = { state: 'idle' }
let initialized = false

function broadcast(status: UpdateStatus): void {
  lastStatus = status
  const win = getPanelWindow()
  win?.webContents.send(IpcChannels.UPDATE_STATUS, status)
}

function notify(title: string, body: string): void {
  if (!Notification.isSupported()) return
  if (!getSettings().notifications) return
  new Notification({ title, body }).show()
}

/** Wire electron-updater. No-op in development (dev has nothing to update from). */
export function initUpdater(): void {
  if (initialized) return
  initialized = true

  if (!app.isPackaged) {
    lastStatus = { state: 'dev' }
    return
  }

  autoUpdater.autoDownload = true
  autoUpdater.autoInstallOnAppQuit = true

  autoUpdater.on('checking-for-update', () => {
    broadcast({ state: 'checking' })
  })

  autoUpdater.on('update-available', (info: UpdateInfo) => {
    broadcast({ state: 'available', version: info.version })
    const t = getMessages(getSettings().language)
    notify(t.updateNotifyTitle, t.updateNotifyBody(info.version))
  })

  autoUpdater.on('update-not-available', (info: UpdateInfo) => {
    broadcast({ state: 'not-available', version: info.version })
  })

  autoUpdater.on('download-progress', (p) => {
    broadcast({ state: 'downloading', percent: Math.round(p.percent) })
  })

  autoUpdater.on('update-downloaded', (info: UpdateInfo) => {
    broadcast({ state: 'downloaded', version: info.version })
    const t = getMessages(getSettings().language)
    notify(t.updateReadyNotifyTitle, t.updateReadyNotifyBody(info.version))
  })

  autoUpdater.on('error', (err) => {
    const message = err?.message || String(err)
    broadcast({ state: 'error', message })
    console.error('[stash] updater error', err)
  })

  // Quiet check a bit after launch so startup stays snappy.
  setTimeout(() => {
    void checkForUpdates(false)
  }, 8_000)
}

export function getUpdateStatus(): UpdateStatus {
  return lastStatus
}

/** Manual or automatic update check. */
export async function checkForUpdates(manual: boolean): Promise<UpdateStatus> {
  if (!app.isPackaged) {
    const status: UpdateStatus = { state: 'dev' }
    broadcast(status)
    return status
  }

  try {
    const result = await autoUpdater.checkForUpdates()
    const t = getMessages(getSettings().language)
    if (!result) {
      const status: UpdateStatus = { state: 'error', message: t.updateError }
      broadcast(status)
      return status
    }
    // Events will refine status; return current snapshot.
    if (manual && lastStatus.state === 'not-available') {
      notify('Stash', t.updateUpToDateNotify(app.getVersion()))
    }
    return lastStatus
  } catch (err) {
    const t = getMessages(getSettings().language)
    const message = err instanceof Error ? err.message : String(err)
    const status: UpdateStatus = { state: 'error', message }
    broadcast(status)
    if (manual) notify(t.updateError, message)
    return status
  }
}

/** Install downloaded update and relaunch. */
export function installUpdateNow(): void {
  if (!app.isPackaged) return
  autoUpdater.quitAndInstall(false, true)
}
