type LockState = {
  count: number
  scrollY: number
  prev: {
    html: {
      overflow: string
      scrollBehavior: string
      scrollSnapType: string
    }
    body: {
      position: string
      top: string
      left: string
      right: string
      width: string
      overflow: string
      scrollBehavior: string
      scrollSnapType: string
    }
  }
}

const KEY = '__printdtf_scroll_lock__'

function getState(): LockState {
  const w = window as unknown as Record<string, LockState | undefined>
  if (!w[KEY]) {
    w[KEY] = {
      count: 0,
      scrollY: 0,
      prev: {
        html: { overflow: '', scrollBehavior: '', scrollSnapType: '' },
        body: { position: '', top: '', left: '', right: '', width: '', overflow: '', scrollBehavior: '', scrollSnapType: '' }
      }
    }
  }
  return w[KEY]!
}

export function lockScroll(): void {
  if (typeof window === 'undefined') return
  const html = document.documentElement
  const body = document.body
  const state = getState()

  state.count += 1
  if (state.count > 1) return

  // snapshot inline styles once
  state.prev = {
    html: {
      overflow: html.style.overflow,
      scrollBehavior: html.style.scrollBehavior,
      scrollSnapType: html.style.scrollSnapType
    },
    body: {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow,
      scrollBehavior: body.style.scrollBehavior,
      scrollSnapType: body.style.scrollSnapType
    }
  }

  state.scrollY = window.scrollY || window.pageYOffset || 0

  // iOS-safe: lock via fixed body
  body.style.position = 'fixed'
  body.style.top = `-${state.scrollY}px`
  body.style.left = '0'
  body.style.right = '0'
  body.style.width = '100%'
  body.style.overflow = 'hidden'

  // Also lock html and disable snap/smooth that can force jumps
  html.style.overflow = 'hidden'
  html.style.scrollSnapType = 'none'
  body.style.scrollSnapType = 'none'
  html.style.scrollBehavior = 'auto'
  body.style.scrollBehavior = 'auto'
}

export function unlockScroll(): void {
  if (typeof window === 'undefined') return
  const html = document.documentElement
  const body = document.body
  const state = getState()

  if (state.count === 0) return
  state.count -= 1
  if (state.count > 0) return

  const prev = state.prev
  // Derive Y from body top if possible (more robust than a stored number)
  const top = body.style.top
  const derivedY = top ? Math.abs(parseInt(top, 10)) : 0
  const y = derivedY || state.scrollY

  // Important: keep snap/smooth disabled until AFTER we restore scroll position,
  // otherwise the browser can snap to the top/nearest snap point.
  html.style.scrollSnapType = 'none'
  body.style.scrollSnapType = 'none'
  html.style.scrollBehavior = 'auto'
  body.style.scrollBehavior = 'auto'

  // restore exact inline styles (except snap/smooth, restored later)
  html.style.overflow = prev.html.overflow

  body.style.position = prev.body.position
  body.style.top = prev.body.top
  body.style.left = prev.body.left
  body.style.right = prev.body.right
  body.style.width = prev.body.width
  body.style.overflow = prev.body.overflow

  // restore scroll after layout styles are back
  requestAnimationFrame(() => {
    window.scrollTo({ top: y, left: 0, behavior: 'auto' })
    // now it's safe to restore previous snap/smooth behavior
    requestAnimationFrame(() => {
      html.style.scrollBehavior = prev.html.scrollBehavior
      html.style.scrollSnapType = prev.html.scrollSnapType
      body.style.scrollBehavior = prev.body.scrollBehavior
      body.style.scrollSnapType = prev.body.scrollSnapType
    })
  })
}
