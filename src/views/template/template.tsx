import { FC } from 'react'
import classNames from 'classnames'

import styles from './template.module.scss'
import { TemplateProps } from './template.types'
import { Faq } from '@/modules/faq'
import { Printitems } from '@/modules/printitems'
import { Wrapper } from '@/ui/wrapper'
// import { ViewportSection } from '@/modules/viewportSection'
import textileItems from '@/modules/printitems/presets/textile'
import brandingItems from '@/modules/printitems/presets/branding'

const Template: FC<TemplateProps> = ({
  className,
  printIcons,
  printItems
}) => {
  const rootClassName = classNames(styles.root, className)

  const faqData = [
    {
      title: 'test1',
      content: 'test1'
    },
    {
      title: 'test2',
      content: 'test2'
    }
  ]

  return (
    <main className={rootClassName}>
      <Wrapper>
        <Faq faqData={faqData} />
        <Faq faqData={faqData} />
        <Faq faqData={faqData} />
        <Printitems
          icons={printIcons ?? [
            '/icons/logo.svg',
            '/images/favicon/shark-fav.svg',
            '/icons/logo.svg',
            '/images/favicon/shark-fav.svg'
          ]}
          items={printItems ?? textileItems}
          visibleCorners={['bottomRight']}
        />
        <Printitems
          icons={printIcons ?? [
            '/icons/logo.svg',
            '/images/favicon/shark-fav.svg',
            '/icons/logo.svg',
            '/images/favicon/shark-fav.svg'
          ]}
          items={brandingItems}
          visibleCorners={['bottomLeft']}
        />
      </Wrapper>
    </main>
  )
}

export default Template
