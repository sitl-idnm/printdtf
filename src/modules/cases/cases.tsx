import { FC, useMemo, useState } from 'react'
import classNames from 'classnames'
import Image from 'next/image'

import styles from './cases.module.scss'
import { CasesProps } from './cases.types'
import CaseModal from './caseModal'

const Cases: FC<CasesProps> = ({
  className,
  items
}) => {
  const rootClassName = classNames(styles.root, className)
  const [open, setOpen] = useState(false)
  type CaseItem = NonNullable<CasesProps['items']>[number] | {
    id: string | number
    kicker?: string
    type?: string
    title?: string
    image?: string
    meta?: string
    stats?: Array<{ value: string, note: string }>
  }
  const [selected, setSelected] = useState<CaseItem | null>(null)

  const data = useMemo(() => {
    if (items?.length) return items
    return [
      { id: 1, kicker: 'Сбер', type: 'UV DTF', title: 'Стикерпаки', image: '/images/sticker-shark.png' },
      { id: 2, kicker: 'Корпоративные уточки', type: 'UV DTF', title: 'Нанесение на резиновых уточек', image: '/images/sticker-dino.png' },
      { id: 3, kicker: 'ЛУКОЙЛ', type: 'DTF', title: 'Печать на футболках', image: '/images/sticker-shark.png' },
      { id: 4, kicker: 'Мосспорт', type: 'DTF', title: 'Нанесение на блокноты', image: '/images/sticker-dino.png' }
    ]
  }, [items])

  const handleOpen = (item: CaseItem) => {
    setSelected(item)
    setOpen(true)
  }

  return (
    <section className={rootClassName}>
      <div className={styles.grid}>
        {data.map((item) => {
          const { id, kicker, title, image, meta, type } = item
          return (
            <article key={id} className={styles.card} onClick={() => handleOpen(item)}>
              <div className={styles.circle}>
                <div className={styles.circleInner} />
              </div>

              <header className={styles.labels}>
                <div className={styles.kicker}>{kicker}</div>
                <h3 className={styles.title}>{title}</h3>
              </header>

            <div className={styles.media}>
              <Image className={styles.pic} src={image ?? '/images/sticker-dino.png'} alt="" width={640} height={480} />
            </div>

              <div className={styles.meta}>{type ?? meta}</div>
              <div className={styles.readMore}>смотреть<br />больше</div>
            </article>
          )
        })}
      </div>
      <CaseModal open={open} onClose={() => setOpen(false)} item={selected} />
    </section>
  )
}

export default Cases
