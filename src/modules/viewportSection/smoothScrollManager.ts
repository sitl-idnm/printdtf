'use client'

import { gsap } from 'gsap'
// @ts-ignore - plugin has no types in some setups
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollToPlugin)

type Options = {
  multiplier?: number
  duration?: number
  easing?: gsap.EaseString | gsap.EaseFunction
  enableOnTouch?: boolean
}

let initialized = false
let currentTween: gsap.core.Tween | null = null
let targetScrollY = 0

function clampScroll(value: number) {
  const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
  return Math.min(Math.max(0, value), max)
}

function isInsideScrollable(el: EventTarget | null): boolean {
  if (!(el instanceof Element)) return false
  let node: Element | null = el
  while (node && node !== document.body) {
    const style = window.getComputedStyle(node)
    const canScrollY =
      (style.overflowY === 'auto' || style.overflowY === 'scroll') &&
      node.scrollHeight > node.clientHeight
    if (canScrollY) return true
    node = node.parentElement
  }
  return false
}

export function enableGsapSmoothScroll(opts?: Options) {
  if (initialized) return
  initialized = true

  const multiplier = opts?.multiplier ?? 1
  const duration = opts?.duration ?? 0.5
  const easing = opts?.easing ?? 'power2.out'
  const enableOnTouch = opts?.enableOnTouch ?? false

  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  if (isTouch && !enableOnTouch) {
    return
  }

  targetScrollY = window.scrollY

  const onWheel = (e: WheelEvent) => {
    if (isInsideScrollable(e.target)) return
    e.preventDefault()
    targetScrollY = clampScroll(targetScrollY + e.deltaY * multiplier)
    currentTween?.kill()
    currentTween = gsap.to(window, {
      scrollTo: { y: targetScrollY, autoKill: true },
      duration,
      ease: easing
    })
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (isInsideScrollable(e.target)) return
    let delta = 0
    const page = window.innerHeight * 0.9
    switch (e.key) {
      case 'ArrowDown':
        delta = 80
        break
      case 'ArrowUp':
        delta = -80
        break
      case 'PageDown':
        delta = page
        break
      case 'PageUp':
        delta = -page
        break
      case 'Home':
        targetScrollY = 0
        break
      case 'End':
        targetScrollY = clampScroll(Infinity)
        break
      case ' ':
        delta = e.shiftKey ? -page : page
        break
      default:
        return
    }
    e.preventDefault()
    if (delta !== 0) {
      targetScrollY = clampScroll(targetScrollY + delta)
    }
    currentTween?.kill()
    currentTween = gsap.to(window, {
      scrollTo: { y: targetScrollY, autoKill: true },
      duration,
      ease: easing
    })
  }

  window.addEventListener('wheel', onWheel, { passive: false })
  window.addEventListener('keydown', onKeyDown, { passive: false })
}
