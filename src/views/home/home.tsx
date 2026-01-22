'use client'
import { FC } from 'react'
import { Wrapper } from '@/ui'
import classNames from 'classnames'

import styles from './home.module.scss'
import { HomeProps } from './home.types'
// import SvgAnimator from '@/modules/svg-animator'
// import { ServicesMain } from '@/modules/servicesMain'
import { ServicesScroll } from '@/modules/servicesScroll'
import { AboutCompany } from '@/modules/aboutCompany'
import { Reviews } from '@/modules/reviews'

const Home: FC<HomeProps> = ({ className }) => {
  const rootClassName = classNames(styles.root, className)

  return (
    <main className={rootClassName}>
      <Wrapper>
        {/* <SvgAnimator
          externalSelector="#card"
          externalPlayOn={['mouseenter', 'focus']}
          externalReverseOn={['mouseleave', 'blur']}
          mode="hover"
          reverseTimeScale={2}
          drawFillMode="hide"
          drawOrder="parallel"
          strictHide={true}
          pixelsPerSecond={1}
          minAutoDuration={0.25}
          maxAutoDuration={2.5}
        >

        </SvgAnimator> */}
        {/* <ServicesMain /> */}
        <AboutCompany />
        <ServicesScroll />
        <Reviews />
      </Wrapper>
    </main>
  )
}

export default Home
