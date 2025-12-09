'use client'

import { FC, useEffect, useRef, useState } from 'react'
import classNames from 'classnames'

import styles from './widget.module.scss'

type ChatLink = {
  href: string
  label: string
  icon: 'telegram' | 'whatsapp' | 'email'
}

type ChatWidgetProps = {
  className?: string
  links?: ChatLink[]
}

const DEFAULT_LINKS: ChatLink[] = [
  { href: 'https://t.me/username', label: 'Telegram', icon: 'telegram' },
  { href: 'https://wa.me/79999999999', label: 'WhatsApp', icon: 'whatsapp' },
  { href: 'mailto:hello@example.com', label: 'Email', icon: 'email' }
]

const Icon: FC<{ name: ChatLink['icon'] | 'message' }> = ({ name }) => {
  if (name === 'telegram') {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M9.036 15.453 8.86 20.5c.404 0 .579-.173.79-.38l1.898-1.842 3.936 2.89c.722.4 1.235.19 1.433-.668l2.595-12.167.001-.002c.23-1.073-.386-1.492-1.103-1.23L3.61 10.22c-1.05.408-1.036.995-.179 1.26l4.42 1.379 10.26-6.47c.482-.293.921-.131.56.162" />
      </svg>
    )
  }
  if (name === 'whatsapp') {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M20.52 3.48A11.91 11.91 0 0 0 12.06 0C5.5 0 .18 5.32.18 11.9c0 2.1.55 4.16 1.6 5.98L0 24l6.3-1.63a11.8 11.8 0 0 0 5.76 1.5h.01c6.57 0 11.9-5.32 11.9-11.88 0-3.18-1.24-6.17-3.45-8.5ZM12.06 21.4h-.01c-1.85 0-3.66-.5-5.23-1.44l-.38-.22-3.74.97 1-3.64-.25-.38a9.9 9.9 0 0 1-1.53-5.28c0-5.46 4.45-9.9 9.92-9.9 2.64 0 5.12 1.03 6.98 2.9a9.8 9.8 0 0 1 2.9 6.98c0 5.46-4.45 9.9-9.92 9.9Zm5.44-7.4c-.3-.15-1.77-.87-2.04-.96-.27-.1-.47-.15-.68.15-.2.3-.78.95-.95 1.15-.17.2-.35.22-.66.07-.3-.15-1.3-.48-2.48-1.5-.92-.82-1.54-1.83-1.72-2.13-.17-.3-.02-.46.13-.6.13-.12.3-.32.45-.48.15-.17.2-.28.3-.47.1-.2.05-.36-.02-.52-.07-.15-.68-1.63-.93-2.23-.24-.58-.5-.5-.68-.5h-.58c-.2 0-.51.07-.78.36-.27.3-1.03 1.01-1.03 2.46s1.06 2.85 1.2 3.05c.15.2 2.1 3.21 5.08 4.5.71.31 1.26.5 1.69.64.71.23 1.36.2 1.87.12.57-.08 1.77-.73 2.02-1.42.25-.7.25-1.3.18-1.42-.07-.12-.27-.2-.56-.35Z" />
      </svg>
    )
  }
  if (name === 'email') {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 2v.01L12 12 4 6.01V6h16ZM4 18V8l8 6 8-6v10H4Z" />
      </svg>
    )
  }
  // message
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Z" />
    </svg>
  )
}

const ChatWidget: FC<ChatWidgetProps> = ({ className, links = DEFAULT_LINKS }) => {
  const [open, setOpen] = useState(false)
  const [scheme, setScheme] = useState<'primary' | 'contrast'>('primary')
  const schemeRef = useRef<'primary' | 'contrast'>('primary')
  const rootRef = useRef<HTMLDivElement | null>(null)
  const rootClass = classNames(
    styles.root,
    { [styles.open]: open },
    scheme === 'primary' ? styles.schemePrimary : styles.schemeContrast,
    className
  )

  // Detect background under the FAB and switch scheme with smooth transitions
  useEffect(() => {
    let rafId = 0
    const update = () => {
      rafId = 0
      const holder = rootRef.current
      if (!holder) return
      const fab = holder.querySelector(`.${styles.fab}`) as HTMLElement | null
      const rect = fab?.getBoundingClientRect()
      const x = rect ? rect.left + rect.width / 2 : window.innerWidth - 28
      const y = rect ? rect.top + rect.height / 2 : window.innerHeight - 28
      // Prefer elementsFromPoint and ignore our own widget
      const stack = (document.elementsFromPoint(x, y) as Element[]) || []
      // Attribute-based override ONLY: data-chat-scheme="primary|contrast|auto"
      const overrideEl = stack.find(
        (e) => !holder.contains(e) && (e as HTMLElement).getAttribute && (e as HTMLElement).getAttribute('data-chat-scheme')
      ) as HTMLElement | undefined
      const forced = overrideEl?.getAttribute('data-chat-scheme') as 'primary' | 'contrast' | 'auto' | null
      if (forced && (forced === 'primary' || forced === 'contrast')) {
        if (forced !== schemeRef.current) {
          schemeRef.current = forced
          setScheme(forced)
        }
        return
      }
      // If no attribute found, fallback to primary, no auto-detection by background
      if (schemeRef.current !== 'primary') {
        schemeRef.current = 'primary'
        setScheme('primary')
      }
    }

    const onScroll = () => {
      if (rafId) return
      rafId = requestAnimationFrame(update)
    }
    const onResize = () => {
      if (rafId) cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <div ref={rootRef} className={rootClass}>
      <div className={styles.menu} aria-hidden={!open}>
        {links.map((link) => (
          <a key={link.label} className={styles.item} href={link.href} target="_blank" rel="noopener noreferrer" aria-label={link.label}>
            <Icon name={link.icon} />
          </a>
        ))}
      </div>
      <button
        type="button"
        className={styles.fab}
        aria-pressed={open}
        aria-label={open ? 'Close messenger menu' : 'Open messenger menu'}
        onClick={() => setOpen((v) => !v)}
      >
        <Icon name="message" />
        <span className={styles.srOnly}>Messenger</span>
      </button>
    </div>
  )
}

export default ChatWidget
