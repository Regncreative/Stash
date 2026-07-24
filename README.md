# Stash

A modern file shelf for Windows — collect, organize and drag files from the system tray.

Designed to feel like a built-in Windows 11 feature (Fluent Design), not a typical Electron utility.

## Stack

- Electron + React + TypeScript + Vite (`electron-vite`)
- Tailwind CSS + Framer Motion + Zustand
- better-sqlite3
- electron-builder

## Project structure

```
src/
  main/           Electron main — tray, panel window, IPC, auto-launch
    database/     SQLite schema + queries
  preload/        contextBridge API (`window.stash`)
  renderer/       React UI (Fluent panel)
  shared/         Shared types + IPC channel names
resources/        Tray / app icons
```

## Development

```bash
npm install
npm run dev
```

The app starts silently in the system tray. Click the tray icon (or press `Ctrl+Shift+Space`) to open the panel.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development mode |
| `npm run build` | Production build (`out/`) |
| `npm run dist` | Build Windows installer (`release/`) |
| `npm run typecheck` | TypeScript check |
| `npm run lint` | ESLint |

## License

MIT

## Releases & auto-update

Packaged builds check [GitHub Releases](https://github.com/Regncreative/Stash/releases) for updates on launch and via tray / settings.

### Publish a new version

1. Bump `version` in `package.json` (e.g. `1.0.0` → `1.0.1`)
2. Create a [GitHub Personal Access Token](https://github.com/settings/tokens) with `repo` scope
3. In PowerShell:

```powershell
$env:GH_TOKEN = "ghp_..."
$env:CSC_IDENTITY_AUTO_DISCOVERY = "false"
# Prefer Temp output if Defender locks C:\Stash\release
# or add C:\Stash as a Defender exclusion, then:
npm run release
```

This builds the installer and uploads it to a GitHub Release. Other PCs with Stash installed will download it automatically.
