import { FC } from 'react'
import { Wrapper } from '@/ui'
import classNames from 'classnames'

import styles from './home.module.scss'
import { HomeProps } from './home.types'
// import SvgAnimator from '@/modules/svg-animator'
import { ServicesMain } from '@/modules/servicesMain'
import { Stages } from '@/modules/stages'
import { SliderBeforeAfter } from '@/modules/sliderBeforeAfter'

const StagesArray = [
  { step: 1, title: 'test1' },
  { step: 2, title: 'test2' },
  { step: 3, title: 'test3' },
  { step: 4, title: 'test4' },
  { step: 5, title: 'test5' }
]

const Home: FC<HomeProps> = ({ className }) => {
  const rootClassName = classNames(styles.root, className)

  // const faqData = [
  //   {
  //     title: 'test1',
  //     content: 'test1'
  //   },
  //   {
  //     title: 'test2',
  //     content: 'test2'
  //   }
  // ]


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
        <ServicesMain />
        <Stages
          stageArray={StagesArray}
        />
        <SliderBeforeAfter />
      </Wrapper>
    </main>
  )
}

export default Home
