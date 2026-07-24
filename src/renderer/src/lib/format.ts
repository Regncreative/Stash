import { format } from 'date-fns'
import { formatBytes } from '@shared/types'

export function relativeTime(ts: number): string {
  try {
    return format(ts, 'HH:mm')
  } catch {
    return ''
  }
}

export function formatClock(ts: number): string {
  try {
    return format(ts, 'HH:mm')
  } catch {
    return ''
  }
}

export { formatBytes }
