import { FC } from 'react'
import { SocialLinks, Wrapper } from '@/ui'
import classNames from 'classnames'

import styles from './header.module.scss'
import { HeaderProps } from './header.types'
import Logo from './logo'

import { Nav } from './nav/nav'

const Header: FC<HeaderProps> = ({ className }) => {
  const headerClassName = classNames(styles.root, className)
  return (
    <header className={headerClassName}>
      <Wrapper className={styles.wrapper}>
          <Logo />
        <div className={styles.navigation}>
          <SocialLinks className={styles.social} />
          <Nav />
        </div>
      </Wrapper>
    </header>
  )
}

export default Header
