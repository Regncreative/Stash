import type { StashApi } from '../../preload/index'

declare global {
  interface Window {
    stash: StashApi
  }
}

export {}
