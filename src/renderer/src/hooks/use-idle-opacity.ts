import { useEffect, useRef } from 'react'

/**
 * After idleTimeoutSec without mouse activity, fade the BrowserWindow
 * to idleOpacity (10–70%). Any activity restores full opacity.
 */
export function useIdleOpacity(
  enabled: boolean,
  idleOpacity: number,
  idleTimeoutSec: number
): void {
  const idleRef = useRef(idleOpacity)
  const timeoutRef = useRef(idleTimeoutSec)
  const fadedRef = useRef(false)
  idleRef.current = idleOpacity
  timeoutRef.current = idleTimeoutSec

  useEffect(() => {
    if (!enabled) return

    let timer: ReturnType<typeof setTimeout> | null = null

    const clearTimer = () => {
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
    }

    const goIdle = () => {
      fadedRef.current = true
      void window.stash.setOpacity(idleRef.current)
    }

    const scheduleIdle = () => {
      clearTimer()
      const ms = Math.min(60, Math.max(5, timeoutRef.current)) * 1000
      timer = setTimeout(goIdle, ms)
    }

    const wake = () => {
      if (fadedRef.current) {
        fadedRef.current = false
        void window.stash.setOpacity(1)
      }
      scheduleIdle()
    }

    fadedRef.current = false
    void window.stash.setOpacity(1)
    scheduleIdle()

    const opts: AddEventListenerOptions = { capture: true, passive: true }
    window.addEventListener('mousemove', wake, opts)
    window.addEventListener('mousedown', wake, opts)
    window.addEventListener('wheel', wake, opts)
    window.addEventListener('keydown', wake, opts)

    return () => {
      clearTimer()
      window.removeEventListener('mousemove', wake, opts)
      window.removeEventListener('mousedown', wake, opts)
      window.removeEventListener('wheel', wake, opts)
      window.removeEventListener('keydown', wake, opts)
      fadedRef.current = false
      void window.stash.setOpacity(1)
    }
  }, [enabled, idleTimeoutSec])

  useEffect(() => {
    if (!enabled || !fadedRef.current) return
    void window.stash.setOpacity(idleOpacity)
  }, [enabled, idleOpacity])
}
