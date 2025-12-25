'use client'
import { FC } from 'react'
import Link from 'next/link'
import { Wrapper } from '@/ui'

import styles from './footer.module.scss'

// Icon Components
const PhoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 5.5c0 8.008 6.492 14.5 14.5 14.5h.676c.746 0 1.41-.466 1.649-1.173l.667-2a1.5 1.5 0 0 0-.825-1.86l-2.088-.93a1.5 1.5 0 0 0-1.67.337l-.87.87a.5.5 0 0 1-.58.093 11.5 11.5 0 0 1-5.026-5.026.5.5 0 0 1 .093-.58l.87-.87a1.5 1.5 0 0 0 .337-1.67l-.93-2.088A1.5 1.5 0 0 0 7.673 3.5l-2 .667A1.73 1.73 0 0 0 4.5 5.176V5.5Z" />
  </svg>
)

const EnvelopeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
)

const PaperAirplaneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m22 2-7 20-4-9-9-4Z" />
    <path d="M22 2 11 13" />
  </svg>
)

const ChatBubbleLeftRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    <path d="M3 9h18" />
    <path d="M8 13h8" />
  </svg>
)

const Footer: FC = () => {
  return (
    <footer className={styles.root}>
      <Wrapper className={styles.wrapper}>
        <div className={styles.content}>
          {/* Brand Section */}
          <div className={styles.brandSection}>
            <Link href="/" className={styles.brand} aria-label="City Group">
              <span className={styles.brandName}>City Group</span>
              <span className={styles.brandTagline}>Логистика и фулфилмент для маркетплейсов</span>
            </Link>
          </div>

          {/* Navigation Section */}
          <nav className={styles.navSection} aria-label="Навигация">
            <h3 className={styles.sectionTitle}>Услуги</h3>
            <ul className={styles.navList}>
              <li>
                <Link href="/print" className={styles.navLink}>
                  Печать DTF
                </Link>
              </li>
              <li>
                <Link href="/fullfilment" className={styles.navLink}>
                  Фулфилмент
                </Link>
              </li>
              <li>
                <Link href="/logistika" className={styles.navLink}>
                  Логистика
                </Link>
              </li>
            </ul>
          </nav>

          {/* Contacts Section */}
          <div className={styles.contactsSection}>
            <h3 className={styles.sectionTitle}>Контакты</h3>
            <ul className={styles.contactsList}>
              <li>
                <a href="tel:+79999999999" className={styles.contactLink}>
                  <span className={styles.contactIcon}>
                    <PhoneIcon />
                  </span>
                  <span>+7 999 999-99-99</span>
                </a>
              </li>
              <li>
                <a href="mailto:hello@citygroup.ru" className={styles.contactLink}>
                  <span className={styles.contactIcon}>
                    <EnvelopeIcon />
                  </span>
                  <span>hello@citygroup.ru</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Social Section */}
          <div className={styles.socialSection}>
            <h3 className={styles.sectionTitle}>Связаться</h3>
            <div className={styles.socialLinks}>
              <a
                href="https://t.me/citygroup"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="Telegram"
              >
                <span className={styles.socialIcon}>
                  <PaperAirplaneIcon />
                </span>
                <span>Telegram</span>
              </a>
              <a
                href="https://wa.me/79999999999"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="WhatsApp"
              >
                <span className={styles.socialIcon}>
                  <ChatBubbleLeftRightIcon />
                </span>
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottomBar}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} City Group. Все права защищены.
          </p>
          <div className={styles.legalLinks}>
            <Link href="/privacy" className={styles.legalLink}>
              Политика конфиденциальности
            </Link>
            <Link href="/terms" className={styles.legalLink}>
              Условия использования
            </Link>
          </div>
        </div>
      </Wrapper>
    </footer>
  )
}

export default Footer
