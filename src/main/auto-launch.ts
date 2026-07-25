import { app } from 'electron'

/**
 * Start with Windows using Electron's login item API.
 *
 * In development we never register a login item: Windows would list
 * node_modules/electron/dist/electron.exe as "Electron" / "GitHub, Inc."
 * with the default Electron icon. Packaged Stash.exe carries the real branding.
 */
export function isAutoLaunchEnabled(): boolean {
  if (!app.isPackaged) return false
  return app.getLoginItemSettings().openAtLogin
}

export function setAutoLaunch(enabled: boolean): void {
  if (!app.isPackaged) {
    // Clear any leftover Electron.exe startup entry from earlier dev sessions.
    app.setLoginItemSettings({
      openAtLogin: false,
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
  if (!app.isPackaged) {
    setAutoLaunch(false)
    return
  }
  if (isAutoLaunchEnabled() !== enabled) {
    setAutoLaunch(enabled)
  }
}
