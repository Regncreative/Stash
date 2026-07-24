import type { ReactNode } from 'react'
import { ArrowLeft, Trash2 } from 'lucide-react'
import { useStashStore } from '@/stores/stash-store'
import type { ThemeMode } from '@shared/types'
import { cn } from '@/lib/utils'
import { tr } from '@/lib/i18n'

const ACCENTS = ['#2563EB', '#0078D4', '#8764B8', '#038387', '#00B294', '#CA5010', '#E74856', '#C239B3']

const THEME_LABELS: Record<ThemeMode, string> = {
  system: tr.themeSystem,
  light: tr.themeLight,
  dark: tr.themeDark
}

export function SettingsPanel() {
  const settings = useStashStore((s) => s.settings)
  const updateSettings = useStashStore((s) => s.updateSettings)
  const setShowSettings = useStashStore((s) => s.setShowSettings)
  const shelves = useStashStore((s) => s.shelves)
  const refresh = useStashStore((s) => s.refresh)
  const showToast = useStashStore((s) => s.showToast)

  if (!settings) return null

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="flex shrink-0 items-center gap-2 px-6 pb-3 pt-1">
        <button
          type="button"
          className="icon-btn"
          aria-label={tr.back}
          onClick={() => setShowSettings(false)}
        >
          <ArrowLeft size={18} strokeWidth={1.75} />
        </button>
        <h2 className="text-[16px] font-semibold text-[var(--foreground)]">{tr.settings}</h2>
      </div>

      <div className="scroll-autohide min-h-0 flex-1 space-y-4 overflow-x-hidden overflow-y-auto px-6 pb-6">
        <SettingsCard title={tr.appearance}>
          <Field label={tr.theme}>
            <div className="flex gap-1.5">
              {(['system', 'light', 'dark'] as ThemeMode[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => void updateSettings({ theme: t })}
                  className={cn(
                    'flex-1 rounded-full py-2 text-[12px] font-medium transition-colors duration-150',
                    settings.theme === t
                      ? 'bg-[var(--accent)] text-white'
                      : 'bg-[var(--pill)] text-[var(--muted-foreground)] hover:bg-[var(--pill-hover)] hover:text-[var(--foreground)]'
                  )}
                >
                  {THEME_LABELS[t]}
                </button>
              ))}
            </div>
          </Field>

          <Field label={tr.accentColor}>
            <div className="flex flex-wrap gap-2.5">
              {ACCENTS.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-label={`${tr.accentColor} ${c}`}
                  onClick={() => void updateSettings({ accentColor: c })}
                  className={cn(
                    'h-7 w-7 rounded-full transition-transform duration-150 hover:scale-110',
                    settings.accentColor.toLowerCase() === c.toLowerCase() &&
                      'outline outline-2 outline-offset-2 outline-[var(--foreground)]'
                  )}
                  style={{ background: c }}
                />
              ))}
            </div>
          </Field>

          <ToggleRow
            label={tr.animations}
            checked={settings.animations}
            onChange={(v) => void updateSettings({ animations: v })}
          />
        </SettingsCard>

        <SettingsCard title={tr.behavior}>
          <ToggleRow
            label={tr.startWithWindows}
            checked={settings.startWithWindows}
            onChange={(v) => void updateSettings({ startWithWindows: v })}
          />
          <ToggleRow
            label={tr.notifications}
            checked={settings.notifications}
            onChange={(v) => void updateSettings({ notifications: v })}
          />
          <ToggleRow
            label={tr.alwaysOnTop}
            checked={settings.alwaysOnTop}
            onChange={(v) => void updateSettings({ alwaysOnTop: v })}
          />

          <Field label={tr.defaultShelf}>
            <select
              className="h-9 w-full rounded-[10px] border border-[var(--border)] bg-[var(--bg)] px-3 text-[13px] text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
              value={settings.defaultShelfId}
              onChange={(e) => void updateSettings({ defaultShelfId: e.target.value })}
            >
              {shelves.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label={tr.openHotkey}>
            <input
              className="h-9 w-full rounded-[10px] border border-[var(--border)] bg-[var(--bg)] px-3 text-[13px] text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
              value={settings.openHotkey}
              onChange={(e) => void updateSettings({ openHotkey: e.target.value })}
              placeholder="Control+Shift+Space"
            />
            <p className="mt-1.5 text-[11px] text-[var(--muted-foreground)]">{tr.hotkeyHint}</p>
          </Field>
        </SettingsCard>

        <SettingsCard title={tr.shelvesSection}>
          <ul className="space-y-1">
            {shelves.map((shelf) => (
              <li
                key={shelf.id}
                className="flex items-center justify-between gap-2 rounded-[10px] px-2.5 py-2 hover:bg-[var(--pill)]"
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ background: shelf.color }}
                  />
                  <span className="truncate text-[13px] text-[var(--foreground)]">{shelf.name}</span>
                </div>
                <button
                  type="button"
                  className="icon-btn shrink-0 text-[var(--destructive)] disabled:opacity-30"
                  aria-label={tr.deleteShelf(shelf.name)}
                  disabled={shelves.length <= 1}
                  onClick={async () => {
                    if (!confirm(tr.deleteShelfConfirm(shelf.name))) return
                    try {
                      await window.stash.deleteShelf(shelf.id)
                      await refresh()
                    } catch {
                      showToast(tr.cannotDeleteLast)
                    }
                  }}
                >
                  <Trash2 size={16} strokeWidth={1.75} />
                </button>
              </li>
            ))}
          </ul>
        </SettingsCard>

        <p className="pt-1 text-center text-[11px] text-[var(--muted-foreground)]">{tr.footer}</p>
      </div>
    </div>
  )
}

function SettingsCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="overflow-hidden rounded-[14px] bg-[var(--card)] px-3.5 py-3.5">
      <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
        {title}
      </h3>
      <div className="space-y-3.5">{children}</div>
    </section>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <div className="mb-1.5 text-[12px] font-medium text-[var(--foreground)]">{label}</div>
      {children}
    </div>
  )
}

function ToggleRow({
  label,
  checked,
  onChange
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex w-full items-center justify-between gap-3">
      <span className="min-w-0 flex-1 truncate text-[13px] text-[var(--foreground)]">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        style={{ width: 44, height: 24 }}
        className={cn(
          'relative shrink-0 rounded-full transition-colors duration-150',
          checked ? 'bg-[var(--accent)]' : 'bg-[rgba(128,128,128,0.4)]'
        )}
      >
        <span
          style={{
            width: 18,
            height: 18,
            top: 3,
            left: checked ? 23 : 3,
            transition: 'left 150ms ease'
          }}
          className="absolute rounded-full bg-white shadow-sm"
        />
      </button>
    </div>
  )
}
