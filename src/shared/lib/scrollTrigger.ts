import { ScrollTrigger } from 'gsap/ScrollTrigger'

let rafId = 0

/**
 * Throttle ScrollTrigger.refresh() to at most once per animation frame.
 * This avoids refresh "storms" that can spam history APIs (notably in Firefox)
 * during route transitions and mass creation/destruction of ScrollTriggers.
 */
export function scheduleScrollTriggerRefresh (): void {
  if (typeof window === 'undefined') return
  if (rafId) return
  rafId = window.requestAnimationFrame(() => {
    rafId = 0
    try {
      ScrollTrigger.refresh()
    } catch {
      // ignore - some browsers can throw on history.scrollRestoration in edge cases
    }
  })
}
