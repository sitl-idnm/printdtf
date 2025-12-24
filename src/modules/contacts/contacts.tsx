'use client'
import { FC, useMemo, useRef } from 'react'
import classNames from 'classnames'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

import styles from './contacts.module.scss'
import { ContactsProps } from './contacts.types'

gsap.registerPlugin(useGSAP, ScrollTrigger)

function IconPhone() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M3 5.5c0 8.008 6.492 14.5 14.5 14.5h.676c.746 0 1.41-.466 1.649-1.173l.667-2a1.5 1.5 0 0 0-.825-1.86l-2.088-.93a1.5 1.5 0 0 0-1.67.337l-.87.87a.5.5 0 0 1-.58.093 11.5 11.5 0 0 1-5.026-5.026.5.5 0 0 1 .093-.58l.87-.87a1.5 1.5 0 0 0 .337-1.67l-.93-2.088A1.5 1.5 0 0 0 7.673 3.5l-2 .667A1.73 1.73 0 0 0 4.5 5.176V5.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  )
}

function IconMail() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4 7l8 6 8-6" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}

function IconTelegram() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M21 5 3.6 11.7c-.9.35-.88 1.65.03 1.97l4.7 1.66 1.85 5.64c.29.88 1.45 1.02 1.94.23l2.64-4.2 4.95 3.63c.7.51 1.68.12 1.86-.74L22 6.05A1 1 0 0 0 21 5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M8.3 15.4 20.7 6.1" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function IconWhatsApp() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.7-1.2A9 9 0 1 0 12 3Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M9.3 9.4c.3-.7.6-.7 1.1-.7.2 0 .5 0 .8.6.3.6.9 2 .9 2.1 0 .2 0 .4-.1.5-.1.2-.2.3-.4.5-.2.2-.4.4-.2.8.1.3.6 1.1 1.3 1.7.9.8 1.7 1.1 2 1.2.2.1.5.1.7-.1.2-.2.8-.9 1-1.2.2-.3.4-.2.6-.1.2.1 1.5.7 1.8.9.2.1.4.2.4.3 0 .1 0 1-.7 1.9-.7.9-1.7.9-2.2.8-.5-.1-2-.6-3.5-1.8-1.8-1.4-2.9-3.2-3.2-3.8-.3-.6-.8-2.3.1-3.7Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconPin() {
  return (
    <svg className={styles.pinIcon} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 22s7-5.2 7-12a7 7 0 1 0-14 0c0 6.8 7 12 7 12Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M12 12.2a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4Z" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

const Contacts: FC<ContactsProps> = ({
  className,
  id,
  title,
  subtitle,
  schedule,
  quickNotes,
  phoneLinks,
  messengerLinks,
  emailLinks,
  addresses,
  mapEmbedSrc,
  mapTitle = 'Карта'
}) => {
  const rootClassName = classNames(styles.root, className)
  const rootRef = useRef<HTMLElement | null>(null)

  const notes = useMemo(() => (quickNotes ?? []).filter(Boolean), [quickNotes])
  const phones = useMemo(() => (phoneLinks ?? []).filter(Boolean), [phoneLinks])
  const messengers = useMemo(() => (messengerLinks ?? []).filter(Boolean), [messengerLinks])
  const emails = useMemo(() => (emailLinks ?? []).filter(Boolean), [emailLinks])
  const addr = useMemo(() => (addresses ?? []).filter(Boolean), [addresses])

  useGSAP(() => {
    const root = rootRef.current
    if (!root) return

    const blocks = Array.from(root.querySelectorAll<HTMLElement>(`.${styles.fadeIn}`))
    if (!blocks.length) return

    const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
    if (prefersReduced) {
      blocks.forEach((b) => b.classList.add(styles.inView))
      return
    }

    gsap.set(blocks, { opacity: 0, y: 18, filter: 'blur(6px)' })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: root,
        start: 'top 80%',
        once: true
      }
    })

    tl.to(blocks, {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 0.75,
      ease: 'power2.out',
      stagger: 0.12,
      onStart: () => blocks.forEach((b) => b.classList.add(styles.inView))
    })

    return () => {
      tl.scrollTrigger?.kill()
      tl.kill()
    }
  }, { scope: rootRef })

  return (
    <section className={rootClassName} id={id} aria-label={title} ref={rootRef}>
      <div className={styles.grid}>
        <div className={classNames(styles.panel, styles.fadeIn)}>
          <h2 className={styles.title}>{title}</h2>
          {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
          {schedule ? <div className={styles.schedule}>{schedule}</div> : null}

          {notes.length ? (
            <>
              <div className={styles.sep} />
              <ul className={styles.bullets}>
                {notes.map((n, i) => (
                  <li key={i}>{n}</li>
                ))}
              </ul>
            </>
          ) : null}

          {(phones.length || messengers.length || emails.length) ? (
            <>
              <div className={styles.sep} />
              <div className={styles.sectionTitle}>Связь</div>
              <div className={styles.list}>
                {phones.length ? (
                  <div className={styles.linkRow}>
                    {phones.map((p) => (
                      <a key={p.href} className={styles.chip} href={p.href}>
                        <IconPhone />
                        {p.value ?? p.label}
                      </a>
                    ))}
                  </div>
                ) : null}

                {messengers.length ? (
                  <div className={styles.linkRow}>
                    {messengers.map((m) => (
                      <a key={m.href} className={styles.chip} href={m.href} target="_blank" rel="noopener noreferrer">
                        {m.label.toLowerCase().includes('telegram') ? <IconTelegram /> : <IconWhatsApp />}
                        {m.value ?? m.label}
                      </a>
                    ))}
                  </div>
                ) : null}

                {emails.length ? (
                  <div className={styles.linkRow}>
                    {emails.map((e) => (
                      <a key={e.href} className={styles.chip} href={e.href}>
                        <IconMail />
                        {e.value ?? e.label}
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
            </>
          ) : null}

          {addr.length ? (
            <>
              <div className={styles.sep} />
              <div className={styles.sectionTitle}>Адреса</div>
              <ul className={styles.addrList}>
                {addr.map((a, i) => (
                  <li key={i}>
                    {a.label ? <strong>{a.label}: </strong> : null}
                    {a.text}
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </div>

        <div className={classNames(styles.mapCard, styles.fadeIn)}>
          <div className={styles.mapTop}>
            <p className={styles.mapTitle}>
              <IconPin />
              {mapTitle}
            </p>
          </div>
          <div className={styles.mapBody}>
            {mapEmbedSrc ? (
              <iframe
                className={styles.iframe}
                src={mapEmbedSrc}
                title={mapTitle}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className={styles.mapPlaceholder}>
                Вставьте ссылку на embed карты (iframe) в проп `mapEmbedSrc`
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contacts
