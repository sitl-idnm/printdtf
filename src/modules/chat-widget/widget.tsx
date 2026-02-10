'use client'

import { FC, useEffect, useRef, useState } from 'react'
import classNames from 'classnames'

import styles from './widget.module.scss'

type ChatLink = {
  href: string
  label: string
  icon: 'telegram' | 'max' | 'email'
}

type ChatWidgetProps = {
  className?: string
  links?: ChatLink[]
}

const DEFAULT_LINKS: ChatLink[] = [
  { href: 'https://t.me/+79331846181', label: 'Telegram', icon: 'telegram' },
  { href: 'https://max.ru/u/f9LHodD0cOLso5py8qzZB5X3BFhgLdTS2gUjkYbdDQWuIikvT2Urr0ZxjEM', label: 'МАКС', icon: 'max' },
  { href: 'mailto:sales@city-group.pro', label: 'Email', icon: 'email' }
]

const Icon: FC<{ name: ChatLink['icon'] | 'message' }> = ({ name }) => {
  if (name === 'telegram') {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M9.036 15.453 8.86 20.5c.404 0 .579-.173.79-.38l1.898-1.842 3.936 2.89c.722.4 1.235.19 1.433-.668l2.595-12.167.001-.002c.23-1.073-.386-1.492-1.103-1.23L3.61 10.22c-1.05.408-1.036.995-.179 1.26l4.42 1.379 10.26-6.47c.482-.293.921-.131.56.162" />
      </svg>
    )
  }
  if (name === 'max') {
    return (
      <svg width="765" height="761" viewBox="0 0 765 761" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M390.364 758.828C315.357 758.828 280.5 747.879 219.911 704.079C181.586 753.353 60.2245 791.861 54.932 725.979C54.932 676.522 43.9821 634.73 31.5722 589.105C16.7898 532.895 0 470.298 0 379.597C0 162.971 177.753 0 388.357 0C599.142 0 764.303 171.001 764.303 381.604C765.011 588.951 597.709 757.722 390.364 758.828ZM393.467 187.243C290.902 181.951 210.968 252.943 193.266 364.267C178.666 456.429 204.581 568.665 226.663 574.505C237.248 577.06 263.893 555.525 280.5 538.918C307.961 557.889 339.939 569.282 373.209 571.95C479.482 577.062 570.289 496.156 577.425 389.999C581.579 283.618 499.755 193.514 393.466 187.426L393.467 187.243Z" fill="white" />
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
