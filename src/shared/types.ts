/** Shared domain types for Stash */

export type ThemeMode = 'system' | 'light' | 'dark'
export type AppLanguage = 'tr' | 'en'
export type FileSort = 'added' | 'name' | 'recent' | 'size'

export type FileFilter =
  | 'all'
  | 'images'
  | 'videos'
  | 'archives'
  | 'folders'
  | 'pdf'
  | 'office'
  | 'executables'
  | 'code'
  | 'audio'
  | 'unknown'

export interface Shelf {
  id: string
  name: string
  icon: string
  color: string
  createdAt: number
  sortOrder: number
}

export interface StashFile {
  id: string
  shelfId: string
  absolutePath: string
  name: string
  extension: string
  size: number
  isDirectory: boolean
  createdAt: number
  addedAt: number
  lastAccessed: number | null
  isPinned: boolean
  exists: boolean
}

export interface AppSettings {
  theme: ThemeMode
  accentColor: string
  startWithWindows: boolean
  language: AppLanguage
  openHotkey: string
  defaultShelfId: string
  notifications: boolean
  /** How to order files within a shelf (pinned still first). */
  fileSort: FileSort
  /**
   * Panel opacity after idle timeout without mouse hover.
   * Clamped to 0.10–0.70 (shown as 10%–70% in settings).
   */
  idleOpacity: number
  /** Seconds without mouse activity before fading (5–60). */
  idleTimeoutSec: number
}

export interface ShelfStats {
  shelfCount: number
  fileCount: number
  totalSize: number
}

export interface AddFilesResult {
  added: number
  skipped: number
  shelfId: string
  shelfName: string
}

export interface FileProperties {
  file: StashFile
  exists: boolean
  modifiedAt: number | null
}

export type UpdateStatus =
  | { state: 'idle' }
  | { state: 'checking' }
  | { state: 'available'; version: string }
  | { state: 'not-available'; version: string }
  | { state: 'downloading'; percent: number }
  | { state: 'downloaded'; version: string }
  | { state: 'error'; message: string }
  | { state: 'dev' }

export const DEFAULT_SHELVES: Omit<Shelf, 'id' | 'createdAt'>[] = [
  { name: 'İş', icon: 'briefcase', color: '#2563EB', sortOrder: 0 },
  { name: 'Kişisel', icon: 'heart', color: '#E74856', sortOrder: 1 },
  { name: 'Geçici', icon: 'clock', color: '#64748B', sortOrder: 2 }
]

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  accentColor: '#2563EB',
  startWithWindows: true,
  language: 'tr',
  openHotkey: 'CommandOrControl+Shift+Space',
  defaultShelfId: '',
  notifications: true,
  fileSort: 'added',
  idleOpacity: 0.4,
  idleTimeoutSec: 10
}

export const IMAGE_EXTS = new Set([
  'png',
  'jpg',
  'jpeg',
  'gif',
  'webp',
  'bmp',
  'ico',
  'svg',
  'tiff',
  'tif',
  'heic',
  'avif'
])
export const VIDEO_EXTS = new Set([
  'mp4',
  'mkv',
  'avi',
  'mov',
  'wmv',
  'webm',
  'flv',
  'm4v',
  'mpeg',
  'mpg'
])
export const AUDIO_EXTS = new Set([
  'mp3',
  'wav',
  'flac',
  'aac',
  'ogg',
  'wma',
  'm4a',
  'aiff',
  'opus'
])
export const ARCHIVE_EXTS = new Set([
  'zip',
  'rar',
  '7z',
  'tar',
  'gz',
  'bz2',
  'xz',
  'iso',
  'cab'
])
export const OFFICE_EXTS = new Set([
  'doc',
  'docx',
  'xls',
  'xlsx',
  'ppt',
  'pptx',
  'odt',
  'ods',
  'odp',
  'rtf',
  'csv'
])
export const CODE_EXTS = new Set([
  'js',
  'ts',
  'tsx',
  'jsx',
  'py',
  'rs',
  'go',
  'java',
  'c',
  'cpp',
  'h',
  'hpp',
  'cs',
  'rb',
  'php',
  'swift',
  'kt',
  'html',
  'css',
  'scss',
  'json',
  'xml',
  'yml',
  'yaml',
  'toml',
  'md',
  'sql',
  'sh',
  'ps1',
  'bat'
])
export const EXEC_EXTS = new Set(['exe', 'msi', 'bat', 'cmd', 'ps1', 'com', 'scr', 'msix', 'appx'])

export function classifyExtension(ext: string, isDirectory: boolean): FileFilter {
  if (isDirectory) return 'folders'
  const e = ext.toLowerCase()
  if (IMAGE_EXTS.has(e)) return 'images'
  if (VIDEO_EXTS.has(e)) return 'videos'
  if (AUDIO_EXTS.has(e)) return 'audio'
  if (ARCHIVE_EXTS.has(e)) return 'archives'
  if (e === 'pdf') return 'pdf'
  if (OFFICE_EXTS.has(e)) return 'office'
  if (EXEC_EXTS.has(e)) return 'executables'
  if (CODE_EXTS.has(e)) return 'code'
  return 'unknown'
}

export function matchesFilter(file: StashFile, filter: FileFilter): boolean {
  if (filter === 'all') return true
  return classifyExtension(file.extension, file.isDirectory) === filter
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  const value = bytes / Math.pow(1024, i)
  return `${value < 10 && i > 0 ? value.toFixed(1) : Math.round(value)} ${units[i]}`
}
