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
        <a target="_blank">
          VoidSharks.agency
        </a>
        <Social items={socialList} />
      </Wrapper>
    </footer>
  )
}

export default Footer
