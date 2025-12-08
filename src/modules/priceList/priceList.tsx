import { FC } from 'react'
import classNames from 'classnames'

import styles from './priceList.module.scss'
import { PriceListProps } from './priceList.types'
import { ButtonWave } from '@/ui'

const PriceList: FC<PriceListProps> = ({
  className
}) => {
  const rootClassName = classNames(styles.root, className)

  return (
    <div className={rootClassName}>
      <h2 className={styles.title}>Общие цены</h2>
      <p className={styles.intro}>Быстро посчитаем ориентировочную стоимость и сроки. Итог зависит от макета и тиража.</p>

      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.rowTop}>
            <div className={styles.label}>DTF погонный метр</div>
            <div className={styles.price}>СТОЛЬКО</div>
          </div>
          <div className={styles.muted}>Цена за 1 м.п. плёнки, печать и порезка включены.</div>
        </div>
        <div className={styles.card}>
          <div className={styles.rowTop}>
            <div className={styles.label}>UV DTF погонный метр</div>
            <div className={styles.price}>СТОЛЬКО</div>
          </div>
          <div className={styles.muted}>Прочная УФ-плёнка для неровных/жёстких поверхностей.</div>
        </div>
        <div className={styles.card}>
          <div className={styles.rowTop}>
            <div className={styles.label}>Перенос DTF</div>
            <div className={styles.price}>СТОЛЬКО</div>
          </div>
          <div className={styles.muted}>Перенос на изделие: пресc, контроль качества.</div>
        </div>
        <div className={styles.card}>
          <div className={styles.rowTop}>
            <div className={styles.label}>Перенос UV DTF</div>
            <div className={styles.price}>СТОЛЬКО</div>
          </div>
          <div className={styles.muted}>Клеевой перенос для твёрдых, сложных фактур.</div>
        </div>
        <div className={styles.card}>
          <div className={styles.rowTop}>
            <div className={styles.label}>Сложный перенос DTF</div>
            <div className={styles.price}>СТОЛЬКО</div>
          </div>
          <div className={styles.muted}>Много позиций, нестандартные места, комбинированные этапы.</div>
        </div>
        <div className={styles.card}>
          <div className={styles.rowTop}>
            <div className={styles.label}>Сложный перенос UV DTF</div>
            <div className={styles.price}>СТОЛЬКО</div>
          </div>
          <div className={styles.muted}>Криволинейные/рельефные поверхности, повышенная точность.</div>
        </div>
      </div>

      <h3 className={styles.sectionTitle}>Сроки</h3>
      <p className={styles.muted}>Стандарт: 1–3 рабочих дня. Срочно — по запросу, зависит от загрузки и тиража.</p>

      <h3 className={styles.sectionTitle}>Опции</h3>
      <p className={styles.muted}>Можно заказать только плёнку — перенесёте сами. Поможем с инструкцией.</p>

      <div className={styles.cta}>
        <ButtonWave variant="accent2" onClick={() => { if (typeof window !== 'undefined') window.location.href = 'tel:+79999999999' }}>
          Остались вопросы? Позвоните
        </ButtonWave>
        <ButtonWave variant="accent3" onClick={() => { if (typeof window !== 'undefined') window.open('https://t.me/username', '_blank', 'noopener,noreferrer') }}>
          Написать в Telegram
        </ButtonWave>
      </div>
    </div>
  )
}

export default PriceList
