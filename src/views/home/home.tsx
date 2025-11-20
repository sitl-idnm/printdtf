import { FC } from 'react'
import Image from 'next/image'
import { Heading, Wrapper } from '@/ui'
import classNames from 'classnames'

import styles from './home.module.scss'
import { HomeProps } from './home.types'
import SvgAnimator from '@/modules/svg-animator'

const Home: FC<HomeProps> = ({ className }) => {
  const rootClassName = classNames(styles.root, className)

  return (
    <main className={rootClassName}>
      <Wrapper>
        <Heading tagName="h1" className={styles.title}>
          Next.js template
        </Heading>
        <Image
          src="/images/sticker-shark.png"
          width={512}
          height={492}
          quality={85}
          id='card'
          alt="Ligazavr"
          className={styles.card}
        />
        <SvgAnimator
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

        </SvgAnimator>
      </Wrapper>
    </main>
  )
}

export default Home
