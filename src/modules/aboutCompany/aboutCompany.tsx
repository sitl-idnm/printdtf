import { FC } from 'react'
import classNames from 'classnames'
import Link from 'next/link'

import styles from './aboutCompany.module.scss'
import { AboutCompanyProps } from './aboutCompany.types'

const AboutCompany: FC<AboutCompanyProps> = ({
  className,
  title = <>О&nbsp;компании</>,
  description = <>PrintDTF — производство и сервис под задачи бизнеса: печать, фулфилмент и логистика. Работаем быстро, прозрачно и по техническим требованиям.</>,
  bullets = [
    <>DTF и UV DTF печать — ярко, стойко, с контролем качества.</>,
    <>Подготовка/проверка макетов и понятные требования к файлам.</>,
    <>Сроки и стоимость — фиксируем до старта работ.</>,
    <>Доставка/отгрузки — под ваш график и формат (FBO/FBS).</>,
  ],
  stats = [
    { value: '1–3', label: 'дня средний срок изготовления' },
    { value: 'от 1', label: 'штуки — минимальный заказ' },
    { value: '24/7', label: 'приём заявок онлайн' },
  ],
  ctaPrimary = { label: 'Печать', href: '/print' },
  ctaSecondary = { label: 'Логистика', href: '/logistika' },
}) => {
  const rootClassName = classNames(styles.root, className)

  return (
    <section className={rootClassName} aria-label="О компании">
      <div className={styles.frame}>
        <div className={styles.grid}>
          <div className={styles.left}>
            <h2 className={styles.title}>{title}</h2>
            <p className={styles.desc}>{description}</p>

            <div className={styles.bullets}>
              {bullets.map((b, i) => (
                <div key={i} className={styles.bullet}>
                  <span className={styles.mark} aria-hidden="true" />
                  <span>{b}</span>
                </div>
              ))}
            </div>

            <div className={styles.actions}>
              <Link href={ctaPrimary.href} className={classNames(styles.btn, styles.btnPrimary)}>
                {ctaPrimary.label}
              </Link>
              <Link href={ctaSecondary.href} className={classNames(styles.btn, styles.btnSecondary)}>
                {ctaSecondary.label}
              </Link>
            </div>
          </div>

          <div className={styles.right}>
            <div className={styles.statsTitle}>Коротко в цифрах</div>
            <div className={styles.stats}>
              {stats.map((s, i) => (
                <div key={`${s.value}-${i}`} className={styles.stat}>
                  <div className={styles.value}>{s.value}</div>
                  <div className={styles.label}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutCompany
