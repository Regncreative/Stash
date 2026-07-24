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
