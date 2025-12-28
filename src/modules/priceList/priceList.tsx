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
      <h2 className={styles.title}>Цены</h2>
      <p className={styles.intro}>
        Быстро посчитаем ориентировочную стоимость и сроки. Итог зависит от макета и тиража.
        <span className={styles.badge}>Мин. стоимость заказа — 1000 ₽</span>
      </p>

      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.rowTop}>
            <div className={styles.label}>DTF погонный метр</div>
            <div className={styles.price}>1100 ₽ / м</div>
          </div>
          <div className={styles.muted}>Цена за 1 пог. метр (100×58 см): печать + порезка.</div>
          <div className={styles.subline}>От 30 м — <b>1000 ₽ / м</b></div>
        </div>
        <div className={styles.card}>
          <div className={styles.rowTop}>
            <div className={styles.label}>UV DTF погонный метр</div>
            <div className={styles.price}>1800 ₽ / м</div>
          </div>
          <div className={styles.muted}>Прочная УФ-плёнка для неровных/жёстких поверхностей.</div>
          <div className={styles.subline}>От 30 м — <b>1700 ₽ / м</b></div>
        </div>
        <div className={styles.card}>
          <div className={styles.rowTop}>
            <div className={styles.label}>Перенос на изделие</div>
            <div className={styles.price}>от 45 ₽</div>
          </div>
          <div className={styles.muted}>Цена зависит от сложности изделия и места нанесения.</div>
          <div className={styles.subline}>Макс. размер переноса: <b>38×58 см</b></div>
        </div>
        <div className={styles.card}>
          <div className={styles.rowTop}>
            <div className={styles.label}>Поштучная резка</div>
            <div className={styles.price}>от 250 ₽ / м</div>
          </div>
          <div className={styles.muted}>Поштучная резка/подрезка по метру — когда нужен тираж поштучно.</div>
        </div>
        <div className={styles.card}>
          <div className={styles.rowTop}>
            <div className={styles.label}>Плоттерная резка</div>
            <div className={styles.price}>от 4 ₽ / деталь</div>
          </div>
          <div className={styles.muted}>Рассчитывается по деталям (контур/кол-во/сложность).</div>
        </div>
        <div className={styles.card}>
          <div className={styles.rowTop}>
            <div className={styles.label}>Упаковка / распаковка</div>
            <div className={styles.price}>от 20 ₽ / шт</div>
          </div>
          <div className={styles.muted}>Подготовка товара под перенос/отгрузку — экономит время на производстве.</div>
        </div>
      </div>

      <div className={styles.infoRow}>
        <h3 className={styles.sectionTitle}>Сроки</h3>
        <p className={styles.muted}>Стандарт: 1–3 рабочих дня. Срочно — по запросу, зависит от загрузки и тиража.</p>
      </div>

      <div className={styles.infoRow}>
        <h3 className={styles.sectionTitle}>Важно</h3>
        <p className={styles.muted}>
          Погонный метр у нас — <b>100×58 см</b>. Максимально допустимый размер переноса DTF на изделие — <b>38×58 см</b>.
        </p>
      </div>

      <div className={styles.cta}>
        <ButtonWave variant="accent2" className={styles.btn} onClick={() => { if (typeof window !== 'undefined') window.location.href = 'tel:+79999999999' }}>
          Остались вопросы? Позвоните
        </ButtonWave>
        <ButtonWave variant="accent3" className={styles.btn} onClick={() => { if (typeof window !== 'undefined') window.open('https://t.me/username', '_blank', 'noopener,noreferrer') }}>
          Написать в Telegram
        </ButtonWave>
      </div>
    </div>
  )
}

export default PriceList
