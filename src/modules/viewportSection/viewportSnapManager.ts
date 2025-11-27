'use client'

type EnableOptions = {
  threshold?: number
}

let isInitialized = false
let currentThreshold = 0.8
let isProgrammaticScroll = false
let scrollIdleTimer: number | null = null
let sectionToIntersection: Map<Element, number>
let observer: IntersectionObserver | null = null

function getSections(): Element[] {
  return Array.from(document.querySelectorAll('[data-viewport-section=\"true\"]'))
}

function onScrollIdle() {
  if (!sectionToIntersection) return
  let bestSection: Element | null = null
  let bestRatio = 0
  sectionToIntersection.forEach((ratio, el) => {
    if (ratio > bestRatio) {
      bestRatio = ratio
      bestSection = el
    }
  })
  if (bestSection && bestRatio >= currentThreshold) {
    isProgrammaticScroll = true
    ;(bestSection as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'start' })
    // clear flag after some time to avoid blocking user scroll too long
    window.setTimeout(() => { isProgrammaticScroll = false }, 600)
  }
}

function attachScrollIdleListener() {
  const onScroll = () => {
    if (isProgrammaticScroll) return
    if (scrollIdleTimer) window.clearTimeout(scrollIdleTimer)
    scrollIdleTimer = window.setTimeout(onScrollIdle, 120)
  }
  window.addEventListener('scroll', onScroll, { passive: true })
}

export function enableViewportSnap(options?: EnableOptions) {
  if (isInitialized) {
    if (typeof options?.threshold === 'number') {
      currentThreshold = options.threshold
    }
    return
  }
  isInitialized = true
  currentThreshold = typeof options?.threshold === 'number' ? options.threshold : 0.8
  sectionToIntersection = new Map()

  const thresholds: number[] = []
  for (let t = 0; t <= 1; t += 0.05) thresholds.push(parseFloat(t.toFixed(2)))
  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      sectionToIntersection.set(entry.target, entry.intersectionRatio)
    })
  }, { threshold: thresholds })

  getSections().forEach((el) => observer!.observe(el))

  // Watch for new sections added dynamically
  const mo = new MutationObserver(() => {
    getSections().forEach((el) => observer!.observe(el))
  })
  mo.observe(document.body, { childList: true, subtree: true })

  attachScrollIdleListener()
}
