import { app } from 'electron'

/**
 * Start with Windows using Electron's login item API.
 */
export function isAutoLaunchEnabled(): boolean {
  return app.getLoginItemSettings().openAtLogin
}

export function setAutoLaunch(enabled: boolean): void {
  if (!app.isPackaged) {
    app.setLoginItemSettings({
      openAtLogin: enabled,
      openAsHidden: true,
      path: process.execPath,
      args: [app.getAppPath()]
    })
    return
  }

  app.setLoginItemSettings({
    openAtLogin: enabled,
    openAsHidden: true
  })
}

export function syncAutoLaunch(enabled: boolean): void {
  if (isAutoLaunchEnabled() !== enabled) {
    setAutoLaunch(enabled)
  }
}
