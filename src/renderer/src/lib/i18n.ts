/** Turkish UI strings for Stash */
export const tr = {
  shelves: 'raf',
  shelvesCap: 'Raf',
  files: 'dosya',
  filesCap: 'Dosya',
  search: 'Ara',
  searchPlaceholder: 'Dosya ara…',
  clearSearch: 'Aramayı temizle',
  settings: 'Ayarlar',
  close: 'Kapat',
  back: 'Geri',

  dropHere: 'Dosyaları buraya bırakın',
  releaseToStash: 'Bırakarak ekle',
  emptyTitle: 'Dosyaları buraya bırakın',
  emptyHint: 'Dosyalar orijinal konumlarında kalır. Stash yalnızca referans saklar.',
  noMatch: 'Eşleşen dosya yok',
  trySearch: 'Farklı bir arama deneyin',

  folder: 'Klasör',
  fileNotFound: 'Dosya bulunamadı',
  pin: 'Sabitle',
  unpin: 'Sabitlemeyi kaldır',

  // Context menu
  open: 'Aç',
  reveal: 'Gezgin’de göster',
  copyPath: 'Yolu kopyala',
  properties: 'Özellikler',
  removeFromShelf: 'Raftan kaldır',
  moveToShelf: 'Rafa taşı',
  pathCopied: 'Yol kopyalandı',
  removedKept: 'Raftan kaldırıldı (dosya diskte duruyor)',
  movedTo: (name: string) => `${name} rafına taşındı`,
  couldNotOpen: 'Dosya açılamadı',
  missingOnDisk: 'Diskte yok',
  sizeBytes: (n: number) => `Boyut: ${n} bayt`,
  addedAt: (s: string) => `Eklendi: ${s}`,

  // Settings
  appearance: 'Görünüm',
  theme: 'Tema',
  themeSystem: 'Sistem',
  themeLight: 'Açık',
  themeDark: 'Koyu',
  accentColor: 'Vurgu rengi',
  animations: 'Animasyonlar',
  behavior: 'Davranış',
  startWithWindows: 'Windows ile başlat',
  notifications: 'Bildirimler',
  alwaysOnTop: 'Her zaman üstte',
  defaultShelf: 'Varsayılan raf',
  openHotkey: 'Panel kısayolu',
  hotkeyHint: 'Örn. Control+Alt+S',
  shelvesSection: 'Raflar',
  deleteShelf: (name: string) => `“${name}” rafını sil`,
  deleteShelfConfirm: (name: string) =>
    `“${name}” rafı silinsin mi? İçindeki dosyalar Stash’ten kalkar (diskten silinmez).`,
  cannotDeleteLast: 'Son raf silinemez',
  createShelf: 'Raf oluştur',
  shelfName: 'İsim',
  renameShelf: 'Rafı yeniden adlandır',
  footer: 'Stash v1.0 · Yalnızca referans · Dosyalar kopyalanmaz',

  // Toasts / drop
  filesAdded: (n: number, shelf: string) =>
    `✓ ${n} dosya eklendi · ${shelf}`,
  alreadyOnShelf: 'Bu rafta zaten var',

  // Tray (main process uses separate strings if needed)
  openPanel: 'Aç',
  quit: 'Çıkış'
} as const
