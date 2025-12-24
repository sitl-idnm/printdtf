'use client'
import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Fixes ScrollTrigger pin/measure glitches on client-side route transitions,
 * especially when global `scroll-behavior: smooth` is enabled.
 */
export function ScrollTriggerRouteFix() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const search = searchParams?.toString() ?? ''

  useEffect(() => {
    const html = document.documentElement
    const prevScrollBehavior = html.style.scrollBehavior

    // Prevent "smooth" scroll-to-top during navigation from interfering with ScrollTrigger measurements.
    html.style.scrollBehavior = 'auto'

    // Double rAF: wait for layout + images sizing to settle.
    const raf1 = requestAnimationFrame(() => {
      const raf2 = requestAnimationFrame(() => {
        try {
          // Clear internal cached scroll positions, then refresh calculations.
          // (Method exists in modern GSAP builds; guard just in case.)
          ;(ScrollTrigger as unknown as { clearScrollMemory?: () => void }).clearScrollMemory?.()
        } catch {
          // no-op
        }
        ScrollTrigger.refresh(true)
      })
      // cleanup raf2 if needed
      ;(ScrollTriggerRouteFix as unknown as { __raf2?: number }).__raf2 = raf2
    })

    // restore smooth behavior after route settles
    const t = window.setTimeout(() => {
      html.style.scrollBehavior = prevScrollBehavior
    }, 300)

    return () => {
      window.clearTimeout(t)
      const raf2 = (ScrollTriggerRouteFix as unknown as { __raf2?: number }).__raf2
      if (raf2) cancelAnimationFrame(raf2)
      cancelAnimationFrame(raf1)
      html.style.scrollBehavior = prevScrollBehavior
    }
  }, [pathname, search])

  return null
}
