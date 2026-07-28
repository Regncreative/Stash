/**
 * Stamp Stash name + icon onto the local electron.exe used by `npm run dev`.
 * Packaged builds get the same branding via electron-builder (rcedit).
 */
const path = require('path')
const fs = require('fs')
const { rcedit } = require('rcedit')

async function main() {
  const root = path.join(__dirname, '..')
  const exe = path.join(root, 'node_modules', 'electron', 'dist', 'electron.exe')
  const icon = path.join(root, 'resources', 'icon.ico')
  if (!fs.existsSync(exe) || !fs.existsSync(icon)) {
    console.warn('[brand-electron] skip — electron.exe or icon.ico missing')
    return
  }

  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'))
  const version = pkg.version || '0.0.0'

  await rcedit(exe, {
    icon,
    'version-string': {
      CompanyName: 'Regncreative',
      FileDescription: 'Stash',
      ProductName: 'Stash',
      LegalCopyright: 'Copyright © Regncreative',
      OriginalFilename: 'Stash.exe',
      InternalName: 'Stash'
    },
    'file-version': version,
    'product-version': version
  })
  console.log('[brand-electron] stamped Stash branding onto electron.exe')
}

main().catch((err) => {
  // Windows may lock electron.exe while the app is running — don't fail install.
  console.warn('[brand-electron] skipped:', err?.message || err)
})
