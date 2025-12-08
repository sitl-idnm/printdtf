import { FC } from 'react'
import { Wrapper } from '@/ui'
import IconGithub from '@icons/github-mark.svg'

import styles from './footer.module.scss'
import { FooterSocialItemI } from './footer.types'
import Social from './social'

const socialList: FooterSocialItemI[] = [
  {
    label: 'github repo',
    href: 'https://github.com/pandaprofit/nextjs-boilerplate',
    icon: <IconGithub />
  }
]

const Footer: FC = () => {
  return (
    <footer className={styles.root}>
      <Wrapper className={styles.wrapper}>
        <a className={styles.brand} href="/" aria-label="VoidSharks agency">
          VoidSharks.agency
        </a>

        <nav className={styles.nav} aria-label="Основная навигация">
          <a href="/">Главная</a>
          <a href="/print">Печать</a>
          <a href="/#prices">Цены</a>
          <a href="/#contacts">Контакты</a>
        </nav>

        <div className={styles.contacts} id="contacts">
          <a className={styles.iconBtn} href="tel:+79999999999" aria-label="Позвонить">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 5.5c0 8.008 6.492 14.5 14.5 14.5h.676c.746 0 1.41-.466 1.649-1.173l.667-2a1.5 1.5 0 0 0-.825-1.86l-2.088-.93a1.5 1.5 0 0 0-1.67.337l-.87.87a.5.5 0 0 1-.58.093 11.5 11.5 0 0 1-5.026-5.026.5.5 0 0 1 .093-.58l.87-.87a1.5 1.5 0 0 0 .337-1.67l-.93-2.088A1.5 1.5 0 0 0 7.673 3.5l-2 .667A1.73 1.73 0 0 0 4.5 5.176V5.5Z" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </a>
          <a className={styles.iconBtn} href="mailto:hello@example.com" aria-label="Написать на email">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.6" />
              <path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </a>
          <Social items={socialList} />
        </div>
      </Wrapper>
    </footer>
  )
}

export default Footer
