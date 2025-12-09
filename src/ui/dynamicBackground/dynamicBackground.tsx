'use client'

import { FC, useRef } from 'react'
import classNames from 'classnames'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

import styles from './dynamicBackground.module.scss'
import { DynamicBackgroundProps } from './dynamicBackground.types'

gsap.registerPlugin(ScrollTrigger)

const DynamicBackground: FC<DynamicBackgroundProps> = ({
  className,
  variant = 'grid-draw',
  cellSize = 56,
  pin,
  scrollFactor = 1.5,
  children
}) => {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const gridRef = useRef<HTMLDivElement | null>(null)
  const svgRef = useRef<SVGSVGElement | null>(null)

  const resolvedPin = pin ?? (variant === 'grid-draw' || variant === 'diagonal-lines' || variant === 'swirl-2' || variant === 'crosses')
  const rootClassName = classNames(styles.root, className, resolvedPin && styles.pin)

  useGSAP(() => {
    if (variant !== 'grid-draw') return
    const root = rootRef.current
    const grid = gridRef.current
    if (!root || !grid) return

    // create cells to fill the area responsively
    const buildGrid = () => {
      const rect = root.getBoundingClientRect()
      const width = rect.width || root.offsetWidth || 800
      const height = rect.height || root.offsetHeight || 600

      if (width <= 0 || height <= 0) return () => { }

      const cols = Math.max(1, Math.floor(width / cellSize))
      const rows = Math.max(1, Math.floor(height / cellSize))

      grid.innerHTML = ''
      grid.style.display = 'grid'
      grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`
      grid.style.gridTemplateRows = `repeat(${rows}, 1fr)`

      const total = cols * rows
      const cells: HTMLDivElement[] = []
      for (let i = 0; i < total; i++) {
        const el = document.createElement('div')
        el.className = styles.cell
        const fill = document.createElement('div')
        fill.className = styles.cellFill
        el.appendChild(fill)
        grid.appendChild(el)
        cells.push(fill) // animate the fill element, not the cell
      }

      // Set initial state: all fills hidden (scaleY: 0 from top)
      gsap.set(cells, { scaleY: 0, transformOrigin: 'top center' })

      // Shuffle cells array for random order (Fisher-Yates shuffle)
      const shuffled = [...cells]
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
      }

      // Build timeline revealing cells in random order with stagger (fill from top to bottom)
      const tl = gsap.timeline({ paused: true })
      const cellStagger = 0.015

      tl.to(shuffled, {
        scaleY: 1,
        duration: 0.3,
        ease: 'power2.out',
        stagger: cellStagger
      })

      // ScrollTrigger ties timeline progress to scroll
      const st = ScrollTrigger.create({
        trigger: root,
        start: 'top top',
        end: () => `+=${Math.max(400, height * scrollFactor)}`,
        scrub: 0.5,
        pin: resolvedPin,
        onUpdate: (self) => {
          tl.progress(self.progress)
        },
        onRefresh: () => {
          tl.progress(0)
        }
      })

      // Force initial refresh
      ScrollTrigger.refresh()

      return () => {
        st.kill()
        tl.kill()
        grid.innerHTML = ''
      }
    }

    // Small delay to ensure layout is ready
    let cleanup: (() => void) | null = null
    let ro: ResizeObserver | null = null

    const timeoutId = setTimeout(() => {
      cleanup = buildGrid()
      ro = new ResizeObserver(() => {
        cleanup?.()
        cleanup = buildGrid()
        ScrollTrigger.refresh()
      })
      ro.observe(root)
    }, 50)

    return () => {
      clearTimeout(timeoutId)
      ro?.disconnect()
      cleanup?.()
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === root) st.kill()
      })
    }
  }, [variant, cellSize, resolvedPin, scrollFactor])

  // Diagonal lines animation
  useGSAP(() => {
    if (variant !== 'diagonal-lines') return
    const root = rootRef.current
    const svg = svgRef.current
    if (!root || !svg) return

    const buildLines = () => {
      const rect = root.getBoundingClientRect()
      const width = rect.width || root.offsetWidth || 800
      const height = rect.height || root.offsetHeight || 600
      const viewportWidth = window.innerWidth

      if (width <= 0 || height <= 0) return () => { }

      // Extend beyond container for smooth curves
      const extendX = (viewportWidth - width) / 2 + width * 0.4

      // Clear and create SVG
      svg.innerHTML = ''
      svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
      svg.setAttribute('width', width.toString())
      svg.setAttribute('height', height.toString())

      // Beautiful swirl - starts top-left, curves elegantly
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')

      // Elegant curve: starts top-left, flows down-right, loops up, exits top-right
      const pathData = `M ${-extendX} ${height * 0.2}
        C ${width * 0.15} ${height * 0.25}, ${width * 0.3} ${height * 0.5}, ${width * 0.25} ${height * 0.7}
        C ${width * 0.2} ${height * 0.85}, ${width * 0.35} ${height * 0.75}, ${width * 0.5} ${height * 0.65}
        C ${width * 0.65} ${height * 0.55}, ${width * 0.75} ${height * 0.4}, ${width * 0.7} ${height * 0.25}
        C ${width * 0.65} ${height * 0.1}, ${width * 0.8} ${height * 0.15}, ${width + extendX} ${height * 0.3}`

      path.setAttribute('d', pathData)
      path.setAttribute('stroke', 'var(--color-accent-3)')
      path.setAttribute('stroke-width', '60')
      path.setAttribute('stroke-linecap', 'round')
      path.setAttribute('stroke-linejoin', 'round')
      path.setAttribute('fill', 'none')
      path.classList.add(styles.diagonalLine)
      svg.appendChild(path)

      // Get path length for stroke-dasharray animation
      const pathLength = path.getTotalLength()

      // Set initial state: path not drawn
      gsap.set(path, {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength
      })

      // Build timeline drawing path
      const tl = gsap.timeline({ paused: true })

      // Draw path
      tl.to(path, {
        strokeDashoffset: 0,
        duration: 1.2,
        ease: 'power2.out'
      })

      // ScrollTrigger ties timeline progress to scroll
      const st = ScrollTrigger.create({
        trigger: root,
        start: 'top top',
        end: () => `+=${Math.max(400, height * scrollFactor)}`,
        scrub: 0.5,
        pin: resolvedPin,
        onUpdate: (self) => {
          tl.progress(self.progress)
        },
        onRefresh: () => {
          tl.progress(0)
        }
      })

      ScrollTrigger.refresh()

      return () => {
        st.kill()
        tl.kill()
        svg.innerHTML = ''
      }
    }

    let cleanup: (() => void) | null = null
    let ro: ResizeObserver | null = null

    const timeoutId = setTimeout(() => {
      cleanup = buildLines()
      ro = new ResizeObserver(() => {
        cleanup?.()
        cleanup = buildLines()
        ScrollTrigger.refresh()
      })
      ro.observe(root)
    }, 50)

    return () => {
      clearTimeout(timeoutId)
      ro?.disconnect()
      cleanup?.()
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === root) st.kill()
      })
    }
  }, [variant, resolvedPin, scrollFactor])

  // Swirl-2 animation (second swirl variant)
  useGSAP(() => {
    if (variant !== 'swirl-2') return
    const root = rootRef.current
    const svg = svgRef.current
    if (!root || !svg) return

    const buildSwirl = () => {
      const rect = root.getBoundingClientRect()
      const width = rect.width || root.offsetWidth || 800
      const height = rect.height || root.offsetHeight || 600
      const viewportWidth = window.innerWidth

      if (width <= 0 || height <= 0) return () => { }

      // Extend beyond container for smooth curves
      const extendX = (viewportWidth - width) / 2 + width * 0.4

      // Clear and create SVG
      svg.innerHTML = ''
      svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
      svg.setAttribute('width', width.toString())
      svg.setAttribute('height', height.toString())

      // Second beautiful swirl - starts bottom-right, curves elegantly
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')

      // Elegant curve: starts bottom-right, flows up-left, loops down, exits bottom-left
      const pathData = `M ${width + extendX} ${height * 0.8}
        C ${width * 0.85} ${height * 0.75}, ${width * 0.7} ${height * 0.5}, ${width * 0.75} ${height * 0.3}
        C ${width * 0.8} ${height * 0.15}, ${width * 0.65} ${height * 0.25}, ${width * 0.5} ${height * 0.35}
        C ${width * 0.35} ${height * 0.45}, ${width * 0.25} ${height * 0.6}, ${width * 0.3} ${height * 0.75}
        C ${width * 0.35} ${height * 0.9}, ${width * 0.2} ${height * 0.85}, ${-extendX} ${height * 0.7}`

      path.setAttribute('d', pathData)
      path.setAttribute('stroke', 'var(--color-accent-3)')
      path.setAttribute('stroke-width', '60')
      path.setAttribute('stroke-linecap', 'round')
      path.setAttribute('stroke-linejoin', 'round')
      path.setAttribute('fill', 'none')
      path.classList.add(styles.diagonalLine)
      svg.appendChild(path)

      // Get path length for stroke-dasharray animation
      const pathLength = path.getTotalLength()

      // Set initial state: path not drawn
      gsap.set(path, {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength
      })

      // Build timeline drawing path
      const tl = gsap.timeline({ paused: true })

      // Draw path
      tl.to(path, {
        strokeDashoffset: 0,
        duration: 1.2,
        ease: 'power2.out'
      })

      // ScrollTrigger ties timeline progress to scroll
      const st = ScrollTrigger.create({
        trigger: root,
        start: 'top top',
        end: () => `+=${Math.max(400, height * scrollFactor)}`,
        scrub: 0.5,
        pin: resolvedPin,
        onUpdate: (self) => {
          tl.progress(self.progress)
        },
        onRefresh: () => {
          tl.progress(0)
        }
      })

      ScrollTrigger.refresh()

      return () => {
        st.kill()
        tl.kill()
        svg.innerHTML = ''
      }
    }

    let cleanup: (() => void) | null = null
    let ro: ResizeObserver | null = null

    const timeoutId = setTimeout(() => {
      cleanup = buildSwirl()
      ro = new ResizeObserver(() => {
        cleanup?.()
        cleanup = buildSwirl()
        ScrollTrigger.refresh()
      })
      ro.observe(root)
    }, 50)

    return () => {
      clearTimeout(timeoutId)
      ro?.disconnect()
      cleanup?.()
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === root) st.kill()
      })
    }
  }, [variant, resolvedPin, scrollFactor])

  // Crosses animation
  useGSAP(() => {
    if (variant !== 'crosses') return
    const root = rootRef.current
    const svg = svgRef.current
    if (!root || !svg) return

    // Kill any existing ScrollTriggers for this element
    ScrollTrigger.getAll().forEach(st => {
      if (st.trigger === root) st.kill()
    })

    const buildCrosses = () => {
      const rect = root.getBoundingClientRect()
      const width = rect.width || root.offsetWidth || 800
      const height = rect.height || root.offsetHeight || 600

      if (width <= 0 || height <= 0) return () => { }

      // Clear and create SVG
      svg.innerHTML = ''
      svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
      svg.setAttribute('width', width.toString())
      svg.setAttribute('height', height.toString())

      // Generate crosses with collision detection
      interface Cross {
        x: number
        y: number
        size: number
        element: SVGElement
        rotation: number
        entrySide: 'top' | 'bottom' | 'left' | 'right'
        shouldRotate: boolean
      }

      const crosses: Cross[] = []
      const minSize = Math.min(width, height) * 0.0125 // 1.25% of smallest dimension
      const maxSize = Math.min(width, height) * 0.0375 // 3.75% of smallest dimension
      const padding = maxSize * 0.6 // padding around crosses
      const maxAttempts = 500
      const targetCount = Math.floor((width * height) / (maxSize * maxSize * 4)) // approximate count

      // Generate crosses
      for (let i = 0; i < targetCount && crosses.length < 30; i++) {
        let attempts = 0
        let placed = false

        while (attempts < maxAttempts && !placed) {
          const size = minSize + Math.random() * (maxSize - minSize)
          const x = padding + Math.random() * (width - padding * 2)
          const y = padding + Math.random() * (height - padding * 2)

          // Check collision with existing crosses
          const overlaps = crosses.some(cross => {
            const distance = Math.sqrt(Math.pow(cross.x - x, 2) + Math.pow(cross.y - y, 2))
            const minDistance = (cross.size + size) / 2 + padding
            return distance < minDistance
          })

          if (!overlaps) {
            // Create cross (two lines)
            const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
            g.classList.add(styles.cross)

            // Random rotation (0-360 degrees)
            const rotation = Math.random() * 360

            // Random entry side
            const entrySides: Array<'top' | 'bottom' | 'left' | 'right'> = ['top', 'bottom', 'left', 'right']
            const entrySide = entrySides[Math.floor(Math.random() * entrySides.length)]

            // 5% of crosses should rotate
            const shouldRotate = Math.random() < 0.05

            const line1 = document.createElementNS('http://www.w3.org/2000/svg', 'line')
            line1.setAttribute('x1', (-size / 2).toString())
            line1.setAttribute('y1', (-size / 2).toString())
            line1.setAttribute('x2', (size / 2).toString())
            line1.setAttribute('y2', (size / 2).toString())
            line1.setAttribute('stroke', 'var(--color-accent-2)')
            line1.setAttribute('stroke-width', (size * 0.075).toString()) // 2x smaller
            line1.setAttribute('stroke-linecap', 'round')

            const line2 = document.createElementNS('http://www.w3.org/2000/svg', 'line')
            line2.setAttribute('x1', (-size / 2).toString())
            line2.setAttribute('y1', (size / 2).toString())
            line2.setAttribute('x2', (size / 2).toString())
            line2.setAttribute('y2', (-size / 2).toString())
            line2.setAttribute('stroke', 'var(--color-accent-2)')
            line2.setAttribute('stroke-width', (size * 0.075).toString()) // 2x smaller
            line2.setAttribute('stroke-linecap', 'round')

            g.appendChild(line1)
            g.appendChild(line2)
            svg.appendChild(g)

            crosses.push({ x, y, size, element: g, rotation, entrySide, shouldRotate })
            placed = true
          }

          attempts++
        }
      }

      // Set initial state: all crosses hidden and positioned off-screen based on entry side
      crosses.forEach(cross => {
        let offsetX = 0
        let offsetY = 0
        const offset = Math.max(width, height) * 0.3

        switch (cross.entrySide) {
          case 'top':
            offsetY = -offset
            break
          case 'bottom':
            offsetY = offset
            break
          case 'left':
            offsetX = -offset
            break
          case 'right':
            offsetX = offset
            break
        }

        // Set initial state using GSAP
        gsap.set(cross.element, {
          opacity: 0,
          scale: 0,
          x: cross.x + offsetX,
          y: cross.y + offsetY,
          rotation: cross.rotation,
          transformOrigin: '50% 50%'
        })
      })

      // Build timeline revealing crosses in random order
      const shuffled = [...crosses].sort(() => Math.random() - 0.5)
      const tl = gsap.timeline({ paused: true })
      const stagger = 0.05

      shuffled.forEach((cross, index) => {
        // Animate to final position
        tl.to(cross.element, {
          opacity: 0.6,
          scale: 1,
          x: cross.x,
          y: cross.y,
          rotation: cross.rotation,
          duration: 0.5,
          ease: 'back.out(1.2)'
        }, index * stagger)

        // Add subtle rotation for 5% of crosses
        if (cross.shouldRotate) {
          const rotationAmount = 10 + Math.random() * 20
          tl.to(cross.element, {
            rotation: `+=${rotationAmount}`,
            duration: 2,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true
          }, index * stagger + 0.3)
        }
      })

      // ScrollTrigger ties timeline progress to scroll
      const st = ScrollTrigger.create({
        trigger: root,
        start: 'top top',
        end: () => `+=${Math.max(400, height * scrollFactor)}`,
        scrub: 0.5,
        pin: resolvedPin,
        onUpdate: (self) => {
          tl.progress(self.progress)
        },
        onRefresh: () => {
          tl.progress(0)
        }
      })

      ScrollTrigger.refresh()

      return () => {
        st.kill()
        tl.kill()
        svg.innerHTML = ''
      }
    }

    let cleanup: (() => void) | null = null
    let ro: ResizeObserver | null = null

    const initAnimation = () => {
      // Clear any existing animations first
      if (cleanup) cleanup()
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === root) st.kill()
      })

      // Ensure dimensions are valid
      const rect = root.getBoundingClientRect()
      if (rect.width <= 0 || rect.height <= 0) {
        // Retry if dimensions not ready
        setTimeout(initAnimation, 50)
        return
      }

      cleanup = buildCrosses()
      ScrollTrigger.refresh()
    }

    // Use requestAnimationFrame for better timing
    let timeoutId: NodeJS.Timeout | undefined = undefined
    const rafId = requestAnimationFrame(() => {
      timeoutId = setTimeout(() => {
        initAnimation()
        ro = new ResizeObserver(() => {
          cleanup?.()
          cleanup = buildCrosses()
          ScrollTrigger.refresh()
        })
        ro.observe(root)
      }, 50)
    })

    return () => {
      cancelAnimationFrame(rafId)
      if (timeoutId) clearTimeout(timeoutId)
      ro?.disconnect()
      if (cleanup) cleanup()
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === root) st.kill()
      })
    }

    return () => {
      clearTimeout(timeoutId)
      ro?.disconnect()
      if (cleanup) cleanup()
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === root) st.kill()
      })
    }
  }, [variant, resolvedPin, scrollFactor])

  return (
    <div ref={rootRef} className={rootClassName}>
      {variant === 'grid-draw' && <div ref={gridRef} className={styles.grid} />}
      {(variant === 'diagonal-lines' || variant === 'swirl-2' || variant === 'crosses') && (
        <svg ref={svgRef} className={styles.diagonalSvg} />
      )}
      <div className={styles.content}>{children}</div>
    </div>
  )
}

export default DynamicBackground
